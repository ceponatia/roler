# Architecture Overview

This document provides a high-level map of the Roler platform based on the current codebase state. It will be expanded in future iterations.

## Layers

- Frontend (SvelteKit SPA) – Chat UI, entity inspectors, real-time retrieval context.
- API Endpoints – SvelteKit route handlers validating all inputs with Zod.
- Domain Schemas – Centralized in `@roler/schemas` (canonical + instance entities, system, RAG, LLM, extensions).
- Persistence – Postgres + pgvector via Prisma (canonical objects, entity instances, text chunks, attribute atoms).
- Retrieval (RAG) – Retriever abstraction (currently pgvector) with field-aware fallbacks.
- Extensions (Early Schemas) – Manifest + registration config + state transactions; runtime executor not yet implemented.
- Background Jobs – Planned (BullMQ) for ingestion, re-embedding, sync, applying upstream changes.

## Data Model Highlights

- Canonical vs Instance separation with lineage + version.
- Attribute system (keyPath/value/confidence/evidence) powering normalization & retrieval.
- Vectorizable text chunks for embedding + retrieval context.
- State change events intended for audit and policy enforcement.

## Validation & Safety

- Zod-first: All external boundaries validated before internal logic.
- Extension schemas predefine budgets, concurrency limits, and kill switches (enforced later by runtime layer).
- Safe filesystem wrapper (`scripts/safe-fs.mjs`) constrains dynamic repo traversal in scripts.

## Testing & Coverage

- Per-package Vitest configs emit `coverage/lcov.info`.
- Root merge script `scripts/merge-lcov.mjs` produces `coverage/monorepo-lcov.info` for Codacy workflow.

## Pending / Future Work

- Implement extension execution engine & hook pipeline.
- Add Qdrant retriever backend and dual-read strategy.
- Enforce Tier B/C validation (policy, safety, rate limits) beyond structural schemas.
- Integrate structured logging + tracing per design specs.

## References

- Design Specs: `docs/design/`
- Product Requirements: `docs/prd/`
- Dev Standards: `docs/dev-standards/`
