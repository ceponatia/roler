import { z } from 'zod';

import { CanonicalBaseObjectSchema } from './base-canonical.js';

export const CharacterCanonicalSchema = CanonicalBaseObjectSchema.extend({
  kind: z.literal('character'),
  name: z.string(),
  bio: z.string().optional()
});
export type CharacterCanonical = z.infer<typeof CharacterCanonicalSchema>;
