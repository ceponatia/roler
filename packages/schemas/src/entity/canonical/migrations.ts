// Placeholder migration utilities for canonical entity evolution.
// Future: implement version-based transforms.

import { CanonicalEntitySchema } from './index.js';

import type { z } from 'zod';

export function migrateCanonicalV1ToLatest(input: unknown) {
  const parsed = CanonicalEntitySchema.parse(input);
  // No-op for now; in future apply structural changes.
  return parsed;
}
export type MigratedCanonical = z.infer<typeof CanonicalEntitySchema>;
