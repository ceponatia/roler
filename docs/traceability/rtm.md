# Requirements Traceability Matrix (RTM)

last-updated: 2025-09-24
status: In-Progress

This matrix is the source of truth for requirement-to-implementation traceability. Each row corresponds to a
requirement R-001..R-107 and links to PRDs, tech specs, implementations, tests, and current status.

| Requirement | PRD Ref | Techspec Ref | Implementation | Tests | Status | Notes |
|---|---|---|---|---|---|---|
| R-001 | docs/prd/r-001-extensible-framework-prd.md | docs/design/r-001-extensible-framework-techspec.md | `packages/extensions/src/index.ts`<br>`packages/schemas/src/system/extensions/extension-manifest.schema.ts`<br>`packages/schemas/src/system/extensions/extension-registration-config.schema.ts` | `packages/extensions/src/index.test.ts`<br>`packages/schemas/src/__tests__/extensions/extension-manifest.schema.test.ts`<br>`packages/schemas/src/__tests__/client-load.test.ts` | Tested | Pluggable extension framework (manifest, loader, registry, env-gated). |
| R-002 | docs/prd/r-002-low-latency-retrieval-prd.md | docs/design/r-002-low-latency-retrieval-techspec.md | `packages/rag/src/lib/orchestrator.ts`<br>`packages/rag/src/lib/retriever.ts`<br>`packages/rag/src/lib/deadline.ts`<br>`packages/rag/src/lib/query-result-cache.ts` | `packages/rag/src/lib/__tests__/deadline.test.ts`<br>`packages/rag/src/lib/__tests__/metrics.test.ts`<br>`packages/rag/src/lib/__tests__/query-result-cache.test.ts`<br>`packages/rag/src/bin/__tests__/bench.test.ts` | Tested | Low-latency retrieval with deadlines, caching, and metrics. |
| R-003 | docs/prd/r-003-canonical-versioning-prd.md | docs/design/r-003-canonical-versioning-techspec.md | `packages/schemas/src/system/versioning/index.ts`<br>`packages/schemas/src/system/versioning/canon-version.schema.ts`<br>`packages/schemas/src/system/versioning/version-diff.schema.ts` | `packages/schemas/src/__tests__/versioning.schemas.test.ts`<br>`packages/schemas/src/__tests__/error-codes.versioning.schema.test.ts`<br>`packages/schemas/src/__tests__/core-entities.schema.test.ts` | Tested | Canon version snapshots, diffs, merge/rollback schemas and linkages. |
| R-004 | docs/prd/r-004-boundary-safety-prd.md | docs/design/r-004-boundary-safety-techspec.md | `packages/http-utils/src/request-validate.ts`<br>`packages/schemas/src/errors.schema.ts`<br>`packages/http-utils/src/index.ts` | `packages/http-utils/src/__tests__/request-validate.test.ts`<br>`packages/http-utils/src/__tests__/integration-boundary.test.ts` | Tested | Zod-validated external boundaries and standardized error mapping. |
| R-005 | docs/prd/r-005-pluggable-vector-store-prd.md | docs/design/r-005-pluggable-vector-store-techspec.md | `packages/rag/src/lib/retriever.ts`<br>`packages/rag/src/lib/config.ts`<br>[TBD] `packages/vector-qdrant` | [TBD] `packages/rag/src/lib/__tests__/retriever-driver.contract.test.ts`<br>[TBD] `packages/vector-qdrant/src/__tests__/qdrant.integration.test.ts` | Planned | Pluggable vector backends with a stable retriever driver contract. |
| R-006 | docs/prd/r-006-custom-entities-plugins-prd.md | docs/design/r-006-custom-entities-plugins-techspec.md | [TBD] `packages/extensions`<br>[TBD] `packages/schemas/src/entity/custom/*` | [TBD] `packages/extensions/src/__tests__/custom-entity.extension.test.ts`<br>[TBD] `packages/schemas/src/__tests__/custom-entity.schema.test.ts` | Planned | Extensions can add entity types/attributes safely. |
| R-007 | docs/prd/r-007-modding-import-export-prd.md | docs/design/r-007-modding-import-export-techspec.md | [TBD] `packages/schemas/src/api/import-export.ts`<br>[TBD] `scripts/modding-export.mjs`<br>[TBD] `scripts/modding-import.mjs` | [TBD] `packages/schemas/src/__tests__/import-export.schema.test.ts`<br>[TBD] `scripts/__tests__/modding-cli.integration.test.ts` | Planned | Safe import/export flows for canon data and mods. |
| R-008 | docs/prd/r-008-developer-usability-prd.md | docs/design/r-008-developer-usability-techspec.md | [TBD] `packages/docs-site`<br>[TBD] Examples in `packages/*/README.md` | [TBD] packages/docs-site build smoke | Planned | Improve DX via docs, examples, and API clarity. |
| R-009 | docs/prd/r-009-transparent-normalization-prd.md | docs/design/r-009-transparent-normalization-techspec.md | [TBD] `packages/extensions`<br>[TBD] `packages/schemas/src/system/normalization/trace.schema.ts` | [TBD] `packages/extensions/src/__tests__/normalization.transparency.test.ts` | Planned | Surface normalization effects and ordering transparently. |
| R-010 | docs/prd/r-010-reactive-frontend-prd.md | docs/design/r-010-reactive-frontend-techspec.md | [TBD] `apps/web`<br>[TBD] UI contracts in `packages/schemas` | [TBD] `apps/web/src/__tests__/*` | Planned | Reactive UI for game flow with streaming. |
| R-011 | docs/prd/r-011-modern-server-runtime-prd.md | [TBD] | [TBD] `packages/server`<br>[TBD] `packages/http-utils` | [TBD] `packages/server/src/__tests__/routes.integration.test.ts` | Planned | Modern typed API routes with shared validation. |
| R-012 | docs/prd/r-012-relational-vector-datastore-prd.md | [TBD] | [TBD] `packages/db`<br>[TBD] integration in `packages/rag` | [TBD] `packages/db/src/__tests__/migrations.integration.test.ts` | Planned | Store vectors in Postgres with pgvector; integrate with retrieval. |
| R-013 | docs/prd/r-013-alternative-vector-backends-prd.md | [TBD] | [TBD] `packages/vector-qdrant`<br>`packages/rag/src/lib/retriever.ts` | [TBD] `packages/vector-qdrant/src/__tests__/driver.integration.test.ts` | Planned | Support non-Postgres vector stores via drivers. |
| R-014 | docs/prd/r-014-in-memory-queue-prd.md | [TBD] | [TBD] `packages/worker-queue`<br>`packages/rag/src/lib/adaptive.ts` | [TBD] `packages/worker-queue/src/__tests__/queue.behavior.test.ts` | Planned | Simple in-memory job queue for local workloads. |
| R-015 | docs/prd/r-015-local-llm-support-prd.md | [TBD] | [TBD] `packages/llm`<br>`packages/rag/src/lib/embedding.ts` | [TBD] `packages/llm/src/__tests__/ollama.client.test.ts` | Planned | Local inference/embeddings (e.g., Ollama) support. |
| R-016 | docs/prd/r-016-type-safe-data-access-prd.md | [TBD] | [TBD] `packages/db` | [TBD] `packages/db/src/__tests__/type-safety.test.ts` | Planned | Type-safe DB access with generated types and schema guards. |
| R-017 | docs/prd/r-017-centralized-validation-layer-prd.md | [TBD] | [TBD] `packages/http-utils`<br>[TBD] `packages/schemas` | [TBD] `packages/http-utils/src/__tests__/central-validate.integration.test.ts` | Planned | One validation layer for all external boundaries. |
| R-018 | docs/prd/r-018-automated-test-framework-prd.md | [TBD] | [TBD] `packages/testutils` | [TBD] `packages/testutils/src/__tests__/harness.selftest.ts` | Planned | Shared test harness and utilities. |
| R-019 | docs/prd/r-019-structured-logging-tracing-prd.md | [TBD] | [TBD] `packages/logging`<br>[TBD] `packages/rag` instrumentation | [TBD] `packages/logging/src/__tests__/json-logging.test.ts` | Planned | Standardized JSON logging and tracing spans. |
| R-020 | docs/prd/r-020-modular-packaging-prd.md | [TBD] | [TBD] repo config/exports | [TBD] `scripts/__tests__/structure.guard.test.mjs` | Planned | Ensure modular packages with clean boundaries. |
| R-021 | docs/prd/r-021-module-boundaries-prd.md | [TBD] | ESLint rules; tsconfig paths [TBD] | [TBD] `packages/eslint-config/__tests__/no-deep-imports.test.ts` | Planned | Prevent deep imports; enforce layering. |
| R-022 | docs/prd/r-022-incremental-build-pipeline-prd.md | [TBD] | CI workflows [TBD] | CI smoke checks [TBD] | Planned | Speed builds via caching and scoped runs. |
| R-023 | docs/prd/r-023-strict-type-safety-prd.md | [TBD] | tsconfig strict; ESLint rules [TBD] | type tests in `packages/*` [TBD] | Planned | Enforce strict TypeScript across the repo. |
| R-024 | docs/prd/r-024-contracts-first-development-prd.md | [TBD] | [TBD] `packages/schemas` | schema surface snapshots [TBD] | Planned | Contracts-first development with shared schemas. |
| R-025 | docs/prd/r-025-shared-schema-layer-prd.md | [TBD] | [TBD] `packages/schemas` | cross-package schema import tests [TBD] | Planned | Centralize schemas for reuse and consistency. |
| R-026 | docs/prd/r-026-inbound-request-validation-prd.md | [TBD] | `packages/http-utils/src/request-validate.ts` (enhancements) [TBD]<br>[TBD] `packages/server` | [TBD] extend `packages/http-utils/src/__tests__/request-validate.test.ts` | Planned | Validate all inbound requests with shared schemas. |
| R-027 | docs/prd/r-027-type-inference-reuse-prd.md | [TBD] | `packages/schemas` (inferred exports) [TBD] | type inference tests [TBD] | Planned | Reuse z.infer types to avoid duplication. |
| R-028 | docs/prd/r-028-standardized-error-shape-prd.md | [TBD] | extend `packages/schemas/src/errors.schema.ts` [TBD]<br>[TBD] `packages/http-utils` | [TBD] `packages/schemas/src/__tests__/errors.schema.test.ts` | Planned | Consistent error envelope and fields. |
| R-029 | docs/prd/r-029-contextual-error-logging-prd.md | [TBD] | `packages/logging` (context) [TBD] | [TBD] `packages/logging/src/__tests__/context-logging.test.ts` | Planned | Include request/session context in logs. |
| R-030 | docs/prd/r-030-stable-error-codes-prd.md | [TBD] | packages/schemas error code enums [TBD] | error code snapshots [TBD] | Planned | Stable, versioned error code catalog. |
| R-031 | docs/prd/r-031-session-authentication-prd.md | [TBD] | `packages/auth` (JWT/Redis) [TBD] | [TBD] `packages/auth/src/__tests__/session.integration.test.ts` | Planned | JWT sessions backed by Redis. |
| R-032 | docs/prd/r-032-role-enforcement-prd.md | [TBD] | `packages/auth` (role checks) [TBD]<br>[TBD] `packages/schemas/src/system/permission.ts` | [TBD] `packages/auth/src/__tests__/role.guard.test.ts` | Planned | Enforce GM vs Player roles. |
| R-033 | docs/prd/r-033-per-game-instance-authorization-prd.md | [TBD] | `packages/auth` (instance scope) [TBD] | [TBD] `packages/auth/src/__tests__/instance-scope.guard.test.ts` | Planned | Instance-scoped authorization. |
| R-034 | docs/prd/r-034-extensible-auth-providers-prd.md | [TBD] | `packages/auth` provider adapters [TBD] | [TBD] `packages/auth/src/__tests__/providers.adapter.test.ts` | Planned | Pluggable auth providers. |
| R-035 | docs/prd/r-035-auth-event-auditing-prd.md | [TBD] | `packages/logging` (audit) [TBD] | [TBD] `packages/logging/src/__tests__/audit-log.test.ts` | Planned | Audit key auth events. |
| R-036 | docs/prd/r-036-entity-versioning-and-vectors-prd.md | [TBD] | `packages/schemas/src/system/versioning/*`<br>[TBD] `packages/rag` (re-embedding) | [TBD] `packages/schemas/src/__tests__/versioning-vector.integration.test.ts` | Planned | Link versions with embedding lifecycle. |
| R-037 | docs/prd/r-037-flexible-structured-fields-prd.md | [TBD] | `packages/schemas/src/entity/*` (flex fields) [TBD] | [TBD] `packages/schemas/src/__tests__/flex-fields.schema.test.ts` | Planned | Structured, extensible entity fields. |
| R-038 | docs/prd/r-038-relational-primary-vector-search-prd.md | [TBD] | `packages/db` (pgvector) [TBD]<br>[TBD] `packages/rag` retriever | [TBD] `packages/rag/src/lib/__tests__/pgvector.retriever.integration.test.ts` | Planned | Use Postgres + pgvector as primary vector store. |
| R-039 | docs/prd/r-039-outbox-propagation-prd.md | [TBD] | `packages/db` outbox<br>[TBD] `packages/worker-queue` consumer | [TBD] `packages/db/src/__tests__/outbox.integration.test.ts` | Planned | Outbox pattern for eventual consistency. |
| R-040 | docs/prd/r-040-canon-import-export-prd.md | [TBD] | [TBD] `packages/schemas/src/api/canon-export.ts`<br>[TBD] `scripts/canon-{import,export}.mjs` | [TBD] `packages/schemas/src/__tests__/canon-export.schema.test.ts` | Planned | Import/export canon with integrity. |
| R-041 | docs/prd/r-041-unified-retrieval-interface-prd.md | [TBD] | formalize `packages/rag/src/lib/retriever.ts` [TBD] | contract tests across drivers [TBD] | Planned | Single interface for all retrieval strategies/backends. |
| R-042 | docs/prd/r-042-field-aware-retrieval-order-prd.md | [TBD] | [TBD] `packages/rag/src/lib/scoring.ts` (weights) | [TBD] `packages/rag/src/lib/__tests__/scoring.field-order.test.ts` | Planned | Order results using field-aware weights. |
| R-043 | docs/prd/r-043-pluggable-embedding-model-prd.md | [TBD] | [TBD] `packages/rag/src/lib/embedding.ts` driver | [TBD] `packages/rag/src/lib/__tests__/embedding-driver.contract.test.ts` | Planned | Swappable embedding model drivers. |
| R-044 | docs/prd/r-044-deterministic-prompt-assembly-prd.md | [TBD] | [TBD] `packages/schemas/src/llm/prompt.schema.ts`<br>[TBD] `packages/rag/src/lib/postprocess.ts` | [TBD] `packages/rag/src/lib/__tests__/prompt.assembly.test.ts` | Planned | Reproducible prompts from structured inputs. |
| R-045 | docs/prd/r-045-field-level-retrieval-filtering-prd.md | [TBD] | [TBD] `packages/rag/src/lib/retriever.ts` (filters) | [TBD] `packages/rag/src/lib/__tests__/retriever.filters.test.ts` | Planned | Field-level retrieval filters. |
| R-046 | docs/prd/r-046-async-processing-support-prd.md | [TBD] | [TBD] `packages/worker-queue`<br>[TBD] server jobs | [TBD] `packages/worker-queue/src/__tests__/job.lifecycle.test.ts` | Planned | Async tasks like re-embedding and jobs. |
| R-047 | docs/prd/r-047-dedicated-worker-deployment-prd.md | [TBD] | worker Dockerfiles/manifests [TBD] | deployment smoke tests [TBD] | Planned | Separate worker processes for scale. |
| R-048 | docs/prd/r-048-reembedding-triggers-prd.md | [TBD] | [TBD] `packages/rag/src/lib/invalidation-bus.ts`<br>[TBD] DB triggers/outbox | [TBD] `packages/rag/src/lib/__tests__/invalidation.triggers.test.ts` | Planned | Trigger re-embedding on content/config changes. |
| R-049 | docs/prd/r-049-at-least-once-vector-sync-prd.md | [TBD] | outbox consumer idempotency [TBD] | semantics tests [TBD] | Planned | Reliable propagation of vectors to downstream stores. |
| R-050 | docs/prd/r-050-job-framework-scaling-retry-prd.md | [TBD] | [TBD] `packages/worker-queue` (retry/backoff) | [TBD] `packages/worker-queue/src/__tests__/retry.backoff.test.ts` | Planned | Robust job processing with retries. |
| R-051 | docs/prd/r-051-streaming-transport-prd.md | [TBD] | [TBD] server SSE/WebSocket | streaming integration tests [TBD] | Planned | Streaming endpoints for chat/retrieval. |
| R-052 | docs/prd/r-052-interleaved-retrieval-events-prd.md | [TBD] | event stream composition [TBD] | event ordering tests [TBD] | Planned | Interleave retrieval and generation events in streams. |
| R-053 | docs/prd/r-053-incremental-client-assembly-prd.md | [TBD] | [TBD] apps/web streaming UI | UI streaming tests [TBD] | Planned | Incremental UI assembly as data arrives. |
| R-054 | docs/prd/r-054-first-token-latency-target-prd.md | [TBD] | [TBD] `packages/rag/src/lib/metrics.ts` | extend bench tests [TBD] | Planned | Track and improve time-to-first-token. |
| R-055 | docs/prd/r-055-configurable-vector-backend-selection-prd.md | [TBD] | [TBD] `packages/rag/src/lib/config.ts` | config switching tests [TBD] | Planned | Select vector backend via configuration. |
| R-056 | docs/prd/r-056-dual-read-variance-logging-prd.md | [TBD] | retriever dual-read comparison [TBD] | variance calculation tests [TBD] | Planned | Observe differences between two backends. |
| R-057 | docs/prd/r-057-deterministic-normalization-prd.md | [TBD] | [TBD] `packages/extensions` normalization ordering | determinism property tests [TBD] | Planned | Ensure normalization yields consistent outcomes. |
| R-058 | docs/prd/r-058-llm-fallback-normalization-prd.md | [TBD] | normalization LLM fallback [TBD] | fallback activation tests [TBD] | Planned | Fall back to LLM normalization when rules fail. |
| R-059 | docs/prd/r-059-restricted-metadata-tagging-prd.md | [TBD] | tag schemas/policies [TBD] | tag permission tests [TBD] | Planned | Restrict who can apply sensitive tags. |
| R-060 | docs/prd/r-060-canon-version-linkage-prd.md | [TBD] | linkage fields in canon entities [TBD] | version linkage tests [TBD] | Planned | Maintain links between canon releases and versions. |
| R-061 | docs/prd/r-061-normalization-transparency-prd.md | [TBD] | API exposure of normalization deltas [TBD] | transparency endpoint tests [TBD] | Planned | Visibility into normalization changes. |
| R-062 | docs/prd/r-062-attribute-override-corrections-prd.md | [TBD] | correction rules and schemas [TBD] | correction rule tests [TBD] | Planned | Safe overrides with tracked corrections. |
| R-063 | docs/prd/r-063-correlation-identifiers-logging-prd.md | [TBD] | `packages/logging` correlation IDs [TBD] | correlation id tests [TBD] | Planned | Correlate logs across services/requests. |
| R-064 | docs/prd/r-064-tracing-spans-retrieval-generation-prd.md | [TBD] | OTEL spans (retrieval/generation) [TBD] | span coverage tests [TBD] | Planned | Instrument core operations with spans. |
| R-065 | docs/prd/r-065-restricted-attributes-log-masking-prd.md | [TBD] | log masking rules [TBD] | masking tests [TBD] | Planned | Mask sensitive attributes in logs. |
| R-066 | docs/prd/r-066-structured-json-logging-export-prd.md | [TBD] | JSON log exporters [TBD] | export format tests [TBD] | Planned | Export logs in structured JSON format. |
| R-067 | docs/prd/r-067-sensitive-data-exclusion-prd.md | [TBD] | filters at log/API layers [TBD] | exclusion tests [TBD] | Planned | Prevent sensitive data from leaving system. |
| R-068 | docs/prd/r-068-role-aware-ui-prd.md | [TBD] | apps/web role conditionals [TBD] | role-based UI tests [TBD] | Planned | Adapt UI features based on roles. |
| R-069 | docs/prd/r-069-schema-validated-forms-prd.md | [TBD] | forms bound to `@roler/schemas` [TBD] | form validation tests [TBD] | Planned | Bind UI forms to shared schemas. |
| R-070 | docs/prd/r-070-incremental-chat-view-prd.md | [TBD] | apps/web streaming view [TBD] | chat view streaming tests [TBD] | Planned | Display chat as it streams in. |
| R-071 | docs/prd/r-071-entity-editor-overrides-prd.md | [TBD] | UI editor overrides [TBD] | editor override tests [TBD] | Planned | Allow override behavior in UI editors. |
| R-072 | docs/prd/r-072-consistent-errors-loading-feedback-prd.md | [TBD] | error/loading UI components [TBD] | UI state tests [TBD] | Planned | Consistent UX for errors and loading. |
| R-073 | docs/prd/r-073-feature-organization-discoverability-prd.md | [TBD] | docs/site IA and UI nav [TBD] | navigation tests [TBD] | Planned | Improve feature discoverability. |
| R-074 | docs/prd/r-074-accessibility-compliance-wcag-prd.md | [TBD] | accessibility checks/components [TBD] | accessibility (axe) tests [TBD] | Planned | Meet WCAG accessibility standards. |
| R-075 | docs/prd/r-075-internationalization-readiness-prd.md | [TBD] | i18n setup in UI [TBD] | i18n locale tests [TBD] | Planned | Prepare UI for translation/locales. |
| R-076 | docs/prd/r-076-in-app-onboarding-links-prd.md | [TBD] | contextual help/links [TBD] | onboarding UX tests [TBD] | Planned | In-app onboarding links and guidance. |
| R-077 | docs/prd/r-077-restricted-field-exclusion-prompts-prd.md | [TBD] | prompt assembly filters [TBD] | prompt exclusion tests [TBD] | Planned | Exclude protected fields in prompts. |
| R-078 | docs/prd/r-078-environment-variable-validation-prd.md | [TBD] | `packages/schemas/src/system/env/*` [TBD] | env parsing tests [TBD] | Planned | Validate process environment variables. |
| R-079 | docs/prd/r-079-error-codes-rate-limiting-support-prd.md | [TBD] | rate limiter middleware [TBD] | rate limit integration tests [TBD] | Planned | Align rate limiting responses to standard codes. |
| R-080 | docs/prd/r-080-per-user-quota-rate-limits-prd.md | [TBD] | quota store (Redis) + middleware [TBD] | quota enforcement tests [TBD] | Planned | Apply per-user quotas and rate limits. |
| R-081 | docs/prd/r-081-data-residency-local-inference-prd.md | [TBD] | config-driven inference location [TBD] | residency enforcement tests [TBD] | Planned | Keep data/inference local or within region. |
| R-082 | docs/prd/r-082-unit-testing-coverage-prd.md | [TBD] | coverage thresholds in CI [TBD] | meta-tests for coverage [TBD] | Planned | Maintain/enforce unit test coverage targets. |
| R-083 | docs/prd/r-083-integration-testing-ephemeral-infra-prd.md | [TBD] | Testcontainers setup [TBD] | integration suites using ephemeral infra [TBD] | Planned | Spin up deps for realistic integration tests. |
| R-084 | docs/prd/r-084-retrieval-ranking-tests-prd.md | [TBD] | ranking test datasets [TBD] | ranking accuracy tests [TBD] | Planned | Validate retrieval ranking quality. |
| R-085 | docs/prd/r-085-schema-evolution-tests-prd.md | [TBD] | migration test harness [TBD] | back/forward compatibility tests [TBD] | Planned | Ensure schemas evolve safely. |
| R-086 | docs/prd/r-086-end-to-end-game-flow-tests-prd.md | [TBD] | E2E harness [TBD] | E2E scenarios across API/UI [TBD] | Planned | Validate complete flows end-to-end. |
| R-087 | docs/prd/r-087-property-fuzz-normalization-tests-prd.md | [TBD] | fuzz harness for normalization [TBD] | property-based tests [TBD] | Planned | Fuzz normalization with generated inputs. |
| R-088 | docs/prd/r-088-retrieval-latency-target-prd.md | [TBD] | latency metrics/budgets in `packages/rag` [TBD] | latency regression tests [TBD] | Planned | Enforce retrieval latency budgets. |
| R-089 | docs/prd/r-089-streaming-first-token-latency-prd.md | [TBD] | streaming instrumentation in server [TBD] | streaming latency tests [TBD] | Planned | Optimize and track first-token latency. |
| R-090 | docs/prd/r-090-outbox-eventual-consistency-prd.md | [TBD] | outbox worker + idempotency [TBD] | consistency tests [TBD] | Planned | Eventual consistency with outbox pattern. |
| R-091 | docs/prd/r-091-re-embedding-horizontal-scalability-prd.md | [TBD] | parallel workers + sharding [TBD] | scalability tests [TBD] | Planned | Scale re-embedding horizontally. |
| R-092 | docs/prd/r-092-service-availability-uptime-target-prd.md | [TBD] | health checks + redundancy [TBD] | synthetic uptime tests [TBD] | Planned | Achieve defined availability targets. |
| R-093 | docs/prd/r-093-session-storage-ha-prd.md | [TBD] | Redis cluster config [TBD] | failover tests [TBD] | Planned | HA for session storage. |
| R-094 | docs/prd/r-094-validated-runtime-configuration-prd.md | [TBD] | runtime env schemas in `@roler/schemas` [TBD] | config parsing tests [TBD] | Planned | Validate and load runtime configs. |
| R-095 | docs/prd/r-095-feature-flags-governance-prd.md | [TBD] | feature flag schemas + gating helpers [TBD] | flag gating tests [TBD] | Planned | Govern feature flag usage across envs. |
| R-096 | docs/prd/r-096-containerized-distribution-prd.md | [TBD] | Dockerfiles per service [TBD] | image build tests [TBD] | Planned | Ship services as containers. |
| R-097 | docs/prd/r-097-runtime-diagnostics-endpoint-prd.md | [TBD] | `/diagnostics` endpoint in server [TBD] | diagnostics endpoint tests [TBD] | Planned | Expose runtime diagnostics for operators. |
| R-098 | docs/prd/r-098-maintainability-quality-gates-prd.md | [TBD] | lint/type/test/coverage gates in CI [TBD] | quality gate meta-tests [TBD] | Planned | Enforce maintainability gates. |
| R-099 | docs/prd/r-099-cross-service-observability-prd.md | [TBD] | OTEL exporters/collectors [TBD] | observability integration tests [TBD] | Planned | Cross-service observability. |
| R-100 | docs/prd/r-100-horizontal-scalability-architecture-prd.md | [TBD] | worker scaling configs [TBD] | scale-out tests [TBD] | Planned | Design for horizontal scaling. |
| R-101 | docs/prd/r-101-restricted-attribute-authorization-prd.md | [TBD] | permissions in schemas/auth [TBD] | authorization tests [TBD] | Planned | Control access to sensitive fields. |
| R-102 | docs/prd/r-102-accessibility-compliance-prd.md | [TBD] | accessibility in UI components [TBD] | accessibility audits [TBD] | Planned | Ensure UI meets accessibility standards. |
| R-103 | docs/prd/r-103-internationalization-readiness-prd.md | [TBD] | i18n primitives + locale handling [TBD] | i18n tests [TBD] | Planned | Prepare app for multiple languages. |
| R-104 | docs/prd/r-104-documentation-governance-prd.md | [TBD] | docs linting/rules [TBD] | docs governance checks [TBD] | Planned | Govern documentation updates/quality. |
| R-105 | docs/prd/r-105-no-deep-imports-constraint-prd.md | [TBD] | ESLint rule; tsconfig guards [TBD] | lint rule tests [TBD] | Planned | Disallow deep imports across packages. |
| R-106 | docs/prd/r-106-local-inference-default-constraint-prd.md | [TBD] | default config for local inference [TBD] | config default tests [TBD] | Planned | Default to local models by default. |
| R-107 | docs/prd/r-107-strict-typescript-config-constraint-prd.md | [TBD] | strict tsconfig/base config [TBD] | type-check gating in CI [TBD] | Planned | Enforce strict TS configuration across repo. |

