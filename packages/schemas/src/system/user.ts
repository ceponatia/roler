import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from '../base/primitives.js';

export const UserSchema = z.object({
  id: UlidSchema,
  email: z.string().email(),
  displayName: z.string().min(1),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  roles: z.array(z.enum(['gm','player','admin'])).default(['player'])
});
export type User = z.infer<typeof UserSchema>;
