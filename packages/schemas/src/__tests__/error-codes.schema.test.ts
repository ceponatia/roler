import { describe, expect, it } from 'vitest';

import { ErrorCodeEnum } from '../base/enums.js';

describe('ErrorCodeEnum (extended for R-002)', () => {
  it('includes retrieval-specific codes', () => {
    const values = ErrorCodeEnum.options;
    for (const code of [
      'RETR_TIMEOUT_SOFT',
      'RETR_TIMEOUT_HARD',
      'RETR_INVALID_REQUEST',
      'RETR_VECTOR_EXEC_ERROR',
      'RETR_CACHE_FAILURE',
      'RETR_INSUFFICIENT_RESULTS'
    ] as const) {
      expect(values).toContain(code);
    }
  });
});
