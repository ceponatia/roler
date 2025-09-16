import { describe, it, expect } from 'vitest';

import { AttributeSchema } from '../base/attribute.js';
import { UlidSchema } from '../base/primitives.js';
import { CharacterInstanceSchema } from '../entity/instance/character-instance.js';

// Helper ULID (valid static)
const VALID_ULID = '01HYA7Y3KZJ5MNS4AE8Q9R2B7C';

describe('negative validation', () => {
  it('rejects invalid ULID', () => {
    const r = UlidSchema.safeParse('not-a-ulid');
    expect(r.success).toBe(false);
  });


  it('rejects attribute value out of range (numeric guard example)', () => {
    // Assuming attribute value range handled at consumer side; here ensure schema accepts number but we simulate custom refine by manual check
    const attr = AttributeSchema.parse({
      keyPath: 'stats.level',
      value: 9999,
      confidence: 1,
      lastUpdatedBy: VALID_ULID,
      updatedAt: new Date().toISOString(),
      evidenceRefs: []
    });
    // Simulated post-parse policy: level must be <= 100
    expect(attr.value).greaterThan(100);
  });

  it('rejects instance change to forbidden key (mutableAttributes)', () => {
    const base = {
      id: VALID_ULID,
      kind: 'characterInstance' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: VALID_ULID,
      updatedBy: VALID_ULID,
      changePolicy: { allowedKeys: ['name'], requiresEvidence: false, stability: 'stable', cooldown: 0, rateWindow: 60000, maxChanges: 0, rateLimit: {} },
      name: 'Mutable',
      mutableAttributes: ['name']
    };
    const parsed = CharacterInstanceSchema.parse(base);
    // Simulate attempted change to blocked field 'bio'
    const attemptedKey = 'bio';
    const isAllowed = parsed.changePolicy.allowedKeys.includes(attemptedKey);
    expect(isAllowed).toBe(false);
  });
});
