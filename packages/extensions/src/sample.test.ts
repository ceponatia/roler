import { describe, it, expect } from 'vitest';
import { sampleExtension, extensionsApiVersion } from './index.js';

describe('extensions package scaffold', () => {
  it('exports sampleExtension with manifest id', () => {
    expect(sampleExtension.manifest.id).toBe('sample-ext');
  });
  it('declares extensionsApiVersion', () => {
    expect(typeof extensionsApiVersion).toBe('string');
  });
});
