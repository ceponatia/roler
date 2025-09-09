import { describe, it, expect } from 'vitest';

import { parseExtensionsEnv } from '../../system/env/extensions-env.schema.js';

describe('ExtensionsEnvSchema', () => {
  it('defaults to enabled when unset', () => {
    const res = parseExtensionsEnv({});
    expect(res.EXTENSIONS_ENABLED).toBe(true);
  });

  it('parses common truthy values', () => {
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: '1' }).EXTENSIONS_ENABLED).toBe(true);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'true' }).EXTENSIONS_ENABLED).toBe(true);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'yes' }).EXTENSIONS_ENABLED).toBe(true);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'on' }).EXTENSIONS_ENABLED).toBe(true);
  expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'enable' }).EXTENSIONS_ENABLED).toBe(true);
  expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'enabled' }).EXTENSIONS_ENABLED).toBe(true);
  });

  it('treats common falsy values as false', () => {
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: '0' }).EXTENSIONS_ENABLED).toBe(false);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'no' }).EXTENSIONS_ENABLED).toBe(false);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'off' }).EXTENSIONS_ENABLED).toBe(false);
    expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: '' }).EXTENSIONS_ENABLED).toBe(false);
  expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'disable' }).EXTENSIONS_ENABLED).toBe(false);
  expect(parseExtensionsEnv({ EXTENSIONS_ENABLED: 'disabled' }).EXTENSIONS_ENABLED).toBe(false);
  });
});
