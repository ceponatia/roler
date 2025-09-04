import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from '../base/primitives.js';

export const EmbeddingMetaSchema = z.object({
  id: UlidSchema,
  namespace: z.string().min(1),
  model: z.string().min(1),
  dimension: z.number().int().positive(),
  contentTags: z.array(z.string()).default([]),
  createdAt: IsoDateTimeSchema
});
export type EmbeddingMeta = z.infer<typeof EmbeddingMetaSchema>;
