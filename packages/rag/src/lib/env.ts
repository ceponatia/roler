import { z } from 'zod';

// Zod-validated env reader for LOW_LATENCY_RETRIEVAL flag.
// Accepted truthy values (case-insensitive): '1', 'true', 'yes', 'on'
// Accepted falsy values: '0', 'false', 'no', 'off'
// Undefined defaults to false.

const RagEnvSchema = z.object({
  LOW_LATENCY_RETRIEVAL: z.string().optional()
});

export type RagEnv = z.infer<typeof RagEnvSchema>;

const TRUTHY = new Set<string>(['1', 'true', 'yes', 'on']);
const FALSY = new Set<string>(['0', 'false', 'no', 'off']);

export function isLowLatencyRetrievalEnabled(source?: NodeJS.ProcessEnv): boolean {
  const parsed = RagEnvSchema.parse(source ?? process.env);
  const raw = parsed.LOW_LATENCY_RETRIEVAL;
  if (raw == null) return false;
  const v = raw.trim().toLowerCase();
  if (TRUTHY.has(v)) return true;
  if (FALSY.has(v)) return false;
  // For unexpected values, default to false for safety.
  return false;
}
