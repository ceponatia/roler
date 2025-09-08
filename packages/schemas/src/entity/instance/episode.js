import { z } from 'zod';
import { MutableBaseCore } from './base-instance.js';
export const EpisodeInstanceSchema = z.object({
    ...MutableBaseCore,
    kind: z.literal('episode'),
    sceneId: z.string(),
    inputs: z.record(z.unknown()).default({}),
    llmOutputs: z.record(z.unknown()).default({}),
    appliedChanges: z.array(z.string()).default([]),
    memoryWrites: z.array(z.string()).default([]),
    seed: z.string().optional(),
    modelInfo: z.object({ model: z.string().optional(), latencyMs: z.number().optional() }).default({})
});
//# sourceMappingURL=episode.js.map