import type { Candidate, IsoDateTime, Ulid } from '../../scoring.js';
import type { RetrieveOpts, RetrieveResult, RetrieverAdapter, RetrieverAdapterKind } from '../types.js';
import type { QdrantAdapterConfig } from '@roler/schemas';

const ADAPTER_KIND: RetrieverAdapterKind = 'qdrant';

/**
 * Qdrant point payload structure matching our retrieval contract.
 */
export type QdrantPoint = Readonly<{
  id: string | number;
  payload: Readonly<{
    chunk_id: Ulid;
    entity_id: Ulid;
    updated_at: IsoDateTime;
    [key: string]: unknown;
  }>;
  score: number;
}>;

/**
 * Qdrant search response structure.
 */
export type QdrantSearchResponse = Readonly<{
  result: readonly QdrantPoint[];
}>;

/**
 * Function signature for executing a Qdrant search query.
 * Implementers should call the Qdrant REST API `/collections/{collection}/points/search` endpoint.
 */
export type RunQdrantSearch = (
  collection: string,
  vector: readonly number[],
  limit: number,
  args: Readonly<{
    filter?: Readonly<Record<string, unknown>>;
    consistency?: 'eventual' | 'strong';
    timeout?: number;
  }>
) => Promise<QdrantSearchResponse>;

/**
 * Dependencies required to construct a Qdrant retriever adapter.
 */
export type QdrantRetrieverDeps = Readonly<{
  config: QdrantAdapterConfig;
  search: RunQdrantSearch;
}>;

/**
 * Create a Qdrant-backed retriever adapter.
 *
 * @param deps - Configuration and search function dependency
 * @returns RetrieverAdapter compliant with the pluggable retriever contract
 *
 * @example
 * ```typescript
 * import { createQdrantRetriever } from '@roler/rag';
 *
 * const config = {
 *   kind: 'qdrant',
 *   url: 'https://qdrant.example.com:6333',
 *   apiKey: process.env.QDRANT_API_KEY,
 *   collection: 'embeddings',
 *   timeoutMs: 5000,
 *   consistency: 'eventual',
 *   namespaceField: 'namespace'
 * };
 *
 * const retriever = createQdrantRetriever({
 *   config,
 *   search: async (collection, vector, limit, args) => {
 *     const response = await fetch(`${config.url}/collections/${collection}/points/search`, {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         ...(config.apiKey && { 'api-key': config.apiKey })
 *       },
 *       body: JSON.stringify({
 *         vector,
 *         limit,
 *         with_payload: true,
 *         ...(args.filter && { filter: args.filter }),
 *         ...(args.consistency && { consistency: args.consistency })
 *       })
 *     });
 *     return response.json();
 *   }
 * });
 * ```
 */
export function createQdrantRetriever(deps: QdrantRetrieverDeps): RetrieverAdapter {
  const { config, search } = deps;

  return {
    kind: ADAPTER_KIND,
    config,
    async retrieve(opts: RetrieveOpts): Promise<RetrieveResult> {
      const start = performance.now();

      // Build Qdrant filter from namespace and additional filters
      const filter = buildQdrantFilter(opts.namespace, opts.filters, config.namespaceField);

      const response = await search(config.collection, opts.embedding, opts.k, {
        filter,
        consistency: config.consistency,
        timeout: config.timeoutMs
      });

      const vectorMs = performance.now() - start;

      const candidates: Candidate[] = response.result.map((point) => ({
        chunkId: point.payload.chunk_id,
        entityId: point.payload.entity_id,
        similarity: point.score,
        updatedAt: point.payload.updated_at
      }));

      return { candidates, vectorMs } as const;
    }
  } satisfies RetrieverAdapter;
}

/**
 * Build a Qdrant filter combining namespace and additional filters.
 */
function buildQdrantFilter(
  namespace: string | undefined,
  filters: RetrieveOpts['filters'],
  namespaceField: string
): Record<string, unknown> | undefined {
  const conditions: Array<Record<string, unknown>> = [];

  if (namespace) {
    conditions.push({
      key: namespaceField,
      match: { value: namespace }
    });
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      conditions.push({
        key,
        match: { value }
      });
    }
  }

  if (conditions.length === 0) {
    return undefined;
  }

  if (conditions.length === 1) {
    return { must: [conditions[0]] };
  }

  return { must: conditions };
}
