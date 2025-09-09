import { describe, it, expect } from 'vitest';

// Ensure client entrypoint loads and re-exports public API
describe('schemas/client entry loads', () => {
  it('imports without error and exposes symbols', async () => {
  const mod = await import('../client.js');
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
    // spot-check a known export
    expect('ExtensionManifestSchema' in mod).toBe(true);
  });
});
