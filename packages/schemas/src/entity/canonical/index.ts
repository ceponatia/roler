import { z } from 'zod';

import { CharacterCanonicalSchema } from './character.js';
import { ItemCanonicalSchema } from './item.js';
import { LocationCanonicalSchema } from './location.js';
import { PromptTemplateCanonicalSchema } from './prompt-template.js';
import { RelationshipTypeCanonicalSchema } from './relationship-type.js';

export const CanonicalEntitySchema = z.discriminatedUnion('kind', [
  CharacterCanonicalSchema,
  LocationCanonicalSchema,
  ItemCanonicalSchema,
  RelationshipTypeCanonicalSchema,
  PromptTemplateCanonicalSchema
]);
export type CanonicalEntity = z.infer<typeof CanonicalEntitySchema>;
