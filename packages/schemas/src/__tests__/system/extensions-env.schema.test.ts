import { describe, it, expect } from 'vitest';

import { parseExtensionsEnv } from '../../system/env/extensions-env.schema.js';

describe('ExtensionsEnvSchema', () => {
  it('defaults to disabled when unset', () => {
    const res = parseExtensionsEnv({});
    expect(res.EXTENSIONS_ENABLED).toBe(false);
  });

  it('parses common truthy values', () => {
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: '1' }).EXTENSIONS_ENABLED).toBe(true);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'true' }).EXTENSIONS_ENABLED).toBe(true);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'yes' }).EXTENSIONS_ENABLED).toBe(true);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'on' }).EXTENSIONS_ENABLED).toBe(true);
  });

  it('treats other values as false', () => {
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: '0' }).EXTENSIONS_ENABLED).toBe(false);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'no' }).EXTENSIONS_ENABLED).toBe(false);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'off' }).EXTENSIONS_ENABLED).toBe(false);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: '' }).EXTENSIONS_ENABLED).toBe(false);
  });
});
