import { describe, expect, it } from 'vitest';

import {
  CharacterCanonicalSchema,
  CharacterInstanceSchema,
  SceneInstanceSchema,
  RelationshipInstanceSchema,
  MemoryInstanceSchema,
  RelationshipTypeCanonicalSchema
} from '../index.js';

import type { ZodTypeAny } from 'zod';

// Collect schemas to snapshot their .describe() output for surface stability.
const schemaEntries = [
  ['CharacterCanonical', CharacterCanonicalSchema],
  ['CharacterInstance', CharacterInstanceSchema],
  ['SceneInstance', SceneInstanceSchema],
  ['RelationshipInstance', RelationshipInstanceSchema],
  ['MemoryInstance', MemoryInstanceSchema],
  ['RelationshipTypeCanonical', RelationshipTypeCanonicalSchema]
] as const;

// Zod's .describe(description: string) mutator requires an argument; we want a read-only
// structural snapshot. This helper extracts a small, stable subset of internal metadata.
const describeSchema = (schema: ZodTypeAny) => {
  // Access _def via any to avoid depending on private typings; kept deliberately shallow
  const def = (schema as any)._def ?? {};
  const typeName = def.typeName;
  const description = def.description;
  // For object schemas capture sorted shape keys (excluding functions)
  let shapeKeys: readonly string[] | undefined;
  try {
    const shape = typeof def.shape === 'function' ? def.shape() : def.shape;
    if (shape && typeof shape === 'object' && !Array.isArray(shape)) {
      shapeKeys = Object.keys(shape).sort();
    }
  } catch {
    /* ignore */
  }
  // For unions capture option type names
  let options: readonly string[] | undefined;
  if (Array.isArray(def.options)) {
    options = def.options.map((o: any) => o?._def?.typeName).filter(Boolean).sort();
  }
  return { typeName, description, shapeKeys, options };
};

describe('schema descriptions', () => {
  for (const [name, schema] of schemaEntries) {
    it(`matches snapshot: ${name}`, () => {
      expect(describeSchema(schema)).toMatchSnapshot();
    });
  }
});
