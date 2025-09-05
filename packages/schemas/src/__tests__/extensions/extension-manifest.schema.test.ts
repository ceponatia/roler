import { describe, it, expect } from 'vitest';

import { ExtensionManifestSchema } from '../../system/extensions/extension-manifest.schema.js';

describe('ExtensionManifestSchema', () => {
  it('parses minimal valid manifest (defaults applied)', () => {
    const result = ExtensionManifestSchema.parse({
      id: 'sample-ext',
      name: 'Sample',
      version: '0.1.0',
      description: 'Sample extension',
      coreApiRange: '^1.0.0',
    });
    expect(result.priority).toBe(0);
    expect(result.killSwitchEnabled).toBe(true);
    expect(result.concurrencyLimit).toBe(4);
  });

  it('rejects invalid id casing', () => {
    expect(() =>
      ExtensionManifestSchema.parse({
        id: 'BadID',
        name: 'x',
        version: '0.1.0',
        description: 'd',
        coreApiRange: '^1.0.0',
      })
    ).toThrow();
  });
});
