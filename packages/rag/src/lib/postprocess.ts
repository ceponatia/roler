import { scoreAndSort, type Candidate, type ScoredCandidate, type Ulid } from './scoring.js';

export type PostProcessInput = Readonly<{
  candidates: readonly Candidate[];
  nowMs?: number;
  halfLifeMinutes: number;
  limit: number;
  diversityMinEntityPercent: number; // [0,1]
  filter?: (c: Candidate) => boolean;
}>;

export type PostProcessItem = Readonly<{
  chunkId: Ulid;
  entityId: Ulid;
  score: number;
  reasonBits: readonly string[];
}>;

export type PostProcessResult = Readonly<{
  items: readonly PostProcessItem[];
  stats: Readonly<{ kRequested: number; kUsed: number; candidateCount: number; filteredCount: number }>;
  postProcessMs: number;
}>;

export function postProcess(input: PostProcessInput): PostProcessResult {
  const start = performance.now();
  const k = input.limit;
  const totalCandidates = input.candidates.length;

  const filtered = input.filter ? input.candidates.filter(input.filter) : [...input.candidates];
  const filteredCount = totalCandidates - filtered.length;

  // Score + deterministic sort
  const opts: { readonly halfLifeMinutes: number; readonly now?: number } =
    input.nowMs === undefined
      ? { halfLifeMinutes: input.halfLifeMinutes }
      : { halfLifeMinutes: input.halfLifeMinutes, now: input.nowMs };
  const scored = scoreAndSort(filtered, opts);

  // Diversity enforcement
  const minUnique = Math.max(0, Math.ceil(k * input.diversityMinEntityPercent));
  const selected = pickWithDiversity(scored, k, minUnique);

  const items: PostProcessItem[] = selected.map((s) => ({
    chunkId: s.chunkId,
    entityId: s.entityId,
    score: s.composite,
    reasonBits: s.__diversity ? (['DIVERSITY'] as const) : ([] as const)
  }));

  const postProcessMs = performance.now() - start;
  return {
    items,
    stats: { kRequested: k, kUsed: items.length, candidateCount: filtered.length, filteredCount },
    postProcessMs
  } as const;
}

type ScoredWithDiversity = ScoredCandidate & { readonly __diversity?: true };

function pickWithDiversity(
  scored: readonly ScoredCandidate[],
  limit: number,
  minUniqueEntities: number
): readonly ScoredWithDiversity[] {
  if (limit <= 0 || scored.length === 0) return [];
  const byEntityFirst: ScoredWithDiversity[] = [];
  const seenEntities = new Set<Ulid>();
  const chosenChunkIds = new Set<Ulid>();

  // First pass: ensure minimum unique entities
  for (const s of scored) {
    if (byEntityFirst.length >= limit) break;
    if (!seenEntities.has(s.entityId)) {
      byEntityFirst.push({ ...s, __diversity: true });
      seenEntities.add(s.entityId);
      chosenChunkIds.add(s.chunkId);
      if (seenEntities.size >= minUniqueEntities) break;
    }
  }

  // Second pass: fill remaining slots preserving order, allowing duplicates
  if (byEntityFirst.length < limit) {
    for (const s of scored) {
      if (byEntityFirst.length >= limit) break;
      if (!chosenChunkIds.has(s.chunkId)) {
        byEntityFirst.push(s);
        chosenChunkIds.add(s.chunkId);
      }
    }
  }

  return byEntityFirst.slice(0, limit);
}
