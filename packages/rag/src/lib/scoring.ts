// Use local nominal types compatible with branded strings from schemas, without importing deep internals
export type Ulid = string & { readonly __brand_ulid: unique symbol };
export type IsoDateTime = string & { readonly __brand_isoinstant: unique symbol };

export type ScoringWeights = Readonly<{ wSim: number; wRec: number; wDiversity: number }>;

export const DEFAULT_WEIGHTS: ScoringWeights = Object.freeze({ wSim: 0.8, wRec: 0.18, wDiversity: 0.02 });

export type Candidate = Readonly<{
  chunkId: Ulid;
  entityId: Ulid;
  similarity: number; // normalized [0, 1]
  updatedAt: IsoDateTime; // ISO instant
  diversityBoost?: number; // optional [0, 1]
}>;

export type ScoredCandidate = Readonly<{
  chunkId: Ulid;
  entityId: Ulid;
  sim: number;
  recency: number;
  diversityBoost: number;
  composite: number;
  updatedAt: IsoDateTime;
}>;

export function computeRecencyWeight(nowMs: number, updatedAt: IsoDateTime, halfLifeMinutes: number): number {
  // Convert ISO to time; guard invalid inputs deterministically to 0
  const ts = Date.parse(updatedAt);
  if (!Number.isFinite(ts) || halfLifeMinutes <= 0) return 0;
  const ageMinutes = Math.max(0, (nowMs - ts) / 60000);
  const lambda = Math.log(2) / halfLifeMinutes;
  const weight = Math.exp(-lambda * ageMinutes);
  // Clamp to [0,1]
  return weight < 0 ? 0 : weight > 1 ? 1 : weight;
}

export function scoreCandidates(
  candidates: readonly Candidate[],
  opts: Readonly<{ halfLifeMinutes: number; now?: number; weights?: ScoringWeights }>
): readonly ScoredCandidate[] {
  const now = typeof opts.now === 'number' ? opts.now : Date.now();
  const w = opts.weights ?? DEFAULT_WEIGHTS;
  return candidates.map((c) => {
    const rec = computeRecencyWeight(now, c.updatedAt, opts.halfLifeMinutes);
    const diversity = typeof c.diversityBoost === 'number' ? c.diversityBoost : 0;
    const composite = w.wSim * c.similarity + w.wRec * rec + w.wDiversity * diversity;
    return {
      chunkId: c.chunkId,
      entityId: c.entityId,
      sim: c.similarity,
      recency: rec,
      diversityBoost: diversity,
      composite,
      updatedAt: c.updatedAt
    } as const;
  });
}

export function deterministicSort(a: ScoredCandidate, b: ScoredCandidate): number {
  // primary: composite desc, then sim desc, then updatedAt desc, then chunkId asc
  if (a.composite !== b.composite) return a.composite > b.composite ? -1 : 1;
  if (a.sim !== b.sim) return a.sim > b.sim ? -1 : 1;
  const aTs = Date.parse(a.updatedAt);
  const bTs = Date.parse(b.updatedAt);
  if (aTs !== bTs) return aTs > bTs ? -1 : 1;
  return a.chunkId < b.chunkId ? -1 : a.chunkId > b.chunkId ? 1 : 0;
}

export function scoreAndSort(
  candidates: readonly Candidate[],
  opts: Readonly<{ halfLifeMinutes: number; now?: number; weights?: ScoringWeights }>
): readonly ScoredCandidate[] {
  return [...scoreCandidates(candidates, opts)].sort(deterministicSort);
}
