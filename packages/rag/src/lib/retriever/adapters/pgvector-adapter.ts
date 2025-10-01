import type { Candidate, IsoDateTime, Ulid } from '../../scoring.js';
import type { RetrieveOpts, RetrieveResult, Retriever, RetrieverAdapterKind } from '../types.js';

const ADAPTER_KIND: RetrieverAdapterKind = 'pgvector';

export type PgVectorRow = Readonly<{
  chunk_id: Ulid;
  entity_id: Ulid;
  similarity: number;
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
    kind: ADAPTER_KIND,
    async retrieve(opts: RetrieveOpts): Promise<RetrieveResult> {
      const start = performance.now();
      const rows = await runQuery(opts.embedding, opts.k, { namespace: opts.namespace, filters: opts.filters });
      const vectorMs = performance.now() - start;

      const candidates: Candidate[] = rows.map((row) => ({
        chunkId: row.chunk_id,
        entityId: row.entity_id,
        similarity: row.similarity,
        updatedAt: row.updated_at
      }));

      return { candidates, vectorMs } as const;
    }
  };
}

