import { z } from 'zod';

import { RetrievalQuerySchema, RetrievalResultSchema } from '../rag/retrieval.js';

export const RetrieveContextInputSchema = RetrievalQuerySchema.extend({
  includeMeta: z.boolean().default(false)
});
export type RetrieveContextInput = z.infer<typeof RetrieveContextInputSchema>;

export const RetrieveContextOutputSchema = RetrievalResultSchema;
export type RetrieveContextOutput = z.infer<typeof RetrieveContextOutputSchema>;
