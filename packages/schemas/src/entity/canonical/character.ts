import { z } from 'zod';

import { CanonicalBaseCore } from './base-canonical.js';

export const CharacterCanonicalSchema = z.object({
  ...CanonicalBaseCore,
  kind: z.literal('character'),
  name: z.string(),
  bio: z.string().optional()
});
export type CharacterCanonical = z.infer<typeof CharacterCanonicalSchema>;
