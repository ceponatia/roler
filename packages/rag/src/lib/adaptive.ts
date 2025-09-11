import { postProcess, type PostProcessItem, type PostProcessResult } from './postprocess.js';

import type { Retriever } from './retriever.js';
import type { Candidate } from './scoring.js';

export type AdaptiveKInput = Readonly<{
  retriever: Retriever;
  embedding: readonly number[];
  baseK: number;
  maxKBoost: number;
  limit: number;
  halfLifeMinutes: number;
  diversityMinEntityPercent: number;
  softPartialDeadlineMs: number;
  namespace?: string;
  backendFilters?: Readonly<Record<string, string | number | boolean>>;
  filterPredicate?: (c: Candidate) => boolean;
  now?: () => number; // default performance.now
}>;

export type AdaptiveKResult = Readonly<{
  items: readonly PostProcessItem[];
  stats: Readonly<{ kRequested: number; kUsed: number; candidateCount: number; filteredCount: number }>;
  timings: Readonly<{ vectorMs: number; postProcessMs: number }>;
  adaptiveUsed: boolean;
}>;

export async function adaptiveRetrieve(input: AdaptiveKInput): Promise<AdaptiveKResult> {
  const now = input.now ?? (() => performance.now());
  const t0 = now();

  // First query with baseK
  const first = await input.retriever.retrieve({
    embedding: input.embedding,
    k: input.baseK,
    namespace: input.namespace,
    filters: input.backendFilters
  });

  let vectorMs = first.vectorMs;
  const merged: Candidate[] = [...first.candidates];

  // Initial post-process to observe candidateCount and filtered count
  const initial: PostProcessResult = postProcess({
    candidates: merged,
    halfLifeMinutes: input.halfLifeMinutes,
    limit: input.limit,
    diversityMinEntityPercent: input.diversityMinEntityPercent,
    filter: input.filterPredicate
  });

  const elapsed = now() - t0;
  const threshold = input.limit * 0.75;
  const canBoost =
    input.maxKBoost > 0 && initial.stats.candidateCount < threshold && elapsed < input.softPartialDeadlineMs / 2;

  let adaptiveUsed = false;
  if (canBoost) {
    const second = await input.retriever.retrieve({
      embedding: input.embedding,
      k: input.maxKBoost,
      namespace: input.namespace,
      filters: input.backendFilters
    });
    vectorMs += second.vectorMs;
    adaptiveUsed = true;
    // Merge with de-dup by chunkId
    const seen = new Set<string>(merged.map((c) => c.chunkId as unknown as string));
    for (const c of second.candidates) {
      const id = c.chunkId as unknown as string;
      if (!seen.has(id)) {
        merged.push(c);
        seen.add(id);
      }
    }
  }

  // Final post-process on merged set
  const finalPP = postProcess({
    candidates: merged,
    halfLifeMinutes: input.halfLifeMinutes,
    limit: input.limit,
    diversityMinEntityPercent: input.diversityMinEntityPercent,
    filter: input.filterPredicate
  });

  return {
    items: finalPP.items,
    stats: finalPP.stats,
    timings: { vectorMs, postProcessMs: finalPP.postProcessMs },
    adaptiveUsed
  } as const;
}
