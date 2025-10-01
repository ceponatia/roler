// Requirement: R-002 Low-Latency Retrieval
// PRD: docs/prd/r-002-low-latency-retrieval-prd.md
// Tech Spec: docs/design/r-002-low-latency-retrieval-techspec.md
// Public exports for retrieval orchestrator and helpers implement the low-latency strategy (pgvector-first, caching, deadlines).
export * from './lib/config.js';
export * from './lib/scoring.js';
export * from './lib/retriever.js';
// R-005 Pluggable Vector Store: expose typed retriever surface and adapters
export * from './lib/retriever/types.js';
export * from './lib/retriever/adapters/pgvector-adapter.js';
export * from './lib/retriever/adapters/qdrant-adapter.js';
export * from './lib/retriever/factory.js';
export * from './lib/postprocess.js';
export * from './lib/adaptive.js';
export * from './lib/orchestrator.js';
export * from './lib/metrics.js';
export * from './lib/errors.js';
export * from './lib/env.js';
export * from './lib/feature-gated.js';
