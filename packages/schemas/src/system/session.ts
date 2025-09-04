import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from '../base/primitives.js';

export const SessionSchema = z.object({
  id: UlidSchema,
  userId: UlidSchema,
  token: z.string(),
  createdAt: IsoDateTimeSchema,
  expiresAt: IsoDateTimeSchema,
  lastActiveAt: IsoDateTimeSchema.optional()
});
export type Session = z.infer<typeof SessionSchema>;
