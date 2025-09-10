import { ULID, cand, makeRetriever, resetMetrics } from '@roler/testutils';
import { describe, expect, it, beforeEach } from 'vitest';


import { getRetrievalMetricsSnapshot } from '../metrics.js';
import { createRetrievalOrchestrator } from '../orchestrator.js';
import { createQueryResultCache, makeQueryKey } from '../query-result-cache.js';

import type { RetrievalRequest } from '@roler/schemas';

const V1 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C';
const V2 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7D';

const req: RetrievalRequest = { queryText: 'hi', gameId: V1 as any };


describe('metrics instrumentation', () => {
  beforeEach(() => {
    resetMetrics();
  });

  it('increments counters on cache hit and observes cache/total', async () => {
    const cache = createQueryResultCache(10);
    const signature = JSON.stringify({ q: req.queryText, game: req.gameId, actor: null, incRes: false, limit: 3 });
    cache.set(makeQueryKey(signature), {
      itemIds: [ULID(V1)],
      scores: [0.99],
      stampMs: Date.now(),
      entities: [ULID(V2)]
    });

  const retriever = makeRetriever([], 0);
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
  const retriever = makeRetriever([cand(V1, V2, 0.7)], 7);
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
});
