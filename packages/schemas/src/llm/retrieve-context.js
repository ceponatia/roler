import { z } from 'zod';
import { RetrievalQuerySchema, RetrievalResultSchema } from '../rag/retrieval.js';
export const RetrieveContextInputSchema = RetrievalQuerySchema.extend({
    includeMeta: z.boolean().default(false)
});
export const RetrieveContextOutputSchema = RetrievalResultSchema;
//# sourceMappingURL=retrieve-context.js.map