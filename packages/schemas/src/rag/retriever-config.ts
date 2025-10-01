import { z } from 'zod';

// Requirement: R-005 Pluggable Vector Store — configuration schema enabling backend selection and dual-read evaluation.

const PgVectorAdapterConfigSchema = z.object({
  kind: z.literal('pgvector'),
  connectionString: z.string().min(1, 'connectionString is required'),
  schema: z.string().min(1).default('public'),
  table: z.string().min(1).default('vector_chunks'),
  embeddingColumn: z.string().min(1).default('embedding'),
  metadataColumns: z.array(z.string().min(1)).default([]),
  namespaceField: z.string().min(1).default('namespace')
});
export type PgVectorAdapterConfig = z.infer<typeof PgVectorAdapterConfigSchema>;

const QdrantConsistencySchema = z.enum(['eventual', 'strong']);
export type QdrantConsistency = z.infer<typeof QdrantConsistencySchema>;

const QdrantAdapterConfigSchema = z.object({
  kind: z.literal('qdrant'),
  url: z.string().url('url must be a valid URL'),
  apiKey: z.string().min(1).optional(),
  collection: z.string().min(1),
  timeoutMs: z.number().int().positive().default(5_000),
  consistency: QdrantConsistencySchema.default('eventual'),
  namespaceField: z.string().min(1).default('namespace')
});
export type QdrantAdapterConfig = z.infer<typeof QdrantAdapterConfigSchema>;

export const RetrieverAdapterConfigSchema = z.discriminatedUnion('kind', [
  PgVectorAdapterConfigSchema,
  QdrantAdapterConfigSchema
]);
export type RetrieverAdapterConfig = z.infer<typeof RetrieverAdapterConfigSchema>;

const TargetRangeSchema = z
  .tuple([z.number().min(0).max(1), z.number().min(0).max(1)])
  .refine(([min, max]) => min < max, { message: 'targetRange must be an increasing pair between 0 and 1' });

export const RetrieverNormalizationConfigSchema = z
  .object({
    strategy: z.enum(['auto', 'cosine', 'pgvector-l2']).default('auto'),
    targetRange: TargetRangeSchema.default([0, 1] as const)
  })
  .default({ strategy: 'auto', targetRange: [0, 1] as const });
export type RetrieverNormalizationConfig = z.infer<typeof RetrieverNormalizationConfigSchema>;

export const DualReadConfigSchema = z
  .object({
    enabled: z.boolean().default(false),
    sampleRate: z.number().min(0).max(1).default(0),
    shadow: z.lazy(() => RetrieverAdapterConfigSchema).optional()
  })
  .superRefine((cfg, ctx) => {
    if (cfg.enabled && !cfg.shadow) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['shadow'],
        message: 'shadow backend config is required when dual-read is enabled'
      });
    }
  })
  .default({ enabled: false, sampleRate: 0 });
export type DualReadConfig = z.infer<typeof DualReadConfigSchema>;

export const RetrieverConfigSchema = z.object({
  primary: RetrieverAdapterConfigSchema,
  dualRead: DualReadConfigSchema.default({ enabled: false, sampleRate: 0 }),
  normalization: RetrieverNormalizationConfigSchema
});
export type RetrieverConfig = z.infer<typeof RetrieverConfigSchema>;
