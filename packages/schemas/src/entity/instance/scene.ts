import { z } from 'zod';

import { MutableBaseCore } from './base-instance.js';
import { VectorizableTextSchema } from '../../base/primitives.js';

export const SceneInstanceSchema = z.object({
  ...MutableBaseCore,
  kind: z.literal('scene'),
  sessionId: z.string(),
  title: z.string(),
  settingRef: z.string().optional(),
  participants: z.array(z.string()).default([]),
  summary: VectorizableTextSchema.optional(),
  beats: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});
export type SceneInstance = z.infer<typeof SceneInstanceSchema>;
