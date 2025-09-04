import { z } from 'zod';

import { MutableBaseCore, RelationshipHistoryEntrySchema, RelationshipParticipantSchema } from './base-instance.js';
import { RelationshipStageEnum } from '../../base/enums.js';

export const RelationshipInstanceSchema = z.object({
  ...MutableBaseCore,
  kind: z.literal('relationship'),
  participants: z.array(RelationshipParticipantSchema).min(2),
  typeRef: z.string(),
  intensity: z.number().min(0).max(1).default(0.1),
  stage: RelationshipStageEnum.default('acquaintance'),
  romance: z.object({
    isRomantic: z.boolean().default(false),
    isIntimate: z.boolean().default(false),
    consentEstablishedAt: z.string().datetime({ offset: true }).optional(),
    lastConsentReviewAt: z.string().datetime({ offset: true }).optional(),
    safetyConcerns: z.array(z.string()).default([])
  }).default({}),
  boundaries: z.array(z.string()).default([]),
  history: z.array(RelationshipHistoryEntrySchema).default([]),
  consentFlags: z.object({
    lastConfirmedAt: z.string().datetime({ offset: true }).optional()
  }).default({})
});
export type RelationshipInstance = z.infer<typeof RelationshipInstanceSchema>;
