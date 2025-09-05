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
  // Access internal _def using unknown + narrow (avoid 'any') for a shallow, stable subset
  const defRaw: unknown = (schema as unknown as { _def?: unknown })._def;
  const def = (defRaw && typeof defRaw === 'object') ? defRaw as Record<string, unknown> : {};
  const typeName = typeof def.typeName === 'string' ? def.typeName : undefined;
  const description = typeof def.description === 'string' ? def.description : undefined;
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
    options = def.options
      .map((o: unknown) => {
        if (o && typeof o === 'object' && '_def' in o) {
          const inner = (o as { _def?: { typeName?: unknown } })._def;
          if (inner && typeof inner === 'object' && 'typeName' in inner) {
            const tn = (inner as { typeName?: unknown }).typeName;
            return typeof tn === 'string' ? tn : undefined;
          }
        }
        return undefined;
      })
      .filter((v): v is string => typeof v === 'string')
      .sort();
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
