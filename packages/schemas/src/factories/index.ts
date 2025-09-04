import { UlidSchema } from '../base/primitives.js';
import { CharacterCanonicalSchema } from '../entity/canonical/character.js';
import { CharacterInstanceSchema } from '../entity/instance/character-instance.js';
import { SceneInstanceSchema } from '../entity/instance/scene.js';

let counter = 0;
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const BASE25 = '0123456789ABCDEFGHJKMNPQR'; // 25 valid Crockford chars
const nextUlid = (): string => {
  // Deterministic pseudo ULID for tests: static first 25 chars + rotating tail.
  const last = CROCKFORD[counter % CROCKFORD.length];
  counter += 1;
  return BASE25 + last; // length 26
};

export function makeCharacterCanonical(overrides?: Partial<ReturnType<typeof CharacterCanonicalSchema.parse>>): ReturnType<typeof CharacterCanonicalSchema.parse> {
  const data = {
    id: nextUlid(),
    lineageId: nextUlid(),
    version: 1,
    kind: 'character' as const,
    status: 'draft' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: nextUlid(),
    updatedBy: nextUlid(),
    name: 'Test Character'
  };
  return CharacterCanonicalSchema.parse({ ...data, ...overrides });
}

export function makeCharacterInstance(overrides?: Record<string, unknown>) {
  const base = {
    id: nextUlid(),
    kind: 'characterInstance' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: nextUlid(),
    updatedBy: nextUlid(),
    changePolicy: { allowedKeys: [], requiresEvidence: false, stability: 'stable' },
    name: 'Instance Char'
  };
  return CharacterInstanceSchema.parse({ ...base, ...overrides });
}

export function makeSceneInstance(overrides?: Record<string, unknown>) {
  const base = {
    id: nextUlid(),
    kind: 'scene' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: nextUlid(),
    updatedBy: nextUlid(),
    changePolicy: { allowedKeys: ['summary'], requiresEvidence: false, stability: 'volatile' },
    sessionId: 'sess1',
    title: 'Opening Scene'
  };
  return SceneInstanceSchema.parse({ ...base, ...overrides });
}

export function validateUlid(candidate: string): boolean {
  return !!UlidSchema.safeParse(candidate).success;
}
