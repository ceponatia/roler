import { z } from 'zod';

import { UlidSchema } from '../../base/primitives.js';

export const RollbackRequestSchema = z.object({ targetVersionId: UlidSchema }).strict();
export type RollbackRequest = z.infer<typeof RollbackRequestSchema>;

export const RollbackResponseSchema = z
  .object({ newHeadVersionId: UlidSchema, previousHeadVersionId: UlidSchema })
  .strict();
export type RollbackResponse = z.infer<typeof RollbackResponseSchema>;
