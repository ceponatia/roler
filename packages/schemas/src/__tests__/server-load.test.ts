import { describe, it, expect } from 'vitest';

describe('schemas/server entry loads', () => {
  it('imports without error and exposes symbols', async () => {
    const mod = await import('../server.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
    expect('ExtensionManifestSchema' in mod).toBe(true);
  });
});