## Reverse Index (Implementation → Requirements)

Implemented (and named planned) paths mapped to requirement IDs:

- `packages/extensions/src/index.ts` → R-001
- `packages/schemas/src/system/extensions/extension-manifest.schema.ts` → R-001
- `packages/schemas/src/system/extensions/extension-registration-config.schema.ts` → R-001
- `packages/schemas/src/system/extensions/state-transaction.schema.ts` → R-001
- `packages/schemas/src/system/env/extensions-env.schema.ts` → R-001
- `packages/schemas/src/system/env/extensions-runtime-env.schema.ts` → R-001
- `packages/pre-save-age-check` → R-001
- `packages/relationship-score-normalizer` → R-001
- `packages/scene-retrieval-tags` → R-001

- `packages/rag/src/index.ts` → R-002
- `packages/rag/src/lib/orchestrator.ts` → R-002
- `packages/rag/src/lib/retriever.ts` → R-002, R-005 (planned), R-041 (planned), R-045 (planned), R-055 (planned), R-056 (planned)
- `packages/rag/src/lib/query-result-cache.ts` → R-002
- `packages/rag/src/lib/deadline.ts` → R-002, R-054 (planned), R-088 (planned), R-089 (planned)
- `packages/rag/src/lib/feature-gated.ts` → R-002, R-095 (planned)
- `packages/rag/src/lib/metrics.ts` → R-002, R-054 (planned), R-088 (planned), R-089 (planned)
- `packages/rag/src/lib/postprocess.ts` → R-002, R-044 (planned), R-077 (planned)

