import { describe, it, expect } from 'vitest';

import { shouldEnableExtensions, shouldEnableExtensionsRuntime } from '../index.js';

// These tests exercise edge/env error paths that were previously uncovered.

describe('runtime env gating', () => {
  it('treats missing flag as enabled when schema parse succeeds (falls back to process env defaults)', () => {
    // Implementation delegates to parseExtensionsEnv which may coerce absence to default true.
    // We assert the observed behavior to lock contract; if spec changes, update test accordingly.
    expect(shouldEnableExtensions({})).toBe(true);
  });

  it('returns false on invalid boolean tokens', () => {
    expect(shouldEnableExtensions({ EXTENSIONS_ENABLED: 'notabool' })).toBe(false);
  });

  it('enables base extensions but not runtime without runtime flag', () => {
    expect(shouldEnableExtensions({ EXTENSIONS_ENABLED: 'true' })).toBe(true);
    expect(shouldEnableExtensionsRuntime({ EXTENSIONS_ENABLED: 'true' })).toBe(false);
  });

  it('enables runtime only when both flags true-ish', () => {
    expect(shouldEnableExtensionsRuntime({ EXTENSIONS_ENABLED: 'true', EXTENSIONS_RUNTIME_ENABLED: 'true' })).toBe(true);
  });

  it('disables runtime when runtime flag invalid', () => {
    expect(shouldEnableExtensionsRuntime({ EXTENSIONS_ENABLED: 'true', EXTENSIONS_RUNTIME_ENABLED: 'nope' })).toBe(false);
  });
});
