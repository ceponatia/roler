import { z } from 'zod';

import { IsoDateTimeSchema, UlidSchema } from '../base/primitives.js';
import { ErrorSchema } from '../errors.schema.js';

// R-002: Low-latency retrieval config and I/O contracts (additive, non-breaking)

// Enum for partial return reason (response)
export const PartialReturnReasonEnum = z.enum(['SOFT_TIMEOUT', 'HARD_TIMEOUT', 'ADAPTIVE_LIMIT']);
export type PartialReturnReason = z.infer<typeof PartialReturnReasonEnum>;

// Small tag enum for partial-return policy classification (placeholder for future expansion)
export const PartialReturnTagEnum = z.enum(['retrieval']);
export type PartialReturnTag = z.infer<typeof PartialReturnTagEnum>;

export const RetrievalPartialReturnPolicySchema = z.object({
  minResults: z.number().int().nonnegative().default(8),
  tag: PartialReturnTagEnum.default('retrieval')
});
export type RetrievalPartialReturnPolicy = z.infer<typeof RetrievalPartialReturnPolicySchema>;

export const RetrievalConfigSchema = z
  .object({
    maxTotalDeadlineMs: z.number().int().positive().default(250),
    softPartialDeadlineMs: z.number().int().positive().default(180),
    baseK: z.number().int().positive().default(32),
    maxKBoost: z.number().int().nonnegative().default(16),
    embeddingCacheSize: z.number().int().nonnegative().default(5_000),
    queryResultCacheSize: z.number().int().nonnegative().default(2_000),
    entityContextCacheSize: z.number().int().nonnegative().default(1_000),
    recencyHalfLifeMinutes: z.number().int().positive().default(240),
    diversityMinEntityPercent: z.number().min(0).max(1).default(0.25),
    partialReturnPolicy: RetrievalPartialReturnPolicySchema.default({}),
    enableAdaptiveK: z.boolean().default(true)
  })
  .refine(
    (cfg) => cfg.softPartialDeadlineMs < cfg.maxTotalDeadlineMs,
    { path: ['softPartialDeadlineMs'], message: 'softPartialDeadlineMs must be < maxTotalDeadlineMs' }
  );
export type RetrievalConfig = z.infer<typeof RetrievalConfigSchema>;

export const RetrievalRequestSchema = z.object({
  queryText: z.string().min(1),
  gameId: UlidSchema,
  actorEntityId: UlidSchema.optional(),
  // Upper guardrails; runtime will clamp to config-derived maximum (baseK + maxKBoost)
  limit: z.number().int().positive().max(64).optional(),
  includeRestricted: z.boolean().optional()
});
export type RetrievalRequest = z.infer<typeof RetrievalRequestSchema>;

export const RetrievalItemSchema = z.object({
  chunkId: UlidSchema,
  entityId: UlidSchema,
  score: z.number(),
  reasonBits: z.array(z.string()).readonly()
});
export type RetrievalItem = z.infer<typeof RetrievalItemSchema>;

export const RetrievalTimingsSchema = z.object({
  totalMs: z.number().nonnegative(),
  vectorMs: z.number().nonnegative(),
  postProcessMs: z.number().nonnegative(),
  cacheMs: z.number().nonnegative()
});
export type RetrievalTimings = z.infer<typeof RetrievalTimingsSchema>;

export const RetrievalStatsSchema = z.object({
  kRequested: z.number().int().nonnegative(),
  kUsed: z.number().int().nonnegative(),
  candidateCount: z.number().int().nonnegative(),
  filteredCount: z.number().int().nonnegative()
});
export type RetrievalStats = z.infer<typeof RetrievalStatsSchema>;

export const RetrievalResponseSchema = z.object({
  items: z.array(RetrievalItemSchema).readonly(),
  partial: z.boolean(),
  partialReason: PartialReturnReasonEnum.optional(),
  timings: RetrievalTimingsSchema,
  stats: RetrievalStatsSchema,
  // Optional echo of request metadata for auditability
  requestId: UlidSchema.optional(),
  issuedAt: IsoDateTimeSchema.optional(),
  errors: z.array(ErrorSchema).default([])
});
export type RetrievalResponse = z.infer<typeof RetrievalResponseSchema>;
