import { z } from 'zod';
import { IsoDateTimeSchema, UlidSchema } from '../base/primitives.js';
import { ChangePolicySchema } from '../entity/instance/base-instance.js';
// Envelope describing a proposed change to an entity before application (Tier C validation target)
export const ChangeProposalSchema = z.object({
    entityId: UlidSchema,
    proposedBy: UlidSchema,
    proposedAt: IsoDateTimeSchema,
    rationale: z.string().min(1).optional(),
    evidenceRefs: z.array(z.string()).default([]),
    diff: z.record(z.unknown()).default({}),
    policyCheck: ChangePolicySchema.optional(),
    moderatorOverride: z.boolean().default(false)
});
//# sourceMappingURL=change-proposal.js.map