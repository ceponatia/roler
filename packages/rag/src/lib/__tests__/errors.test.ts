import { describe, expect, it } from 'vitest';

import { mapErrorToSchemaError } from '../errors.js';

describe('mapErrorToSchemaError', () => {
  it('maps string error to policy by default', () => {
    const e = mapErrorToSchemaError('something went wrong');
    expect(e.code).toBe('policy');
    expect(e.message).toContain('something');
  });

  it('detects parse from message', () => {
    const e = mapErrorToSchemaError(new Error('invalid input parse issue'));
    expect(e.code).toBe('parse');
  });

  it('extracts fieldPath when present', () => {
    const err = { message: 'invalid age', fieldPath: 'user.age' };
    const e = mapErrorToSchemaError(err);
    expect(e.fieldPath).toBe('user.age');
  });
});
