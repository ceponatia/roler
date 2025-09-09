/**
 * Extensions Env Schema
 * Validates feature flag for enabling the extensions subsystem (Phase 0).
 * Zod-validated at the boundary; parse from a Record<string,string|undefined>.
 */
import { z } from 'zod';

// Accept common boolean encodings; default is false.
const toBool = (raw: string): boolean => {
  const v = (raw ?? '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
};

export const ExtensionsEnvSchema = z
  .object({
    EXTENSIONS_ENABLED: z
      .string()
      .optional()
      .transform((v) => toBool(v ?? 'false')),
  })
  .strict();

export type ExtensionsEnv = z.infer<typeof ExtensionsEnvSchema>;

export function parseExtensionsEnv(env: Readonly<Record<string, string | undefined>>): ExtensionsEnv {
  // Narrow to only keys we know to avoid leaking secrets; Zod will ignore extras via pick.
  const safe = {
    EXTENSIONS_ENABLED: env.EXTENSIONS_ENABLED,
  } satisfies Record<string, string | undefined>;
  return ExtensionsEnvSchema.parse(safe);
}
