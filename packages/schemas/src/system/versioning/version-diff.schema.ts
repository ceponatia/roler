import { z } from 'zod';

import { AttributeChangeSchema, TextChangeSchema } from './changes.schema.js';
import { UlidSchema } from '../../base/primitives.js';

export const VersionDiffRequestSchema = z.object({ fromVersionId: UlidSchema, toVersionId: UlidSchema }).strict();
export type VersionDiffRequest = z.infer<typeof VersionDiffRequestSchema>;

export const VersionDiffStatsSchema = z
  .object({
    addedAttrs: z.number().int().nonnegative(),
    removedAttrs: z.number().int().nonnegative(),
    modifiedAttrs: z.number().int().nonnegative(),
    textAdded: z.number().int().nonnegative(),
    textRemoved: z.number().int().nonnegative(),
    textModified: z.number().int().nonnegative()
  })
  .strict();
export type VersionDiffStats = z.infer<typeof VersionDiffStatsSchema>;

export const VersionDiffResponseSchema = z
  .object({
    entityId: UlidSchema,
    attributeChanges: z.array(AttributeChangeSchema).readonly(),
    textChanges: z.array(TextChangeSchema).readonly(),
    stats: VersionDiffStatsSchema
  })
  .strict();
export type VersionDiffResponse = z.infer<typeof VersionDiffResponseSchema>;
