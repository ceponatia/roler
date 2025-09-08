import { z } from 'zod';
import { CanonicalBaseCore } from './base-canonical.js';
export const LocationCanonicalSchema = z.object({
    ...CanonicalBaseCore,
    kind: z.literal('location'),
    title: z.string(),
    description: z.string().optional()
});
//# sourceMappingURL=location.js.map