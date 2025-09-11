import { describe, expect, it } from 'vitest';

import { ErrorCodeEnum } from '../index.js';

describe('ErrorCodeEnum (extended for R-003 Versioning)', () => {
  it('includes versioning-specific codes', () => {
    const codes = ErrorCodeEnum.options;
    const expected = [
      'VER_VERSION_NOT_FOUND',
      'VER_INVALID_PARENT_REFERENCE',
      'VER_LINEAGE_CYCLE_DETECTED',
      'VER_MERGE_NO_COMMON_ANCESTOR',
      'VER_CONFLICTS_EXCEED_LIMIT',
      'VER_ROLLBACK_TARGET_INVALID',
      'VER_DIFF_ENTITY_MISMATCH'
    ];
    for (const c of expected) {
      expect(codes).toContain(c);
    }
  });
});
