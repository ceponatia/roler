import { PartialReturnReasonEnum, RetrievalRequestSchema, RetrievalResponseSchema } from '@roler/schemas';

import { adaptiveRetrieve } from './adaptive.js';
import { resolveRetrievalConfig } from './config.js';
import { incCounter, observe } from './metrics.js';
import { makeQueryKey, type QueryResultCacheApi } from './query-result-cache.js';

import type { Retriever } from './retriever.js';
import type { Ulid } from './scoring.js';
import type { RetrievalConfig, RetrievalRequest, RetrievalResponse } from '@roler/schemas';

export type Embedder = (text: string) => Promise<readonly number[]>;

export type OrchestratorDeps = Readonly<{
  retriever: Retriever;
  embedder: Embedder;
  queryCache?: QueryResultCacheApi;
  now?: () => number; // perf clock in ms
}>;

export function createRetrievalOrchestrator(
  deps: OrchestratorDeps,
  baseConfig?: Partial<RetrievalConfig>
): (request: RetrievalRequest, overrides?: Partial<RetrievalConfig>) => Promise<RetrievalResponse> {
  const now = deps.now ?? (() => performance.now());
  const baseCfg = resolveRetrievalConfig(baseConfig);

  return async (request, overrides) => {
    const t0 = now();
    const req = RetrievalRequestSchema.parse(request);
    const cfg = resolveRetrievalConfig({ ...baseCfg, ...(overrides ?? {}) });

    // Clamp limit to config guardrails
    const maxLimit = Math.min(64, cfg.baseK + cfg.maxKBoost);
    const limit = Math.min(req.limit ?? cfg.baseK, maxLimit);

    // 1) Query cache look-up
    const cacheStart = now();
    const signature = stableSignature(req, { limit });
    const qk = makeQueryKey(signature);
    const cached = deps.queryCache?.get(qk);
    const afterCacheGet = now();
    observe('latency_cache_ms', afterCacheGet - cacheStart);
    if (cached) {
      incCounter('retrieval_cache_hit');
      const items = cached.itemIds.map((chunkId, idx) => ({
        chunkId: String(chunkId),
        entityId: String(inferEntityIdFromCache(cached, idx)),
        score: cached.scores[idx] ?? 0,
        reasonBits: [] as const
      }));
      const totalMs = now() - t0;
      const response = RetrievalResponseSchema.parse({
        items: items.slice(0, limit),
        partial: false,
        timings: {
          totalMs,
          vectorMs: 0,
          postProcessMs: 0,
          cacheMs: afterCacheGet - cacheStart
        },
        stats: { kRequested: limit, kUsed: Math.min(limit, items.length), candidateCount: items.length, filteredCount: 0 }
      });
      incCounter('retrieval_total');
      observe('latency_total_ms', totalMs);
      return response;
    }

    // 2) Embed query text
    const embedding = await deps.embedder(req.queryText);

    // 3) Execute retrieval with AdaptiveK and post-processing
    const result = await adaptiveRetrieve({
      retriever: deps.retriever,
      embedding,
      baseK: cfg.baseK,
      maxKBoost: cfg.maxKBoost,
      limit,
      halfLifeMinutes: cfg.recencyHalfLifeMinutes,
      diversityMinEntityPercent: cfg.diversityMinEntityPercent,
      softPartialDeadlineMs: cfg.softPartialDeadlineMs,
      namespace: req.gameId as unknown as string,
      // Filter/policies: wiring point for includeRestricted/actor later
      backendFilters: undefined,
      filterPredicate: undefined,
      now
    });
  incCounter('retrieval_cache_miss');
  if (result.adaptiveUsed) incCounter('retrieval_adaptive_used');
  observe('latency_vector_ms', result.timings.vectorMs);

    // 4) Partial policy
    const elapsed = now() - t0;
    const minResults = cfg.partialReturnPolicy.minResults;
    const softExceeded = elapsed > cfg.softPartialDeadlineMs;
    const partial = softExceeded && result.stats.kUsed < minResults;
  if (partial) incCounter('retrieval_partial');

    // 5) Cache store
    const toCache = {
      itemIds: result.items.map((i) => i.chunkId),
      scores: result.items.map((i) => i.score),
      stampMs: Date.now(),
      entities: uniqueEntityIds(result.items)
    } as const;
    const beforeCacheSet = now();
    deps.queryCache?.set(qk, toCache);
    const afterCacheSet = now();

    const response = RetrievalResponseSchema.parse({
      items: result.items.slice(0, limit).map((i) => ({
        chunkId: String(i.chunkId),
        entityId: String(i.entityId),
        score: i.score,
        reasonBits: i.reasonBits
      })),
      partial,
      partialReason: partial ? PartialReturnReasonEnum.enum.SOFT_TIMEOUT : undefined,
      timings: {
        totalMs: elapsed,
        vectorMs: result.timings.vectorMs,
        postProcessMs: result.timings.postProcessMs,
        cacheMs: (afterCacheGet - cacheStart) + (afterCacheSet - beforeCacheSet)
      },
      stats: result.stats
    });
    // Group terminal metrics near the return for clarity
    incCounter('retrieval_total');
    observe('latency_post_ms', result.timings.postProcessMs);
    observe('latency_total_ms', elapsed);

    return response as RetrievalResponse;
  };
}

function uniqueEntityIds(items: readonly { entityId: Ulid }[]): readonly Ulid[] {
  const set = new Set<Ulid>();
  for (const i of items) set.add(i.entityId);
  return [...set];
}

function stableSignature(req: RetrievalRequest, extra: Readonly<{ limit: number }>): string {
  return JSON.stringify({
    q: req.queryText,
    game: req.gameId,
    actor: req.actorEntityId ?? null,
    incRes: req.includeRestricted ?? false,
    limit: extra.limit
  });
}

function inferEntityIdFromCache(cached: { entities: readonly Ulid[] }, _idx: number): Ulid {
  // In this simple cache design, we don't store per-item entity mapping. As a stopgap,
  // return the first entity if present; otherwise a branded empty string cast.
  const e = cached.entities[0];
  return (e ?? ('' as unknown as Ulid));
}
