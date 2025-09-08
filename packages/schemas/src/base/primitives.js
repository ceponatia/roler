import { z } from 'zod';
// Branded ULID (26 char Crockford base32). Brand prevents accidental string mixing.
export const UlidSchema = z
    .string()
    .regex(/^[0-9A-HJKMNP-TV-Z]{26}$/i, 'invalid ulid')
    .brand();
export const isUlid = (value) => typeof value === 'string' && /^[0-9A-HJKMNP-TV-Z]{26}$/i.test(value);
// ISO 8601 instant (toISOString output)
export const IsoDateTimeSchema = z.string().datetime({ offset: true });
// Basic branded vectorizable text block with optional existing embedding metadata placeholder
export const VectorizableTextSchema = z.object({
    text: z.string().min(1),
    // embed indicates whether this text should be embedded (true) or already embedded (false)
    embed: z.boolean().default(true),
    embedding: z
        .object({
        model: z.string(),
        vector: z.array(z.number()).min(1).optional(),
        dimension: z.number().int().positive().optional(),
        embeddedAt: IsoDateTimeSchema.optional()
    })
        .optional(),
    chunk: z.object({
        index: z.number().int().nonnegative(),
        total: z.number().int().positive()
    }).optional(),
    namespace: z.string().min(1).optional(),
    contentTags: z.array(z.string()).default([])
});
//# sourceMappingURL=primitives.js.map