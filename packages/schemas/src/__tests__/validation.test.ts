import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { mapZodError, validate } from '../index.js';

describe('validation utilities (R-004)', () => {
  const schema = z.object({
    id: z.string().min(1),
    count: z.number().int(),
  }).strict();

  it('returns data on success', () => {
    const input = { id: 'abc', count: 1 };
    const res = validate(input, schema);
    expect(res.error).toBeUndefined();
    expect(res.data).toEqual(input);
  });

  it('maps missing field to VAL_MISSING_FIELD', () => {
    const input = { id: 'abc' } as unknown;
    const res = validate(input, schema);
    expect(res.data).toBeUndefined();
    expect(res.error).toBeDefined();
    expect(res.error?.code).toBe('VAL_MISSING_FIELD');
    expect(res.error?.fieldPath).toContain('count');
  });

  it('maps type mismatch to VAL_TYPE_MISMATCH', () => {
    const input = { id: 'abc', count: 'nope' } as unknown;
    const res = validate(input, schema);
    expect(res.error?.code).toBe('VAL_TYPE_MISMATCH');
    expect(res.error?.fieldPath).toContain('count');
  });

  it('maps unauthorized field to VAL_UNAUTHORIZED_FIELD', () => {
    const input = { id: 'abc', count: 1, extra: true } as unknown;
    const res = validate(input, schema);
    expect(res.error?.code).toBe('VAL_UNAUTHORIZED_FIELD');
  });

  it('mapZodError handles non-zod errors safely', () => {
    const e = mapZodError(new Error('boom'));
    expect(e.code).toBe('VAL_SCHEMA_VIOLATION');
  });
});
