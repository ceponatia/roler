import { RetrievalConfigSchema } from '@roler/schemas';

import type { RetrievalConfig } from '@roler/schemas';


export function resolveRetrievalConfig(input?: Partial<RetrievalConfig>): RetrievalConfig {
  // Merge by parsing partial over defaults to enforce constraints and defaults.
  const defaults = RetrievalConfigSchema.parse({});
  const merged = { ...defaults, ...(input ?? {}) } as unknown;
  return RetrievalConfigSchema.parse(merged);
}
