import { z } from 'zod';
import { IsoDateTimeSchema, UlidSchema } from './primitives.js';
// Attribute value union; keep broad but structured
export const AttributeValueSchema = z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.date().transform(d => d.toISOString()),
    z.tuple([z.number(), z.number()]), // range/tuple numeric
    z.array(z.string()),
    z.record(z.unknown())
]);
export const AttributeSchema = z.object({
    keyPath: z.string().min(1),
    value: AttributeValueSchema,
    confidence: z.number().min(0).max(1).default(0.5),
    lastUpdatedBy: UlidSchema.optional(),
    updatedAt: IsoDateTimeSchema.default(() => new Date().toISOString()),
    evidenceRefs: z.array(z.string()).default([])
});
//# sourceMappingURL=attribute.js.map