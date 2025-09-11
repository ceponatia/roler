import { describe, expect, it } from 'vitest';

import { CanonReleaseSchema } from '../canon-release.schema.js';
import { GameInstanceSchema } from '../game-instance.schema.js';
import { TextChunkSchema } from '../text-chunk.schema.js';

// Helper: valid ULIDs
const U = {
  a: '01HZY5RN3Q8K9N9G8ZV4Y6J1QK',
  b: '01HZY5RN3Q8K9N9G8ZV4Y6J1Q2',
  c: '01HZY5RN3Q8K9N9G8ZV4Y6J1Q3',
  d: '01HZY5RN3Q8K9N9G8ZV4Y6J1Q4'
} as const;

describe('TextChunkSchema', () => {
  it('parses a valid canon-owned chunk', () => {
    const chunk = TextChunkSchema.parse({
      id: U.a,
      ownerType: 'canon',
      ownerId: U.b,
      fieldPath: 'fields.personality',
      text: 'Curious and calm.',
      embedding: { model: 'all-MiniLM-L6-v2' }
    });
    expect(chunk.ownerType).toBe('canon');
  });

  it('rejects empty text', () => {
    expect(() =>
      TextChunkSchema.parse({ id: U.a, ownerType: 'instance', ownerId: U.b, fieldPath: 'x', text: '' })
    ).toThrowError();
  });
});

describe('GameInstanceSchema', () => {
  it('parses minimal valid instance', () => {
    const inst = GameInstanceSchema.parse({
      id: U.a,
      gameId: U.b,
      canonId: U.c,
      canonVersionId: U.d,
      state: { kind: 'character', fields: { name: 'Kai' } },
      createdAt: new Date().toISOString()
    });
    expect(inst.state.kind).toBe('character');
  });

  it('rejects extra properties due to strict()', () => {
    expect(() =>
      GameInstanceSchema.parse({
        id: U.a,
        gameId: U.b,
        canonId: U.c,
        canonVersionId: U.d,
        state: { kind: 'character', fields: { name: 'Kai' } },
        createdAt: new Date().toISOString(),
        extra: true
      })
    ).toThrowError();
  });
});

describe('CanonReleaseSchema', () => {
  it('parses valid release bundle', () => {
    const rel = CanonReleaseSchema.parse({
      id: U.a,
      createdAt: new Date().toISOString(),
      label: 'v0.1.0',
      versionIds: [U.b, U.c]
    });
    expect(rel.versionIds.length).toBe(2);
  });

  it('rejects missing version ids', () => {
    expect(() =>
      CanonReleaseSchema.parse({ id: U.a, createdAt: new Date().toISOString(), label: 'v0.1.0', versionIds: [] })
    ).toThrowError();
  });
});
