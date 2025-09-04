import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from '../base/primitives.js';
import { ChangePolicySchema } from '../entity/instance/base-instance.js';

export const StateChangeEventSchema = z.object({
  id: UlidSchema,
  entityId: UlidSchema,
  actorId: UlidSchema,
  occurredAt: IsoDateTimeSchema,
  rationale: z.string().optional(),
  evidenceRefs: z.array(z.string()).default([]),
  diff: z.record(z.unknown()).default({}),
  policyCheck: ChangePolicySchema.optional()
});
export type StateChangeEvent = z.infer<typeof StateChangeEventSchema>;
