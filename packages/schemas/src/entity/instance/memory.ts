import { z } from 'zod';

import { MutableBaseCore } from './base-instance.js';
import { MemoryScopeEnum } from '../../base/enums.js';
import { VectorizableTextSchema } from '../../base/primitives.js';

export const MemoryInstanceSchema = z.object({
  ...MutableBaseCore,
  kind: z.literal('memory'),
  scope: MemoryScopeEnum,
  salience: z.number().min(0).max(1).default(0.5),
  decayPolicy: z.enum(['none','time','usage']).default('usage'),
  vector: VectorizableTextSchema
});
export type MemoryInstance = z.infer<typeof MemoryInstanceSchema>;
