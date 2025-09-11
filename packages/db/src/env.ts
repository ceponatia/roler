import { z } from 'zod';

// Zod-validate environment for the db package
const EnvSchema = z.object({
  DATABASE_URL: z.string().url().describe('Postgres connection URL')
});

export type DbEnv = Readonly<z.infer<typeof EnvSchema>>;

let cached: DbEnv | null = null;

export function getDbEnv(): DbEnv {
  if (cached) return cached;
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i: { path: (string | number)[]; message: string }) => `${i.path.join('.')}: ${i.message}`)
      .join(', ');
    throw new Error(`Invalid DB environment: ${issues}`);
  }
  cached = Object.freeze(parsed.data);
  return cached;
}

export function clearDbEnvCache(): void {
  cached = null;
}
