import { describe, it, expect } from 'vitest';

import { CharacterCanonicalSchema } from '../entity/canonical/character.js';
import { migrateCanonicalV1ToLatest } from '../entity/canonical/migrations.js';

describe('canonical migrations', () => {
  it('no-op migrate v1 returns parsed object', () => {
    const input = CharacterCanonicalSchema.parse({
      id: '0123456789ABCDEFGHJKMNPQR1',
      lineageId: '0123456789ABCDEFGHJKMNPQR2',
      version: 1,
      kind: 'character',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '0123456789ABCDEFGHJKMNPQR3',
      updatedBy: '0123456789ABCDEFGHJKMNPQR4',
      name: 'Test',
    });
    const out = migrateCanonicalV1ToLatest(input);
    expect(out).toEqual(input);
  });
});
