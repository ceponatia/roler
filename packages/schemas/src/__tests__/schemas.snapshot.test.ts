import { describe, expect, it } from 'vitest';
import {
  CharacterCanonicalSchema,
  CharacterInstanceSchema,
  SceneInstanceSchema,
  RelationshipInstanceSchema,
  MemoryInstanceSchema,
  RelationshipTypeCanonicalSchema
} from '../index.js';

// Collect schemas to snapshot their .describe() output for surface stability.
const schemaEntries = [
  ['CharacterCanonical', CharacterCanonicalSchema],
  ['CharacterInstance', CharacterInstanceSchema],
  ['SceneInstance', SceneInstanceSchema],
  ['RelationshipInstance', RelationshipInstanceSchema],
  ['MemoryInstance', MemoryInstanceSchema],
  ['RelationshipTypeCanonical', RelationshipTypeCanonicalSchema]
] as const;

describe('schema descriptions', () => {
  for (const [name, schema] of schemaEntries) {
    it(`matches snapshot: ${name}`, () => {
      expect(schema.describe()).toMatchSnapshot();
    });
  }
});
