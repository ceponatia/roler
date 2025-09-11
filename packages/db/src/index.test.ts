import { describe, it, expect } from 'vitest';

import { clearDbEnvCache, getDbEnv } from './env.js';

describe('env validation', () => {
  it('throws when DATABASE_URL is missing', () => {
    const original = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    clearDbEnvCache();
    expect(() => getDbEnv()).toThrow();
    if (original) process.env.DATABASE_URL = original;
  });
});
