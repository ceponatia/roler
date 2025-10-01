// Requirement: R-002 Low-Latency Retrieval (legacy export surface)
// This module now re-exports the pluggable retriever architecture introduced in R-005 while
// preserving the original entry points for consumers already importing from `lib/retriever`.

export type {
  RetrieveOpts,
  RetrieveResult,
  Retriever,
  RetrieverAdapterKind,
  RetrieverAdapter,
  RetrieverAdapterFactory,
  RetrieverFactoryRegistry,
  DualReadShadowPlan,
  NormalizationPlan,
  ParsedRetrieverConfig
} from './retriever/types.js';

export {
  parseRetrieverConfig,
  assertAdapterConfig,
  assertDualReadConfig,
  resolveAdapterFactory
} from './retriever/types.js';

export type { PgVectorRow, RunPgVectorQuery } from './retriever/adapters/pgvector-adapter.js';
export { createPgVectorRetriever } from './retriever/adapters/pgvector-adapter.js';
export type {
  QdrantPoint,
  QdrantSearchResponse,
  RunQdrantSearch,
  QdrantRetrieverDeps
} from './retriever/adapters/qdrant-adapter.js';
export { createQdrantRetriever } from './retriever/adapters/qdrant-adapter.js';

export type {
  CreateRetrieverDeps,
  RetrieverFactoryResult
} from './retriever/factory.js';
export { createRetriever } from './retriever/factory.js';
export type { ScoreNormalizer, NormalizationStrategy } from './retriever/normalizer.js';
export { createScoreNormalizer, resolveStrategy } from './retriever/normalizer.js';
export type { DualReadEvent, DualReadScheduler, DualReadWrapperDeps } from './retriever/dual-read.js';
export { createDualReadRetriever } from './retriever/dual-read.js';
export type { DualReadMetricsSnapshot, HistogramSummary } from './retriever/dual-read-metrics.js';
export { getDualReadMetricsSnapshot, resetDualReadMetrics } from './retriever/dual-read-metrics.js';

