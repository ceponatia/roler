import { z } from 'zod';

import { AttributeSchema } from '../../base/attribute.js';
import { EntityKindEnum, RelationshipStageEnum } from '../../base/enums.js';
import { IsoDateTimeSchema, UlidSchema } from '../../base/primitives.js';

export const ChangePolicySchema = z.object({
  allowedKeys: z.array(z.string()).default([]),
  requiresEvidence: z.boolean().default(false),
  rateLimit: z.object({ perMinute: z.number().int().positive().optional() }).default({}),
  stability: z.enum(['volatile','stable','locked']).default('stable')
});
export type ChangePolicy = z.infer<typeof ChangePolicySchema>;

export const MutableBaseCore = {
  id: UlidSchema,
  kind: EntityKindEnum,
  canonicalId: UlidSchema.optional(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  createdBy: UlidSchema,
  updatedBy: UlidSchema,
  mutableAttributes: z.array(z.string()).default([]),
  changePolicy: ChangePolicySchema,
  attributes: z.array(AttributeSchema).default([])
};
export const MutableBaseSchema = z.object(MutableBaseCore);
export type MutableBase = z.infer<typeof MutableBaseSchema>;

export const RelationshipParticipantSchema = z.object({
  refId: UlidSchema,
  role: z.string().optional()
});
export type RelationshipParticipant = z.infer<typeof RelationshipParticipantSchema>;

export const RelationshipHistoryEntrySchema = z.object({
  at: IsoDateTimeSchema,
  stage: RelationshipStageEnum.optional(),
  intensity: z.number().min(0).max(1).optional(),
  note: z.string().optional()
});
export type RelationshipHistoryEntry = z.infer<typeof RelationshipHistoryEntrySchema>;
