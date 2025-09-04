import { z } from 'zod';

import { ChangePolicySchema } from '../entity/instance/base-instance.js';
import { ErrorSchema } from '../system/error.js';

export const ProposedFieldChangeSchema = z.object({
  keyPath: z.string(),
  newValue: z.unknown(),
  rationale: z.string().optional()
});
export type ProposedFieldChange = z.infer<typeof ProposedFieldChangeSchema>;

export const ProposeChangeInputSchema = z.object({
  entityId: z.string(),
  proposedBy: z.string(),
  proposedAt: z.string().datetime({ offset: true }),
  evidenceRefs: z.array(z.string()).default([]),
  changes: z.array(ProposedFieldChangeSchema).min(1),
  policyCheck: ChangePolicySchema.optional()
});
export type ProposeChangeInput = z.infer<typeof ProposeChangeInputSchema>;

export const ProposeChangeOutputSchema = z.object({
  entityId: z.string(),
  accepted: z.boolean(),
  appliedKeys: z.array(z.string()).default([]),
  errors: z.array(ErrorSchema).default([])
});
export type ProposeChangeOutput = z.infer<typeof ProposeChangeOutputSchema>;
