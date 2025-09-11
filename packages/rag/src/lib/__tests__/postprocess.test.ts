import { cand, ULID } from '@roler/testutils';
import { describe, expect, it } from 'vitest';

import { postProcess } from '../postprocess.js';

import type { Candidate, Ulid } from '../scoring.js';

describe('postProcess', () => {
  it('scores, sorts deterministically, and trims to limit', () => {
    const candidates = [
      cand<Candidate>('01A', 'E1', 0.8, '2024-06-01T12:00:00.000Z'),
      cand<Candidate>('01B', 'E1', 0.85, '2024-06-01T11:00:00.000Z'),
      cand<Candidate>('01C', 'E2', 0.7, '2024-06-01T13:00:00.000Z')
    ] as const;
    const res = postProcess({
      candidates,
      halfLifeMinutes: 240,
      limit: 2,
      diversityMinEntityPercent: 1.0
    });
    expect(res.items.length).toBe(2);
    // Entity diversity should include E2 at least once given 50% of 2 = 1
  const entities = new Set(res.items.map((i) => i.entityId));
  expect(entities.has(ULID('E2') as unknown as Ulid)).toBe(true);
    expect(res.stats.kUsed).toBe(2);
  });

  it('applies filter and reports filteredCount', () => {
    const candidates = [
      cand<Candidate>('01A', 'E1', 0.8, '2024-06-01T12:00:00.000Z'),
      cand<Candidate>('01B', 'E1', 0.85, '2024-06-01T11:00:00.000Z'),
      cand<Candidate>('01C', 'E2', 0.7, '2024-06-01T13:00:00.000Z')
    ] as const;
    const res = postProcess({
      candidates,
      halfLifeMinutes: 240,
      limit: 5,
      diversityMinEntityPercent: 0.5,
      filter: (c) => c.entityId !== (ULID('E1') as unknown as Ulid)
    });
    expect(res.stats.filteredCount).toBe(2);
    expect(res.items.every((i) => i.entityId !== (ULID('E1') as unknown as Ulid))).toBe(true);
  });
});
