import { describe, expect, it } from 'vitest';

import { createScoreNormalizer, resolveStrategy } from '../normalizer.js';

import type { Candidate, IsoDateTime, Ulid } from '../../scoring.js';

const UPDATED_AT = new Date('2024-01-01T00:00:00.000Z').toISOString() as IsoDateTime;

const ULID = (prefix: string, n: number): Ulid => (`${prefix}${(10 + n).toString(16).toUpperCase()}` as unknown as Ulid);

const makeCandidate = (similarity: number, suffix: number, diversity?: number): Candidate => {
  const base = {
    chunkId: ULID('01HYA7Y3KZJ5MNS4AE8Q9R2B', suffix),
    entityId: ULID('01HYA7Y3KZJ5MNS4AE8Q9R3B', suffix),
    similarity,
    updatedAt: UPDATED_AT
  };

  if (typeof diversity === 'number') {
    return { ...base, diversityBoost: diversity } satisfies Candidate;
  }
  return base satisfies Candidate;
};

describe('resolveStrategy', () => {
  it('selects pgvector-l2 for pgvector adapters when strategy is auto', () => {
    expect(resolveStrategy('auto', 'pgvector')).toBe('pgvector-l2');
  });

  it('falls back to cosine for non-pgvector adapters when strategy is auto', () => {
    expect(resolveStrategy('auto', 'qdrant')).toBe('cosine');
  });

  it('returns explicit strategies unchanged', () => {
    expect(resolveStrategy('cosine', 'pgvector')).toBe('cosine');
  });
});

describe('createScoreNormalizer', () => {
  it('normalizes cosine similarities to [0,1]', () => {
    const normalizer = createScoreNormalizer({ strategy: 'cosine', targetRange: [0, 1] }, 'qdrant');
    const input = [makeCandidate(-1, 1), makeCandidate(0, 2), makeCandidate(1, 3)];

    const normalized = normalizer.normalize(input);
    expect(normalized.map((c) => c.similarity)).toEqual([0, 0.5, 1]);
  });

  it('applies target range scaling', () => {
    const normalizer = createScoreNormalizer({ strategy: 'cosine', targetRange: [0.2, 0.8] }, 'qdrant');
    const [candidate] = normalizer.normalize([makeCandidate(0, 4, 0.2)]);

    expect(candidate.similarity).toBeCloseTo(0.5, 6);
    expect(candidate.diversityBoost).toBe(0.2);
  });

  it('passes through values already in [0,1] for pgvector-l2 strategy', () => {
    const normalizer = createScoreNormalizer({ strategy: 'pgvector-l2', targetRange: [0, 1] }, 'pgvector');
    const [zeroSeven] = normalizer.normalize([makeCandidate(0.7, 5)]);
    expect(zeroSeven.similarity).toBeCloseTo(0.7, 6);
  });

  it('decays distances greater than one for pgvector-l2 strategy', () => {
    const normalizer = createScoreNormalizer({ strategy: 'pgvector-l2', targetRange: [0, 1] }, 'pgvector');
    const [candidate] = normalizer.normalize([makeCandidate(3, 6)]);
    expect(candidate.similarity).toBeCloseTo(0.25, 6);
  });

  it('exposes normalizeValue helper mirroring normalize()', () => {
    const normalizer = createScoreNormalizer({ strategy: 'cosine', targetRange: [0, 1] }, 'qdrant');
    expect(normalizer.normalizeValue(1)).toBe(1);
  });

  it('maps non-finite values to the lower bound of the target range', () => {
    const normalizer = createScoreNormalizer({ strategy: 'cosine', targetRange: [0.1, 0.9] }, 'qdrant');
    expect(normalizer.normalizeValue(Number.POSITIVE_INFINITY)).toBeCloseTo(0.1, 6);
  });

  it('clamps negative distances to zero for pgvector-l2', () => {
    const normalizer = createScoreNormalizer({ strategy: 'pgvector-l2', targetRange: [0, 1] }, 'pgvector');
    expect(normalizer.normalizeValue(-5)).toBe(0);
  });
});
