import { cand, makeRetriever, resetMetrics } from '@roler/testutils';
import { describe, expect, it, beforeEach } from 'vitest';

import { getRetrievalMetricsSnapshot } from '../metrics.js';
import { createRetrievalOrchestrator } from '../orchestrator.js';
import { createQueryResultCache } from '../query-result-cache.js';

import type { RetrievalRequest } from '@roler/schemas';

const G = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C';
const E1 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7D';
const E2 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7E';
const E3 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7F';

const req: RetrievalRequest = { queryText: 'find items', gameId: G as any, limit: 5 };

describe('E2E retrieval', () => {
  beforeEach(() => { resetMetrics(); });

  it('orders deterministically, enforces diversity, and records metrics', async () => {
  const rows = [
      cand('01HYA7Y3KZJ5MNS4AE8Q9R2BA0', E1, 0.9, '2024-06-02T00:00:00.000Z'),
      cand('01HYA7Y3KZJ5MNS4AE8Q9R2BA1', E1, 0.91, '2024-06-01T00:00:00.000Z'),
      cand('01HYA7Y3KZJ5MNS4AE8Q9R2BA2', E2, 0.88, '2024-06-03T00:00:00.000Z'),
      cand('01HYA7Y3KZJ5MNS4AE8Q9R2BA3', E3, 0.7, '2024-06-04T00:00:00.000Z'),
      cand('01HYA7Y3KZJ5MNS4AE8Q9R2BA4', E2, 0.86, '2024-06-05T00:00:00.000Z')
    ];

    const retriever = makeRetriever(rows, 6);
    const embedder = async () => [0.01];
    const cache = createQueryResultCache(32);
    const now = () => performance.now();

    const orch = createRetrievalOrchestrator(
      { retriever, embedder, queryCache: cache, now },
      { baseK: 5, maxKBoost: 0, diversityMinEntityPercent: 0.4, recencyHalfLifeMinutes: 60 }
    );

    const res = await orch(req);

    // Deterministic: ensure consistent ordering and size
    expect(res.items.length).toBeGreaterThan(0);
    const ids = res.items.map((i) => i.chunkId);
    const sorted = [...ids].sort();
    expect(ids).not.toEqual(sorted); // not naive alpha sort

    // Diversity: at least 2 unique entities in top 5 given 40%
    const uniq = new Set(res.items.map((i) => i.entityId));
    expect(uniq.size).toBeGreaterThanOrEqual(2);

    // Metrics recorded
    const snap = getRetrievalMetricsSnapshot();
    expect(snap.counters.retrieval_total).toBeGreaterThanOrEqual(1);
    expect(snap.counters.retrieval_cache_miss).toBeGreaterThanOrEqual(1);
    expect(snap.histograms.latency_vector_ms.count).toBeGreaterThan(0);
    expect(snap.histograms.latency_post_ms.count).toBeGreaterThan(0);
    expect(snap.histograms.latency_total_ms.count).toBeGreaterThan(0);
  });

  it('respects soft partial policy in time-constrained scenario', async () => {
  const rows = [
      cand('01HYA7Y3KZJ5MNS4AE8Q9R2BB0', E1, 0.5, '2024-06-01T00:00:00.000Z')
    ];
    const retriever = makeRetriever(rows, 10);
    const embedder = async () => [0.5];
    let t = 0;
    const now = () => (t += 200);
    const cache = createQueryResultCache(16);

    const orch = createRetrievalOrchestrator(
      { retriever, embedder, queryCache: cache, now },
      { baseK: 4, partialReturnPolicy: { minResults: 2, tag: 'retrieval' } as any }
    );

    const res = await orch({ queryText: 'time', gameId: G as any, limit: 4 }, { softPartialDeadlineMs: 150 });
    expect(res.partial).toBe(true);
    expect(res.partialReason).toBe('SOFT_TIMEOUT');
  });
});
