import { describe, expect, it, vi } from 'vitest';

import { createPgVectorRetriever, type PgVectorRow } from '../retriever.js';

import type { IsoDateTime, Ulid } from '../scoring.js';

const ULID = (n: number) => (`01HYA7Y3KZJ5MNS4AE8Q9R2B${(10 + n).toString(36).toUpperCase()}` as unknown as Ulid);
const NOW = new Date('2024-06-01T12:00:00.000Z').toISOString() as IsoDateTime;

describe('createPgVectorRetriever', () => {
  it('maps rows to candidates and reports vectorMs', async () => {
    const rows: readonly PgVectorRow[] = [
      { chunk_id: ULID(1), entity_id: ULID(2), similarity: 0.91, updated_at: NOW },
      { chunk_id: ULID(3), entity_id: ULID(4), similarity: 1.2, updated_at: NOW } // raw value passes through
    ];
    const runQuery = vi.fn().mockResolvedValue(rows);
    const retriever = createPgVectorRetriever({ runQuery });
    const res = await retriever.retrieve({ embedding: [0.1, 0.2], k: 10 });

    expect(retriever.kind).toBe('pgvector');
    expect(runQuery).toHaveBeenCalledOnce();
    expect(res.candidates.length).toBe(2);
    expect(res.candidates.map((c) => c.chunkId)).toEqual(rows.map((r) => r.chunk_id));
  const maxSim = Math.max(...res.candidates.map((c) => c.similarity));
  expect(maxSim).toBe(1.2);
    expect(res.vectorMs).toBeGreaterThanOrEqual(0);
  });

  it('passes through namespace and filters to runQuery', async () => {
    const runQuery = vi.fn().mockResolvedValue([]);
    const retriever = createPgVectorRetriever({ runQuery });
    await retriever.retrieve({ embedding: [0.3], k: 5, namespace: 'game:1', filters: { actor: 'A', recent: true } });
    expect(runQuery).toHaveBeenCalledWith([0.3], 5, { namespace: 'game:1', filters: { actor: 'A', recent: true } });
  });
});
