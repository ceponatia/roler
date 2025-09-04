import { z } from 'zod';

import { SceneInstanceSchema } from '../entity/instance/scene.js';

export const CreateSceneInputSchema = z.object({
  sessionId: z.string(),
  title: z.string(),
  settingRef: z.string().optional(),
  participants: z.array(z.string()).default([]),
  seed: z.string().optional()
});
export type CreateSceneInput = z.infer<typeof CreateSceneInputSchema>;

export const CreateSceneOutputSchema = z.object({
  draft: SceneInstanceSchema
});
export type CreateSceneOutput = z.infer<typeof CreateSceneOutputSchema>;
