import { z } from 'zod';
import { CanonicalBaseCore } from './base-canonical.js';
export const ItemCanonicalSchema = z.object({
    ...CanonicalBaseCore,
    kind: z.literal('item'),
    label: z.string(),
    rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).optional()
});
//# sourceMappingURL=item.js.map