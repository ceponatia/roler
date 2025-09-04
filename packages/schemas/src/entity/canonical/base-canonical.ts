import { z } from 'zod';

import { AttributeSchema } from '../../base/attribute.js';
import { ContentRatingEnum, EntityKindEnum } from '../../base/enums.js';
import { IsoDateTimeSchema, UlidSchema } from '../../base/primitives.js';

export const CanonicalStatusEnum = z.enum(['draft','published','archived']);
export type CanonicalStatus = z.infer<typeof CanonicalStatusEnum>;

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
  nsfwTags: z.array(z.string()).default([]),
  blockedTags: z.array(z.string()).default([]),
  ageCheck: z.boolean().default(false),
  attributes: z.array(AttributeSchema).default([])
};

export const CanonicalBaseSchema = z.object(CanonicalBaseCore).superRefine((val, ctx) => {
  for (const tag of val.blockedTags) {
    if (val.nsfwTags.includes(tag)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `tag '${tag}' cannot appear in nsfwTags because it is blocked`, path: ['nsfwTags'] });
    }
  }
  if (['g', 'pg'].includes(val.contentRating) && val.nsfwTags.length > 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'nsfwTags not allowed for G/PG content', path: ['nsfwTags'] });
  }
});
export type CanonicalBase = z.infer<typeof CanonicalBaseSchema>;
