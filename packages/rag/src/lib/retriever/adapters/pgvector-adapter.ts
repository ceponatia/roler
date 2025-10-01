import type { Candidate, IsoDateTime, Ulid } from '../../scoring.js';
import type { RetrieveOpts, RetrieveResult, RetrieverAdapter, RetrieverAdapterKind } from '../types.js';
import type { PgVectorAdapterConfig } from '@roler/schemas';

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

export type PgVectorRetrieverDeps = Readonly<{
  config: PgVectorAdapterConfig;
  runQuery: RunPgVectorQuery;
}>;

export function createPgVectorRetriever(deps: PgVectorRetrieverDeps): RetrieverAdapter {
  const { runQuery, config } = deps;

  return {
    kind: ADAPTER_KIND,
    config,
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
  } satisfies RetrieverAdapter;
}

