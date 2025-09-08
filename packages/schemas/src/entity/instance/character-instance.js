import { z } from 'zod';
import { MutableBaseCore } from './base-instance.js';
export const CharacterInstanceSchema = z.object({
    ...MutableBaseCore,
    kind: z.literal('characterInstance'),
    name: z.string(),
    sessionId: z.string().optional()
});
//# sourceMappingURL=character-instance.js.map