import type { NormalizationPlan, RetrieverAdapterKind } from './types.js';
import type { Candidate } from '../scoring.js';

/**
 * Supported score normalization strategies that map backend-provided values into a common scale.
 */
export type NormalizationStrategy = 'cosine' | 'pgvector-l2';

/**
 * Pure normalizer instance that can project raw adapter scores into the configured target range.
 */
export type ScoreNormalizer = Readonly<{
  readonly strategy: NormalizationStrategy;
  readonly targetRange: readonly [number, number];
  normalize(candidates: readonly Candidate[]): readonly Candidate[];
  normalizeValue(value: number): number;
}>;

/**
 * Build a score normalizer that maps backend-specific similarity or distance values to a standardized range.
 * The `auto` strategy selects an adapter-specific default (pgvector → `pgvector-l2`, others → `cosine`).
 */
export function createScoreNormalizer(
  plan: NormalizationPlan,
  adapterKind: RetrieverAdapterKind
): ScoreNormalizer {
  const strategy = resolveStrategy(plan.strategy, adapterKind);
  const targetRange: readonly [number, number] = plan.targetRange;

  const normalizeValue = (value: number): number => applyTargetRange(translate(value, strategy), targetRange);
  const normalize = (candidates: readonly Candidate[]): readonly Candidate[] =>
    candidates.map((candidate) => updateSimilarity(candidate, normalizeValue(candidate.similarity)));

  return Object.freeze({
    strategy,
    targetRange,
    normalizeValue,
    normalize
  });
}

/**
 * Resolve the effective normalization strategy for a given adapter, expanding the `auto` option.
 */
export function resolveStrategy(strategy: NormalizationPlan['strategy'], adapterKind: RetrieverAdapterKind): NormalizationStrategy {
  if (strategy === 'auto') {
    return adapterKind === 'pgvector' ? 'pgvector-l2' : 'cosine';
  }
  return strategy;
}

function translate(value: number, strategy: NormalizationStrategy): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (strategy === 'cosine') {
    const clamped = clamp(value, -1, 1);
    return (clamped + 1) / 2;
  }

  const nonNegative = value < 0 ? 0 : value;
  if (nonNegative <= 1) {
    return clamp(nonNegative, 0, 1);
  }
  const decay = 1 / (1 + nonNegative);
  return clamp(decay, 0, 1);
}

function applyTargetRange(value: number, range: readonly [number, number]): number {
  const [min, max] = range;
  const clamped = clamp(value, 0, 1);
  return min + (max - min) * clamped;
}

function updateSimilarity(candidate: Candidate, similarity: number): Candidate {
  if (typeof candidate.diversityBoost === 'number') {
    return {
      chunkId: candidate.chunkId,
      entityId: candidate.entityId,
      similarity,
      updatedAt: candidate.updatedAt,
      diversityBoost: candidate.diversityBoost
    } satisfies Candidate;
  }
  return {
    chunkId: candidate.chunkId,
    entityId: candidate.entityId,
    similarity,
    updatedAt: candidate.updatedAt
  } satisfies Candidate;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
