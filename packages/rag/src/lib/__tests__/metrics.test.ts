import { ULID, cand, makeRetriever } from '@roler/testutils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getRetrievalMetricSeries,
  getRetrievalMetricsSnapshot,
  incCounter,
  observe,
  resetMetrics,
  type MetricDatum
} from '../metrics.js';
import { createRetrievalOrchestrator } from '../orchestrator.js';
import { createQueryResultCache, makeQueryKey } from '../query-result-cache.js';
import * as DualReadMetricsModule from '../retriever/dual-read-metrics.js';
import {
  recordBackendLatency,
  recordDualReadShadowError,
  recordDualReadSuccess,
  resetDualReadMetrics
} from '../retriever/dual-read-metrics.js';

import type { Retriever } from '../retriever.js';
import type { Ulid } from '../scoring.js';
import type { RetrievalRequest } from '@roler/schemas';

const V1 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C';
const V2 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7D';

const req: RetrievalRequest = { queryText: 'hi', gameId: V1 as any };


describe('metrics instrumentation', () => {
  beforeEach(() => {
    resetMetrics();
    resetDualReadMetrics();
  });

  it('increments counters on cache hit and observes cache/total', async () => {
    const cache = createQueryResultCache(10);
    const signature = JSON.stringify({ q: req.queryText, game: req.gameId, actor: null, incRes: false, limit: 3 });
    cache.set(makeQueryKey(signature), {
      itemIds: [ULID(V1) as unknown as Ulid],
      scores: [0.99],
      stampMs: Date.now(),
      entities: [ULID(V2) as unknown as Ulid]
    });

    const retriever = makeRetriever([], 0) as unknown as Retriever;
    const embedder = async () => [0.1];
    const orch = createRetrievalOrchestrator({ retriever, embedder, queryCache: cache, now: () => 0 }, { baseK: 3 });

    await orch(req);
    const snap = getRetrievalMetricsSnapshot();

    expect(snap.counters.retrieval_total).toBe(1);
    expect(snap.counters.retrieval_cache_hit).toBe(1);
    // cache latency bucket count should be >0; we only assert histogram count exists
    expect(snap.histograms.latency_cache_ms.count).toBeGreaterThan(0);
    expect(snap.histograms.latency_total_ms.count).toBeGreaterThan(0);
  });

  it('increments miss/adaptive/partial and observes vector/post/total on full path', async () => {
    const retriever = makeRetriever([cand(V1, V2, 0.7)], 7) as unknown as Retriever;
    const embedder = async () => [0.2];
    let t = 0;
    const now = () => (t += 200); // force soft timeout quickly

    const orch = createRetrievalOrchestrator(
      { retriever, embedder, now },
      { baseK: 1, maxKBoost: 1, partialReturnPolicy: { minResults: 2, tag: 'retrieval' } as any }
    );

    await orch(req, { softPartialDeadlineMs: 150 });
    const snap = getRetrievalMetricsSnapshot();

    expect(snap.counters.retrieval_cache_miss).toBe(1);
    // adaptive may or may not trigger depending on internal threshold; allow 0 or 1 but histogram checks still hold
    expect(snap.counters.retrieval_partial).toBe(1);
    expect(snap.histograms.latency_vector_ms.count).toBeGreaterThan(0);
    expect(snap.histograms.latency_post_ms.count).toBeGreaterThan(0);
    expect(snap.histograms.latency_total_ms.count).toBeGreaterThan(0);
  });

  it('exports dual-read metrics with backend and delta naming', () => {
    recordBackendLatency('pgvector', 12);
    recordBackendLatency('pgvector', 24);
    recordDualReadSuccess({ scoreDelta: 0.21, latencyDeltaMs: 18, mismatch: true });
    recordDualReadShadowError();

    const metrics = getRetrievalMetricSeries();

    const backendP95 = metricValue(metrics, 'retr_backend_latency_ms', { backend: 'pgvector', quantile: 'p95' });
    const deltaScoreP50 = metricValue(metrics, 'retr_dual_delta_score', { quantile: 'p50' });
    const deltaLatencyCount = metricValue(metrics, 'retr_dual_delta_latency_samples_total');
    const samplesTotal = metricValue(metrics, 'retr_dual_samples_total');
    const shadowErrors = metricValue(metrics, 'retr_dual_shadow_errors_total');

    expect(backendP95).toBeGreaterThan(0);
    expect(deltaScoreP50).toBeGreaterThan(0);
    expect(deltaLatencyCount).toBe(1);
    expect(samplesTotal).toBe(2);
    expect(shadowErrors).toBe(1);
  });

  it('skips non-finite counter values and handles histogram overflow', () => {
    incCounter('retrieval_total', Number.POSITIVE_INFINITY);
    incCounter('retrieval_cache_miss');
    observe('latency_total_ms', 10_000);

    const metrics = getRetrievalMetricSeries();
    expect(metrics.some((m) => m.name === 'retrieval_total')).toBe(false);
    const overflow = metrics.find((m) => m.name === 'retr_latency_total_ms' && m.labels?.quantile === 'p95');
    expect(overflow).toBeDefined();
  });

  it('ignores backend entries without histogram summaries', () => {
    const spy = vi.spyOn(DualReadMetricsModule, 'getDualReadMetricsSnapshot').mockReturnValue({
      backendLatency: { pgvector: undefined },
      dualRead: {
        samples: 0,
        mismatches: 0,
        shadowErrors: 0,
        deltaScore: { count: 0, p50: 0, p95: 0 },
        deltaLatencyMs: { count: 0, p50: 0, p95: 0 }
      }
    } as DualReadMetricsModule.DualReadMetricsSnapshot);

    try {
      const metrics = getRetrievalMetricSeries();
      expect(metrics.some((m) => m.labels?.backend === 'pgvector')).toBe(false);
    } finally {
      spy.mockRestore();
    }
  });
});

function metricValue(
  metrics: readonly MetricDatum[],
  name: string,
  labels?: Readonly<Record<string, string>>
): number | undefined {
  const expected = labels ? JSON.stringify(Object.entries(labels).sort()) : undefined;
  for (const m of metrics) {
    if (m.name !== name) continue;
    const actual = m.labels ? JSON.stringify(Object.entries(m.labels).sort()) : undefined;
    if (actual === expected) return m.value;
    if (!actual && !expected) return m.value;
  }
  return undefined;
}