- `packages/schemas/src/system/versioning/*` → R-003, R-036 (planned), R-060 (planned)
- `packages/schemas/src/entity/canonical/migrations.ts` → R-003

- `packages/http-utils/src/request-validate.ts` → R-004, R-026 (planned), R-028 (planned)
- `packages/http-utils/src/index.ts` → R-004
- `packages/schemas/src/errors.schema.ts` → R-004, R-028 (planned), R-030 (planned)

Tests:

- `packages/extensions/src/index.test.ts` → R-001
- `packages/schemas/src/__tests__/extensions/extension-manifest.schema.test.ts` → R-001
- `packages/schemas/src/__tests__/client-load.test.ts` → R-001

- `packages/rag/src/lib/__tests__/deadline.test.ts` → R-002, R-054 (planned), R-088 (planned)
- `packages/rag/src/lib/__tests__/metrics.test.ts` → R-002, R-054 (planned), R-088 (planned)
- `packages/rag/src/lib/__tests__/query-result-cache.test.ts` → R-002
- `packages/rag/src/bin/__tests__/bench.test.ts` → R-002, R-054 (planned)

- `packages/schemas/src/__tests__/versioning.schemas.test.ts` → R-003, R-036 (planned), R-060 (planned)
- `packages/schemas/src/__tests__/error-codes.versioning.schema.test.ts` → R-003, R-030 (planned)
- `packages/schemas/src/__tests__/core-entities.schema.test.ts` → R-003

- `packages/http-utils/src/__tests__/request-validate.test.ts` → R-004, R-026 (planned), R-028 (planned)
- `packages/http-utils/src/__tests__/integration-boundary.test.ts` → R-004, R-026 (planned)

## Notes

- The table above is the primary, auditable source for traceability. Narrative sections in `docs/traceability/rtm.md`
  may provide additional context, but this file contains the authoritative matrix and reverse index.
- Use [TBD] placeholders proactively; replace them with concrete paths and update Status as implementation progresses.
