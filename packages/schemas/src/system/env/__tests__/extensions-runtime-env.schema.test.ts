import { describe, it, expect } from 'vitest';

import { parseExtensionsRuntimeEnv } from '../../../index.js';

describe('parseExtensionsRuntimeEnv', () => {
  it('defaults to false when unset', () => {
    const out = parseExtensionsRuntimeEnv({});
    expect(out.EXTENSIONS_RUNTIME_ENABLED).toBe(false);
  });

  it('parses truthy values', () => {
    for (const v of ['1', 'true', 'yes', 'on']) {
      const out = parseExtensionsRuntimeEnv({ EXTENSIONS_RUNTIME_ENABLED: v });
      expect(out.EXTENSIONS_RUNTIME_ENABLED).toBe(true);
    }
  });

  it('parses falsy values and unknown as false', () => {
    for (const v of ['0', 'false', 'no', 'off', '', 'random']) {
      const out = parseExtensionsRuntimeEnv({ EXTENSIONS_RUNTIME_ENABLED: v });
      expect(out.EXTENSIONS_RUNTIME_ENABLED).toBe(false);
    }
  });
});
