import { z } from 'zod';

import { CharacterCanonicalSchema } from './character.js';
import { ItemCanonicalSchema } from './item.js';
import { LocationCanonicalSchema } from './location.js';
import { PromptTemplateCanonicalSchema } from './prompt-template.js';
import { RelationshipTypeCanonicalSchema } from './relationship-type.js';

// Plain union (all members already have literal kind fields). Discriminated union
// previously triggered a load-order issue; union is sufficient for validation here.
export const CanonicalEntitySchema = z.union([
  CharacterCanonicalSchema,
  LocationCanonicalSchema,
  ItemCanonicalSchema,
  RelationshipTypeCanonicalSchema,
  PromptTemplateCanonicalSchema
]);
export type CanonicalEntity = z.infer<typeof CanonicalEntitySchema>;
