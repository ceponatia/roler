import { describe, expect, it } from 'vitest';

import { createRetrievalOrchestrator } from '../orchestrator.js';
import { createQueryResultCache, makeQueryKey } from '../query-result-cache.js';

import type { Retriever } from '../retriever.js';
import type { Candidate, IsoDateTime, Ulid } from '../scoring.js';
import type { RetrievalRequest } from '@roler/schemas';

const ULID = (s: string) => s as unknown as Ulid;
const V1 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C';
const V2 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7D';
const V3 = '01HYA7Y3KZJ5MNS4AE8Q9R2B7E';
const ISO = (s: string) => s as unknown as IsoDateTime;

const req: RetrievalRequest = {
  queryText: 'hello',
  gameId: '01HYA7Y3KZJ5MNS4AE8Q9R2B7C' as any
};

function mockRetriever(rows: Candidate[], vectorMs = 5): Retriever {
  return {
    async retrieve() {
      return { candidates: rows, vectorMs };
    }
  };
}

const cand = (id: string, ent: string, sim: number): Candidate => ({
  chunkId: ULID(id),
  entityId: ULID(ent),
  similarity: sim,
  updatedAt: ISO('2024-06-01T12:00:00.000Z')
});

describe('orchestrator', () => {
  it('returns cache hit without calling retriever', async () => {
    const cache = createQueryResultCache(10);
    const signature = JSON.stringify({ q: req.queryText, game: req.gameId, actor: null, incRes: false, limit: 5 });
    cache.set(makeQueryKey(signature), {
      itemIds: [ULID(V1)],
      scores: [0.9],
      stampMs: Date.now(),
      entities: [ULID(V2)]
    });
    let called = false;
    const retriever: Retriever = {
      async retrieve() {
        called = true;
        return { candidates: [], vectorMs: 0 };
      }
    };
    const embedder = async () => [0.1, 0.2];
    const orch = createRetrievalOrchestrator({ retriever, embedder, queryCache: cache, now: () => 0 }, { baseK: 5 });
    const res = await orch(req);
    expect(called).toBe(false);
    expect(res.items.length).toBe(1);
    expect(res.partial).toBe(false);
    expect(res.timings.vectorMs).toBe(0);
  });

  it('sets partial when soft deadline exceeded and results below min', async () => {
  const retriever = mockRetriever([cand(V1, V2, 0.8)]);
    const embedder = async () => [0.1];
    let t = 0;
    const now = () => (t += 200); // jump to exceed soft deadline quickly
    const orch = createRetrievalOrchestrator(
      { retriever, embedder, now },
      { baseK: 4, partialReturnPolicy: { minResults: 2, tag: 'retrieval' } as any }
    );
    const res = await orch(req, { softPartialDeadlineMs: 150 });
    expect(res.partial).toBe(true);
    expect(res.partialReason).toBe('SOFT_TIMEOUT');
  });

  it('executes full path and returns timings/stats', async () => {
  const retriever = mockRetriever([cand(V1, V2, 0.9), cand(V3, V2, 0.85)], 12);
    const embedder = async () => [0.1, 0.3];
    const orch = createRetrievalOrchestrator({ retriever, embedder, now: () => performance.now() }, { baseK: 5 });
    const res = await orch(req);
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.stats.kRequested).toBeGreaterThan(0);
    expect(res.timings.vectorMs).toBeGreaterThanOrEqual(0);
    expect(res.timings.postProcessMs).toBeGreaterThanOrEqual(0);
  });
});
