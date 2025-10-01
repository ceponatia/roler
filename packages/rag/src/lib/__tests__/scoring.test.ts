import { describe, expect, it, vi } from 'vitest';

import {
  computeRecencyWeight,
  deterministicSort,
  scoreAndSort,
  scoreCandidates,
  type Candidate,
  type ScoredCandidate
} from '../scoring.js';

const ULID_A = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C' as unknown as Candidate['chunkId'];
const ULID_B = '01HYA7Y3KZJ5MNS4AE8Q9R2B7D' as unknown as Candidate['chunkId'];

const iso = (stamp: number): Candidate['updatedAt'] =>
  new Date(stamp).toISOString() as unknown as Candidate['updatedAt'];

describe('computeRecencyWeight', () => {
  it('decays with half-life', () => {
    const now = Date.UTC(2025, 0, 1);
    const past = iso(now - 60 * 60 * 1000); // 60 minutes ago
    const w30 = computeRecencyWeight(now, past, 30); // two half-lives => ~0.25
    expect(w30).toBeGreaterThan(0.2);
    expect(w30).toBeLessThan(0.3);
  });

  it('returns zero for invalid timestamps or non-positive half-life', () => {
    const now = Date.UTC(2025, 0, 1);
    const invalidIso = 'not-a-date' as unknown as Parameters<typeof computeRecencyWeight>[1];
    const validIso = iso(now);

    expect(computeRecencyWeight(now, invalidIso, 30)).toBe(0);
    expect(computeRecencyWeight(now, validIso, 0)).toBe(0);
    expect(computeRecencyWeight(now, validIso, -15)).toBe(0);
  });

  it('clamps values above 1 down to 1', () => {
    const expSpy = vi.spyOn(Math, 'exp').mockReturnValue(1.5);
    try {
      const now = Date.UTC(2025, 0, 1);
      const weight = computeRecencyWeight(now, iso(now), 60);
      expect(weight).toBe(1);
    } finally {
      expSpy.mockRestore();
    }
  });

  it('clamps negative values up to 0', () => {
    const expSpy = vi.spyOn(Math, 'exp').mockReturnValue(-0.1);
    try {
      const now = Date.UTC(2025, 0, 1);
      const weight = computeRecencyWeight(now, iso(now + 1_000), 60);
      expect(weight).toBe(0);
    } finally {
      expSpy.mockRestore();
    }
  });
});

describe('scoreCandidates', () => {
  it('includes diversity boosts and respects custom weights', () => {
    const now = Date.UTC(2025, 0, 1);
    const candidate: Candidate = {
      chunkId: ULID_A,
      entityId: ULID_A,
      similarity: 0.6,
      diversityBoost: 0.4,
      updatedAt: iso(now - 30 * 60 * 1000)
    };
    const weights = { wSim: 0.4, wRec: 0.4, wDiversity: 0.2 } as const;

    const [scored] = scoreCandidates([candidate], { halfLifeMinutes: 60, now, weights });

    expect(scored.diversityBoost).toBe(0.4);
    const rec = computeRecencyWeight(now, candidate.updatedAt, 60);
    const expected = weights.wSim * candidate.similarity + weights.wRec * rec + weights.wDiversity * 0.4;
    expect(scored.composite).toBeCloseTo(expected);
  });
});

describe('scoreAndSort', () => {
  it('sorts deterministically by composite, then sim, then time, then id', () => {
    const now = Date.UTC(2025, 0, 1);
    const candidates: readonly Candidate[] = [
      {
        chunkId: ULID_B,
        entityId: ULID_B,
        similarity: 0.9,
        updatedAt: iso(now - 5_000)
      },
      {
        chunkId: ULID_A,
        entityId: ULID_A,
        similarity: 0.9,
        updatedAt: iso(now - 4_000)
      }
    ];

    const scored = scoreAndSort(candidates, { halfLifeMinutes: 60, now });

    expect(scored.length).toBe(2);
    const first = scored[0];
    const second = scored[1];
    expect(first.chunkId).toBe(ULID_A);
    expect(second.chunkId).toBe(ULID_B);
  });
});

const makeScored = (overrides: Partial<ScoredCandidate>): ScoredCandidate => ({
  chunkId: ULID_A,
  entityId: ULID_A,
  sim: 0.5,
  recency: 0.5,
  diversityBoost: 0,
  composite: 0.5,
  updatedAt: iso(Date.UTC(2025, 0, 1)),
  ...overrides
});

describe('deterministicSort', () => {
  it('prefers higher similarity when composite scores tie', () => {
    const a = makeScored({ chunkId: ULID_A, composite: 0.5, sim: 0.9 });
    const b = makeScored({ chunkId: ULID_B, composite: 0.5, sim: 0.8 });
    expect(deterministicSort(a, b)).toBe(-1);
    expect(deterministicSort(b, a)).toBe(1);
  });

  it('prefers newer timestamps when composite and sim tie', () => {
    const base = Date.UTC(2025, 0, 1);
    const a = makeScored({ chunkId: ULID_A, updatedAt: iso(base) });
    const b = makeScored({ chunkId: ULID_B, updatedAt: iso(base - 1_000) });
    expect(deterministicSort(a, b)).toBe(-1);
    expect(deterministicSort(b, a)).toBe(1);
  });

  it('falls back to chunkId ordering when all other fields tie', () => {
    const base = Date.UTC(2025, 0, 1);
    const a = makeScored({ chunkId: ULID_A, updatedAt: iso(base) });
    const b = makeScored({ chunkId: ULID_B, updatedAt: iso(base) });
    expect(deterministicSort(a, b)).toBe(-1);
    expect(deterministicSort(b, a)).toBe(1);
  });
});
