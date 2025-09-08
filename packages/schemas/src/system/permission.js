import { z } from 'zod';
import { UlidSchema } from '../base/primitives.js';
export const PermissionSchema = z.object({
    id: UlidSchema,
    userId: UlidSchema,
    gameId: UlidSchema.optional(),
    scope: z.enum(['read', 'write', 'moderate', 'admin']),
    grantedBy: UlidSchema,
    grantedAt: z.string().datetime({ offset: true })
});
//# sourceMappingURL=permission.js.map