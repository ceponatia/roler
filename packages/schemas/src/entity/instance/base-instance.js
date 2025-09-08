import { z } from 'zod';
import { AttributeSchema } from '../../base/attribute.js';
import { EntityKindEnum, RelationshipStageEnum } from '../../base/enums.js';
import { IsoDateTimeSchema, UlidSchema } from '../../base/primitives.js';
export const ChangePolicySchema = z.object({
    allowedKeys: z.array(z.string()).default([]),
    requiresEvidence: z.boolean().default(false),
    stability: z.enum(['volatile', 'stable', 'locked']).default('stable'),
    cooldown: z.number().int().nonnegative().default(0), // milliseconds between accepted changes
    rateWindow: z.number().int().positive().default(60000), // window size ms for maxChanges
    maxChanges: z.number().int().nonnegative().default(0), // 0 = unlimited
    // legacy field retained for backward compatibility; prefer rateWindow/maxChanges
    rateLimit: z
        .object({ perMinute: z.number().int().positive().optional() })
        .default({})
});
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
export const RelationshipParticipantSchema = z.object({
    refId: UlidSchema,
    role: z.string().optional()
});
export const RelationshipHistoryEntrySchema = z.object({
    at: IsoDateTimeSchema,
    stage: RelationshipStageEnum.optional(),
    intensity: z.number().min(0).max(1).optional(),
    note: z.string().optional()
});
//# sourceMappingURL=base-instance.js.map