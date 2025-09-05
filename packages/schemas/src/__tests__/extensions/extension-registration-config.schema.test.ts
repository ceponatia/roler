import { describe, it, expect } from 'vitest';

import { ExtensionRegistrationConfigSchema } from '../../system/extensions/extension-registration-config.schema.js';

describe('ExtensionRegistrationConfigSchema', () => {
  it('applies defaults', () => {
    const cfg = ExtensionRegistrationConfigSchema.parse({});
    expect(cfg.extensions).toEqual([]);
    expect(cfg.failOpen).toBe(false);
  });

  it('rejects negative overhead thresholds', () => {
    expect(() =>
      ExtensionRegistrationConfigSchema.parse({
        performance: { maxOverheadPercentWarn: -1, maxOverheadPercentFail: 7 },
      })
    ).toThrow();
  });
});
