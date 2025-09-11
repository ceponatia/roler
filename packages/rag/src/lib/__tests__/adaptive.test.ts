import { describe, expect, it } from 'vitest';

import { adaptiveRetrieve } from '../adaptive.js';

import type { Retriever } from '../retriever.js';
import type { Candidate, IsoDateTime, Ulid } from '../scoring.js';

const ULID = (s: string) => s as unknown as Ulid;
const ISO = (s: string) => s as unknown as IsoDateTime;

const cand = (id: string, ent: string, sim: number, iso: string): Candidate => ({
  chunkId: ULID(id),
  entityId: ULID(ent),
  similarity: sim,
  updatedAt: ISO(iso)
});

function mockRetriever(seq: Array<{ rows: Candidate[]; vectorMs?: number }>): Retriever {
  const calls: Array<{ k: number }> = [];
  const impl = {
    async retrieve(opts: { k: number }) {
      calls.push({ k: opts.k });
      const next = seq.shift() ?? { rows: [] };
      return { candidates: next.rows, vectorMs: next.vectorMs ?? 1 };
    }
  } satisfies Retriever;
  // attach calls for assertions (non-typed helper)
  (impl as any)._calls = calls;
  return impl;
}

describe('adaptiveRetrieve', () => {
  it('boosts when post-filtered < 0.75*limit and within half soft deadline', async () => {
    const retriever = mockRetriever([
      { rows: [cand('A', 'E1', 0.8, '2024-06-01T12:00:00.000Z')] },
      { rows: [cand('B', 'E2', 0.7, '2024-06-01T12:00:00.000Z')] }
    ]);
    const fixedNow = (() => {
      let t = 0;
      return () => (t += 10);
    })();

    const res = await adaptiveRetrieve({
      retriever,
      embedding: [0.1],
      baseK: 4,
      maxKBoost: 4,
      limit: 4,
      halfLifeMinutes: 240,
      diversityMinEntityPercent: 0.5,
      softPartialDeadlineMs: 200,
      now: fixedNow
    });

    expect(res.adaptiveUsed).toBe(true);
    expect(res.items.length).toBeGreaterThanOrEqual(1);
  });

  it('does not boost when enough candidates', async () => {
    const retriever = mockRetriever([
      {
        rows: [
          cand('A', 'E1', 0.9, '2024-06-01T12:00:00.000Z'),
          cand('B', 'E1', 0.85, '2024-06-01T12:00:00.000Z'),
          cand('C', 'E2', 0.8, '2024-06-01T12:00:00.000Z')
        ]
      }
    ]);
    const res = await adaptiveRetrieve({
      retriever,
      embedding: [0.1],
      baseK: 3,
      maxKBoost: 4,
      limit: 4,
      halfLifeMinutes: 240,
      diversityMinEntityPercent: 0.5,
      softPartialDeadlineMs: 200
    });
    expect(res.adaptiveUsed).toBe(false);
  });
});
