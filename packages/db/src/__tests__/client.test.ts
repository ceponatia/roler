import { describe, expect, it } from 'vitest';

import { clearDbEnvCache, getDbEnv } from '../env.js';

// Minimal tests to assert env validation behavior

describe('db env', () => {
  it('throws on missing DATABASE_URL', () => {
    const existing = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    clearDbEnvCache();
    expect(() => getDbEnv()).toThrowError(/Invalid DB environment/);
    if (existing) process.env.DATABASE_URL = existing;
  });
});
