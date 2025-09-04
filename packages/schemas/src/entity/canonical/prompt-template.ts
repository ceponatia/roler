import { z } from 'zod';

import { CanonicalBaseCore } from './base-canonical.js';

export const PromptTemplateCanonicalSchema = z.object({
  ...CanonicalBaseCore,
  kind: z.literal('promptTemplate'),
  template: z.string(),
  variables: z.array(z.string()).default([])
});
export type PromptTemplateCanonical = z.infer<typeof PromptTemplateCanonicalSchema>;
