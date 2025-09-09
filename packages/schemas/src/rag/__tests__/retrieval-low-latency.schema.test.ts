import { describe, expect, it } from 'vitest';

import { UlidSchema } from '../../base/primitives.js';
import {
  PartialReturnReasonEnum,
  RetrievalConfigSchema,
  RetrievalRequestSchema,
  RetrievalResponseSchema
} from '../retrieval-low-latency.js';

const VALID_ULID = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C';

describe('RetrievalConfigSchema', () => {
  it('parses defaults and enforces soft < max', () => {
    const parsed = RetrievalConfigSchema.parse({});
    expect(parsed.maxTotalDeadlineMs).toBeGreaterThan(0);
    expect(parsed.softPartialDeadlineMs).toBeLessThan(parsed.maxTotalDeadlineMs);
  });

  it('rejects invalid deadline relation', () => {
    const res = RetrievalConfigSchema.safeParse({ maxTotalDeadlineMs: 100, softPartialDeadlineMs: 200 });
    expect(res.success).toBe(false);
  });
});

describe('RetrievalRequestSchema', () => {
  it('accepts minimal valid request', () => {
    const req = RetrievalRequestSchema.parse({ queryText: 'hello', gameId: VALID_ULID });
    expect(req.queryText).toBe('hello');
  });

  it('rejects invalid ULID', () => {
    const res = RetrievalRequestSchema.safeParse({ queryText: 'x', gameId: 'not-a-ulid' });
    expect(res.success).toBe(false);
  });
});

describe('RetrievalResponseSchema', () => {
  it('accepts minimal response', () => {
    const response = RetrievalResponseSchema.parse({
      items: [],
      partial: false,
      timings: { totalMs: 0, vectorMs: 0, postProcessMs: 0, cacheMs: 0 },
      stats: { kRequested: 0, kUsed: 0, candidateCount: 0, filteredCount: 0 }
    });
    expect(response.partial).toBe(false);
  });

  it('accepts partial with reason', () => {
    const response = RetrievalResponseSchema.parse({
      items: [],
      partial: true,
      partialReason: PartialReturnReasonEnum.enum.SOFT_TIMEOUT,
      timings: { totalMs: 10, vectorMs: 5, postProcessMs: 3, cacheMs: 2 },
      stats: { kRequested: 10, kUsed: 5, candidateCount: 7, filteredCount: 2 },
      requestId: VALID_ULID
    });
    expect(response.partialReason).toBe('SOFT_TIMEOUT');
    // Ensure branded ULID validates in optional field
    expect(UlidSchema.safeParse(response.requestId).success).toBe(true);
  });
});
