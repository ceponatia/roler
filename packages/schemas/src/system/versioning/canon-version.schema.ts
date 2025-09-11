import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from '../../base/primitives.js';

export const VersionTextChunkSchema = z
  .object({ index: z.number().int().nonnegative(), hash: z.string().min(16), text: z.string() })
  .strict();
export type VersionTextChunk = z.infer<typeof VersionTextChunkSchema>;

export const CanonAttributesSchema = z.record(z.string(), z.unknown());
export type CanonAttributes = z.infer<typeof CanonAttributesSchema>;

export const CanonVersionSchema = z
  .object({
    id: UlidSchema,
    entityId: UlidSchema,
    lineageRootId: UlidSchema,
    parentIds: z.array(UlidSchema).readonly(),
    seq: z.number().int().nonnegative(),
    authorUserId: UlidSchema,
    createdAt: IsoDateTimeSchema,
    attributes: CanonAttributesSchema,
    textChunks: z.array(VersionTextChunkSchema).readonly(),
    changeSummary: z.string().max(2000).optional(),
    baseHash: z.string().min(16),
    integrityChecksum: z.string().min(16),
    meta: z.record(z.string(), z.unknown()).readonly().optional()
  })
  .strict();
export type CanonVersion = z.infer<typeof CanonVersionSchema>;

export const CanonVersionReaderSchema = CanonVersionSchema;
export type CanonVersionReader = z.infer<typeof CanonVersionReaderSchema>;
