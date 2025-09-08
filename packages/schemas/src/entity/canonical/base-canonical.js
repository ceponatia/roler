import { z } from 'zod';
import { AttributeSchema } from '../../base/attribute.js';
import { ContentRatingEnum, EntityKindEnum } from '../../base/enums.js';
import { IsoDateTimeSchema, UlidSchema } from '../../base/primitives.js';
export const CanonicalStatusEnum = z.enum(['draft', 'published', 'archived']);
export const CanonicalBaseCore = {
    id: UlidSchema,
    lineageId: UlidSchema,
    version: z.number().int().positive(),
    kind: EntityKindEnum,
    status: CanonicalStatusEnum,
    createdAt: IsoDateTimeSchema,
    updatedAt: IsoDateTimeSchema,
    createdBy: UlidSchema,
    updatedBy: UlidSchema,
    source: z.string().optional(),
    contentRating: ContentRatingEnum.default('g'),
    blockedTags: z.array(z.string()).default([]),
    ageCheck: z.boolean().default(false),
    attributes: z.array(AttributeSchema).default([])
};
export const CanonicalBaseObjectSchema = z.object(CanonicalBaseCore);
export const CanonicalBaseSchema = CanonicalBaseObjectSchema; // refinement removed: nsfwTags no longer supported
//# sourceMappingURL=base-canonical.js.map