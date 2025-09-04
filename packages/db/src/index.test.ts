import { describe, it, expect } from 'vitest';

import { example } from './index.js';

describe('example', () => {
  it('returns package id', () => {
    expect(example()).toBe('db-package');
  });
});
