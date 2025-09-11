import type { Candidate, IsoDateTime, Ulid } from './scoring.js';

// Retriever interface returning raw vector candidates + timing (no post-processing here)
export type RetrieveOpts = Readonly<{
  embedding: readonly number[];
  k: number;
  namespace?: string;
  // Simple backend-agnostic filters; adapter may ignore unsupported keys
  filters?: Readonly<Record<string, string | number | boolean>>;
}>;

export type RetrieveResult = Readonly<{
  candidates: readonly Candidate[];
  vectorMs: number;
}>;

export interface Retriever {
  retrieve(opts: RetrieveOpts): Promise<RetrieveResult>;
}

// Minimal dependency contract for pgvector-backed retriever
export type PgVectorRow = Readonly<{
  chunk_id: Ulid;
  entity_id: Ulid;
  similarity: number; // normalized [0,1] (adapter should normalize if backend returns distance)
  updated_at: IsoDateTime;
}>;

export type RunPgVectorQuery = (
  embedding: readonly number[],
  k: number,
  args: Readonly<{ namespace?: string; filters?: Readonly<Record<string, string | number | boolean>> }>
) => Promise<readonly PgVectorRow[]>;

export function createPgVectorRetriever(deps: Readonly<{ runQuery: RunPgVectorQuery }>): Retriever {
  const { runQuery } = deps;

  return {
    async retrieve(opts) {
      const start = performance.now();
      const rows = await runQuery(opts.embedding, opts.k, { namespace: opts.namespace, filters: opts.filters });
      const vectorMs = performance.now() - start;

      // Map rows to Candidate shape; clamp similarity to [0,1]
      const candidates: Candidate[] = rows.map((r) => ({
        chunkId: r.chunk_id,
        entityId: r.entity_id,
        similarity: clamp01(r.similarity),
        updatedAt: r.updated_at
      }));

      return { candidates, vectorMs } as const;
    }
  };
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
