import { z } from 'zod';

import { ConflictSchema } from './conflict.schema.js';
import { UlidSchema } from '../../base/primitives.js';

export const MergePreviewRequestSchema = z.object({ leftVersionId: UlidSchema, rightVersionId: UlidSchema }).strict();
export type MergePreviewRequest = z.infer<typeof MergePreviewRequestSchema>;

export const MergePreviewResponseSchema = z
  .object({
    baseVersionId: UlidSchema,
    mergedAttributes: z.record(z.string(), z.unknown()),
    mergedTextChunks: z.array(z.object({ index: z.number().int().nonnegative(), text: z.string() }).strict()).readonly(),
    conflicts: z.array(ConflictSchema).readonly(),
    conflictCount: z.number().int().nonnegative()
  })
  .strict();
export type MergePreviewResponse = z.infer<typeof MergePreviewResponseSchema>;
