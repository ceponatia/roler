import { describe, expect, it } from 'vitest';

import { scoreAndSort, computeRecencyWeight, type Candidate } from '../scoring.js';

const ULID_A = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C' as unknown as Candidate['chunkId'];
const ULID_B = '01HYA7Y3KZJ5MNS4AE8Q9R2B7D' as unknown as Candidate['chunkId'];

describe('computeRecencyWeight', () => {
  it('decays with half-life', () => {
    const now = Date.UTC(2025, 0, 1);
  const past = new Date(now - 60 * 60 * 1000).toISOString() as unknown as Parameters<typeof computeRecencyWeight>[1]; // 60 minutes ago
  const w30 = computeRecencyWeight(now, past, 30); // two half-lives => ~0.25
    expect(w30).toBeGreaterThan(0.2);
    expect(w30).toBeLessThan(0.3);
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
        updatedAt: new Date(now - 5_000).toISOString() as unknown as (Candidate & { updatedAt: unknown })['updatedAt']
      },
      {
        chunkId: ULID_A,
        entityId: ULID_A,
        similarity: 0.9,
        updatedAt: new Date(now - 4_000).toISOString() as unknown as (Candidate & { updatedAt: unknown })['updatedAt']
      }
    ] as const;
  const scored = scoreAndSort(candidates, { halfLifeMinutes: 60, now });
  expect(scored.length).toBe(2);
  // Same sim; newer updatedAt should come first
  const first = scored[0];
  const second = scored[1];
  expect(first).toBeDefined();
  expect(second).toBeDefined();
  if (!first || !second) throw new Error('expected two results');
  expect(first.chunkId).toBe(ULID_A);
  expect(second.chunkId).toBe(ULID_B);
  });
});
