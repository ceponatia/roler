import { CreateSceneInputSchema, CreateSceneOutputSchema } from '../llm/create-scene.js';

import type { z } from 'zod';

export const SceneCreateRequestSchema = CreateSceneInputSchema;
export type SceneCreateRequest = z.infer<typeof SceneCreateRequestSchema>;

export const SceneCreateResponseSchema = CreateSceneOutputSchema;
export type SceneCreateResponse = z.infer<typeof SceneCreateResponseSchema>;
