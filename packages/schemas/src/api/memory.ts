import { RetrievalQuerySchema, RetrievalResultSchema } from '../rag/retrieval.js';

import type { z } from 'zod';

export const MemoryRetrieveRequestSchema = RetrievalQuerySchema;
export type MemoryRetrieveRequest = z.infer<typeof MemoryRetrieveRequestSchema>;

export const MemoryRetrieveResponseSchema = RetrievalResultSchema;
export type MemoryRetrieveResponse = z.infer<typeof MemoryRetrieveResponseSchema>;
