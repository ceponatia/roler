import { z } from 'zod';

const toBool = (raw: string): boolean => {
  const v = (raw ?? '').trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
};

export const ExtensionsRuntimeEnvSchema = z
  .object({
    EXTENSIONS_RUNTIME_ENABLED: z.string().optional().transform((v) => toBool(v ?? 'false')),
  })
  .strict();

export type ExtensionsRuntimeEnv = z.infer<typeof ExtensionsRuntimeEnvSchema>;

export function parseExtensionsRuntimeEnv(env: Readonly<Record<string, string | undefined>>): ExtensionsRuntimeEnv {
  const safe = {
    EXTENSIONS_RUNTIME_ENABLED: env.EXTENSIONS_RUNTIME_ENABLED,
  } satisfies Record<string, string | undefined>;
  return ExtensionsRuntimeEnvSchema.parse(safe);
}
