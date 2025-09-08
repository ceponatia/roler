import { z } from 'zod';
import { VectorizableTextSchema } from '../base/primitives.js';
export const RetrievalQuerySchema = z.object({
    text: z.string().min(1),
    limit: z.number().int().positive().max(50).default(5),
    namespace: z.string().optional(),
    contentTags: z.array(z.string()).optional()
});
export const RetrievedChunkSchema = z.object({
    score: z.number(),
    source: VectorizableTextSchema,
    meta: z.record(z.unknown()).default({})
});
export const RetrievalResultSchema = z.object({
    query: RetrievalQuerySchema,
    chunks: z.array(RetrievedChunkSchema)
});
//# sourceMappingURL=retrieval.js.map