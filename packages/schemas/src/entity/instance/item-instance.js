import { z } from 'zod';
import { MutableBaseCore } from './base-instance.js';
export const ItemInstanceSchema = z.object({
    ...MutableBaseCore,
    kind: z.literal('itemInstance'),
    label: z.string(),
    ownerId: z.string().optional()
});
//# sourceMappingURL=item-instance.js.map