import { z } from 'zod';
import { CanonicalBaseCore } from './base-canonical.js';
import { RelationshipStageEnum } from '../../base/enums.js';
export const RelationshipTypeCanonicalSchema = z.object({
    ...CanonicalBaseCore,
    kind: z.literal('relationshipType'),
    name: z.string(),
    allowedParticipants: z.number().int().min(2).max(6),
    exclusivity: z.enum(['none', 'monogamous', 'poly']).default('none'),
    defaultStages: z.array(RelationshipStageEnum).default(['acquaintance', 'friendly', 'close']).refine(arr => arr.length > 0, 'at least one default stage'),
    romanceEnabled: z.boolean().default(true),
    intimacyEscalationAllowed: z.boolean().default(true)
});
//# sourceMappingURL=relationship-type.js.map