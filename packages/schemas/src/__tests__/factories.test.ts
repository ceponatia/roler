import { describe, expect, it } from 'vitest';
import { makeCharacterCanonical, makeCharacterInstance, makeSceneInstance } from '../factories/index.js';
import { CharacterCanonicalSchema, CharacterInstanceSchema, SceneInstanceSchema } from '../index.js';

describe('factories produce valid objects', () => {
  it('character canonical', () => {
    const c = makeCharacterCanonical();
    const parsed = CharacterCanonicalSchema.parse(c);
    expect(parsed.kind).toBe('character');
  });
  it('character instance', () => {
    const ci = makeCharacterInstance();
    const parsed = CharacterInstanceSchema.parse(ci);
    expect(parsed.kind).toBe('characterInstance');
  });
  it('scene instance', () => {
    const s = makeSceneInstance();
    const parsed = SceneInstanceSchema.parse(s);
    expect(parsed.kind).toBe('scene');
  });
});
