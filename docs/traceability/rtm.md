# Requirements Traceability Matrix (RTM)

 last-updated: 2025-09-30
status: In-Progress

This matrix is the source of truth for requirement-to-implementation traceability. Each row corresponds to a
requirement R-001..R-107 and links to PRDs, tech specs, implementations, tests, and current status.

## Execution Traceability

9-column schema capturing acceptance evidence for implemented (or planned) early requirements.

| ID | Summary | Acceptance Criteria | Spec/ADR | Impl (PRs) | Tests | Evidence | Status | Owner |
|----|---------|--------------------|---------|-----------|-------|----------|--------|-------|
| R-001 | Extensible extension framework | 1. Manifests validate.<br>2. Extensions register & resolve.<br>3. Env gating hides disabled.<br>4. Invalid manifest rejected. | docs/design/r-001-extensible-framework-techspec.md | (legacy commit) | index.test.ts<br>extension-manifest.schema.test.ts<br>client-load.test.ts | Test suite pass 2025-09-29 | Verified | cpn |
| R-002 | Low-latency retrieval core | 1. Deadline cancels overtime.<br>2. Cache serves hits.<br>3. Latency & cache metrics emitted.<br>4. Bench within target envelope. | docs/design/r-002-low-latency-retrieval-techspec.md | (legacy commit) | deadline.test.ts<br>metrics.test.ts<br>query-result-cache.test.ts<br>bench.test.ts | Test suite pass 2025-09-29 | Verified | cpn |
| R-003 | Canonical versioning schemas | 1. Snapshot & diff validate.<br>2. Diffs show add/remove/change.<br>3. Invalid diff rejected.<br>4. Migration links validated. | docs/design/r-003-canonical-versioning-techspec.md | (legacy commit) | versioning.schemas.test.ts<br>error-codes.versioning.schema.test.ts<br>core-entities.schema.test.ts | Test suite pass 2025-09-29 | Verified | cpn |
| R-004 | Boundary safety validation | 1. All inbound requests validated.<br>2. Invalid input → standardized error.<br>3. Error codes stable.<br>4. Integration boundary test passes. | docs/design/r-004-boundary-safety-techspec.md | (legacy commit) | request-validate.test.ts<br>integration-boundary.test.ts | Test suite pass 2025-09-29 | Verified | cpn |
| R-005 | Pluggable vector store layer | 1. Updating `RetrieverConfigSchema.primary.kind` flips adapters with smoke tests proving pgvector ↔ qdrant swap.<br>2. Enabling `dualRead.enabled` emits `retr_backend_latency_ms` and delta metrics without impacting primary responses.<br>3. Normalizer maps backend scores to `[0,1]` while preserving ordering across synthetic regression suites.<br>4. Shadow backend failures emit `RETR_DUAL_VARIANCE_HIGH` events yet return the primary result.<br>5. Invalid config payloads fail fast via schema guards prior to retriever activation. | docs/prd/r-005-pluggable-vector-store-prd.md<br>docs/design/r-005-pluggable-vector-store-techspec.md | packages/schemas/src/rag/retriever-config.ts<br>packages/rag/src/lib/retriever/types.ts<br>packages/rag/src/lib/retriever/factory.ts<br>packages/rag/src/lib/retriever/normalizer.ts<br>packages/rag/src/lib/retriever/dual-read.ts<br>packages/rag/src/lib/retriever/dual-read-metrics.ts<br>packages/rag/src/lib/retriever/adapters/pgvector-adapter.ts<br>packages/rag/src/lib/retriever/adapters/qdrant-adapter.ts<br>packages/rag/src/lib/metrics.ts | `packages/schemas/src/rag/__tests__/retriever-config.schema.test.ts`<br>`packages/rag/src/lib/retriever/__tests__/config-schema.test.ts`<br>`packages/rag/src/lib/retriever/__tests__/factory-swap.test.ts`<br>`packages/rag/src/lib/retriever/__tests__/adapter-swap-smoke.test.ts`<br>`packages/rag/src/lib/retriever/__tests__/normalizer.test.ts`<br>`packages/rag/src/lib/retriever/__tests__/qdrant-adapter.test.ts`<br>`packages/rag/src/lib/retriever/__tests__/dual-read-wrapper.test.ts`<br>`packages/rag/src/lib/retriever/__tests__/dual-read-metrics.test.ts`<br>`packages/rag/src/lib/__tests__/metrics.test.ts` | Tech spec accepted 2025-09-04; PRD accepted 2025-09-29; Qdrant adapter implemented 2025-09-30 with swap smoke tests; dedicated adapter regression suite added 2025-10-01 verifying raw score handoff to the normalizer; metrics exporter updated 2025-10-01 to surface `retr_backend_latency_ms` and dual-read deltas via `getRetrievalMetricSeries()`; variance alerting wired 2025-10-02 emitting `RETR_DUAL_VARIANCE_HIGH` on threshold breach or shadow error; operational guides published 2025-09-30 (`docs/operations/retriever.md`, `docs/operations/variance-monitoring.md`, `docs/operations/dual-read-swap-runbook.md`). | Verified | cpn |
| R-006 | Custom entities via plugins | 1. Extensions add entity types.<br>2. Attributes safely extended.<br>3. Schema validation passes. | docs/design/r-006-custom-entities-plugins-techspec.md | (planned) | custom-entity.extension.test.ts<br>custom-entity.schema.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-007 | Modding import/export | 1. Canon data imports safely.<br>2. Mods export with integrity.<br>3. CLI integration tests pass. | docs/design/r-007-modding-import-export-techspec.md | (planned) | import-export.schema.test.ts<br>modding-cli.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-008 | Developer usability | 1. Docs site builds.<br>2. Examples in READMEs.<br>3. API clarity improved. | docs/design/r-008-developer-usability-techspec.md | (planned) | packages/docs-site build smoke | Spec accepted; impl pending | Planned | cpn |
| R-009 | Transparent normalization | 1. Normalization effects surfaced.<br>2. Ordering transparently shown.<br>3. Extension tests pass. | docs/design/r-009-transparent-normalization-techspec.md | (planned) | normalization.transparency.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-010 | Reactive frontend | 1. UI reacts to game flow.<br>2. Streaming supported.<br>3. Contracts validated. | docs/design/r-010-reactive-frontend-techspec.md | (planned) | apps/web/src/__tests__/* | Spec accepted; impl pending | Planned | cpn |
| R-011 | Modern server runtime | 1. Typed API routes.<br>2. Shared validation.<br>3. Integration tests pass. | [TBD] | (planned) | routes.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-012 | Relational vector datastore | 1. Vectors stored in Postgres.<br>2. Pgvector integrated.<br>3. Migration tests pass. | [TBD] | (planned) | migrations.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-013 | Alternative vector backends | 1. Non-Postgres stores supported.<br>2. Drivers integrated.<br>3. Integration tests pass. | [TBD] | (planned) | driver.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-014 | In-memory queue | 1. Simple job queue.<br>2. Local workloads supported.<br>3. Behavior tests pass. | [TBD] | (planned) | queue.behavior.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-015 | Local LLM support | 1. Local inference enabled.<br>2. Embeddings supported.<br>3. Client tests pass. | [TBD] | (planned) | ollama.client.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-016 | Type-safe data access | 1. DB access type-safe.<br>2. Generated types used.<br>3. Schema guards enforced. | [TBD] | (planned) | type-safety.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-017 | Centralized validation layer | 1. One validation layer.<br>2. All boundaries covered.<br>3. Integration tests pass. | [TBD] | (planned) | central-validate.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-018 | Automated test framework | 1. Shared test harness.<br>2. Utilities available.<br>3. Self-tests pass. | [TBD] | (planned) | harness.selftest.ts | Spec accepted; impl pending | Planned | cpn |
| R-019 | Structured logging/tracing | 1. JSON logging standardized.<br>2. Tracing spans added.<br>3. Logging tests pass. | [TBD] | (planned) | json-logging.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-020 | Modular packaging | 1. Packages modular.<br>2. Boundaries clean.<br>3. Structure guard tests pass. | [TBD] | (planned) | structure.guard.test.mjs | Spec accepted; impl pending | Planned | cpn |
| R-021 | Module boundaries | 1. Deep imports prevented.<br>2. Layering enforced.<br>3. ESLint rule tests pass. | [TBD] | (planned) | no-deep-imports.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-022 | Incremental build pipeline | 1. Builds cached.<br>2. Scoped runs.<br>3. CI smoke checks pass. | [TBD] | (planned) | CI smoke checks | Spec accepted; impl pending | Planned | cpn |
| R-023 | Strict type safety | 1. TypeScript strict.<br>2. Rules enforced.<br>3. Type tests pass. | [TBD] | (planned) | type tests in packages/* | Spec accepted; impl pending | Planned | cpn |
| R-024 | Contracts-first development | 1. Contracts in schemas.<br>2. Development follows.<br>3. Snapshots validate. | [TBD] | (planned) | schema surface snapshots | Spec accepted; impl pending | Planned | cpn |
| R-025 | Shared schema layer | 1. Schemas centralized.<br>2. Reuse consistent.<br>3. Import tests pass. | [TBD] | (planned) | cross-package schema import tests | Spec accepted; impl pending | Planned | cpn |
| R-026 | Inbound request validation | 1. All requests validated.<br>2. Schemas shared.<br>3. Validation tests extended. | [TBD] | (planned) | extend request-validate.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-027 | Type inference reuse | 1. z.infer types reused.<br>2. Duplication avoided.<br>3. Inference tests pass. | [TBD] | (planned) | type inference tests | Spec accepted; impl pending | Planned | cpn |
| R-028 | Standardized error shape | 1. Error envelope consistent.<br>2. Fields stable.<br>3. Schema tests pass. | [TBD] | (planned) | errors.schema.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-029 | Contextual error logging | 1. Context in logs.<br>2. Request/session included.<br>3. Logging tests pass. | [TBD] | (planned) | context-logging.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-030 | Stable error codes | 1. Error codes cataloged.<br>2. Versioned/stable.<br>3. Snapshots validate. | [TBD] | (planned) | error code snapshots | Spec accepted; impl pending | Planned | cpn |
| R-031 | Session authentication | 1. JWT sessions.<br>2. Redis backed.<br>3. Integration tests pass. | [TBD] | (planned) | session.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-032 | Role enforcement | 1. GM vs Player roles.<br>2. Checks enforced.<br>3. Role guard tests pass. | [TBD] | (planned) | role.guard.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-033 | Per-game authorization | 1. Instance-scoped auth.<br>2. Scope enforced.<br>3. Scope guard tests pass. | [TBD] | (planned) | instance-scope.guard.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-034 | Extensible auth providers | 1. Pluggable providers.<br>2. Adapters available.<br>3. Adapter tests pass. | [TBD] | (planned) | providers.adapter.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-035 | Auth event auditing | 1. Key events audited.<br>2. Logging integrated.<br>3. Audit tests pass. | [TBD] | (planned) | audit-log.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-036 | Entity versioning/vectors | 1. Versions linked to vectors.<br>2. Embedding lifecycle.<br>3. Integration tests pass. | [TBD] | (planned) | versioning-vector.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-037 | Flexible structured fields | 1. Entity fields extensible.<br>2. Structured safely.<br>3. Schema tests pass. | [TBD] | (planned) | flex-fields.schema.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-038 | Relational primary vector search | 1. Postgres + pgvector primary.<br>2. Retrieval integrated.<br>3. Integration tests pass. | [TBD] | (planned) | pgvector.retriever.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-039 | Outbox propagation | 1. Outbox pattern.<br>2. Eventual consistency.<br>3. Integration tests pass. | [TBD] | (planned) | outbox.integration.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-040 | Canon import/export | 1. Canon data integrity.<br>2. Import/export safe.<br>3. Schema tests pass. | [TBD] | (planned) | canon-export.schema.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-041 | Unified retrieval interface | 1. Single interface.<br>2. All backends.<br>3. Contract tests pass. | [TBD] | (planned) | contract tests across drivers | Spec accepted; impl pending | Planned | cpn |
| R-042 | Field-aware retrieval order | 1. Weights applied.<br>2. Results ordered.<br>3. Order tests pass. | [TBD] | (planned) | scoring.field-order.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-043 | Pluggable embedding model | 1. Swappable drivers.<br>2. Models supported.<br>3. Contract tests pass. | [TBD] | (planned) | embedding-driver.contract.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-044 | Deterministic prompt assembly | 1. Prompts reproducible.<br>2. Structured inputs.<br>3. Assembly tests pass. | [TBD] | (planned) | prompt.assembly.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-045 | Field-level retrieval filtering | 1. Field filters applied.<br>2. Retrieval scoped.<br>3. Filter tests pass. | [TBD] | (planned) | retriever.filters.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-046 | Async processing support | 1. Async tasks enabled.<br>2. Re-embedding supported.<br>3. Lifecycle tests pass. | [TBD] | (planned) | job.lifecycle.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-047 | Dedicated worker deployment | 1. Separate processes.<br>2. Scale supported.<br>3. Smoke tests pass. | [TBD] | (planned) | deployment smoke tests | Spec accepted; impl pending | Planned | cpn |
| R-048 | Reembedding triggers | 1. Triggers on changes.<br>2. Re-embedding automated.<br>3. Trigger tests pass. | [TBD] | (planned) | invalidation.triggers.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-049 | At-least-once vector sync | 1. Reliable propagation.<br>2. Idempotent.<br>3. Semantics tests pass. | [TBD] | (planned) | semantics tests | Spec accepted; impl pending | Planned | cpn |
| R-050 | Job framework scaling/retry | 1. Retries/backoff.<br>2. Robust processing.<br>3. Retry tests pass. | [TBD] | (planned) | retry.backoff.test.ts | Spec accepted; impl pending | Planned | cpn |
| R-051 | Streaming transport | 1. Streaming endpoints.<br>2. Chat/retrieval streamed.<br>3. Integration tests pass. | [TBD] | (planned) | streaming integration tests | Spec accepted; impl pending | Planned | cpn |
| R-052 | Interleaved retrieval events | 1. Events interleaved.<br>2. Retrieval/generation.<br>3. Ordering tests pass. | [TBD] | (planned) | event ordering tests | Spec accepted; impl pending | Planned | cpn |
| R-053 | Incremental client assembly | 1. UI assembles incrementally.<br>2. Data arrival.<br>3. Streaming tests pass. | [TBD] | (planned) | chat view streaming tests | Spec accepted; impl pending | Planned | cpn |
| R-054 | First-token latency target | 1. Time-to-first-token tracked.<br>2. Latency improved.<br>3. Bench tests extended. | [TBD] | (planned) | extend bench tests | Spec accepted; impl pending | Planned | cpn |
| R-055 | Configurable vector backend selection | 1. Backend selectable.<br>2. Configuration driven.<br>3. Switching tests pass. | [TBD] | (planned) | config switching tests | Spec accepted; impl pending | Planned | cpn |
| R-056 | Dual-read variance logging | 1. Differences observed.<br>2. Variance logged.<br>3. Calculation tests pass. | [TBD] | (planned) | variance calculation tests | Spec accepted; impl pending | Planned | cpn |
| R-057 | Deterministic normalization | 1. Normalization consistent.<br>2. Outcomes deterministic.<br>3. Property tests pass. | [TBD] | (planned) | determinism property tests | Spec accepted; impl pending | Planned | cpn |
| R-058 | LLM fallback normalization | 1. Fallback to LLM.<br>2. Rules fail.<br>3. Activation tests pass. | [TBD] | (planned) | fallback activation tests | Spec accepted; impl pending | Planned | cpn |
| R-059 | Restricted metadata tagging | 1. Sensitive tags restricted.<br>2. Permissions enforced.<br>3. Permission tests pass. | [TBD] | (planned) | tag permission tests | Spec accepted; impl pending | Planned | cpn |
| R-060 | Canon version linkage | 1. Links maintained.<br>2. Releases/versions.<br>3. Linkage tests pass. | [TBD] | (planned) | version linkage tests | Spec accepted; impl pending | Planned | cpn |
| R-061 | Normalization transparency | 1. Effects visible.<br>2. Changes exposed.<br>3. Endpoint tests pass. | [TBD] | (planned) | transparency endpoint tests | Spec accepted; impl pending | Planned | cpn |
| R-062 | Attribute override corrections | 1. Overrides safe.<br>2. Corrections tracked.<br>3. Correction tests pass. | [TBD] | (planned) | correction rule tests | Spec accepted; impl pending | Planned | cpn |
| R-063 | Correlation identifiers logging | 1. Correlation IDs.<br>2. Logs across services.<br>3. Correlation tests pass. | [TBD] | (planned) | correlation id tests | Spec accepted; impl pending | Planned | cpn |
| R-064 | Tracing spans retrieval/generation | 1. Spans instrumented.<br>2. Core operations.<br>3. Span coverage tests pass. | [TBD] | (planned) | span coverage tests | Spec accepted; impl pending | Planned | cpn |
| R-065 | Restricted attributes log masking | 1. Sensitive masked.<br>2. Logs protected.<br>3. Masking tests pass. | [TBD] | (planned) | masking tests | Spec accepted; impl pending | Planned | cpn |
| R-066 | Structured JSON logging export | 1. JSON exports.<br>2. Structured format.<br>3. Export tests pass. | [TBD] | (planned) | export format tests | Spec accepted; impl pending | Planned | cpn |
| R-067 | Sensitive data exclusion | 1. Data excluded.<br>2. Layers protected.<br>3. Exclusion tests pass. | [TBD] | (planned) | exclusion tests | Spec accepted; impl pending | Planned | cpn |
| R-068 | Role-aware UI | 1. UI adapts to roles.<br>2. Features conditional.<br>3. Role-based tests pass. | [TBD] | (planned) | role-based UI tests | Spec accepted; impl pending | Planned | cpn |
| R-069 | Schema-validated forms | 1. Forms bound to schemas.<br>2. Validation enforced.<br>3. Form validation tests pass. | [TBD] | (planned) | form validation tests | Spec accepted; impl pending | Planned | cpn |
| R-070 | Incremental chat view | 1. Chat streams in.<br>2. Incremental display.<br>3. Streaming tests pass. | [TBD] | (planned) | chat view streaming tests | Spec accepted; impl pending | Planned | cpn |
| R-071 | Entity editor overrides | 1. Overrides allowed.<br>2. UI editors.<br>3. Override tests pass. | [TBD] | (planned) | editor override tests | Spec accepted; impl pending | Planned | cpn |
| R-072 | Consistent errors/loading feedback | 1. Errors consistent.<br>2. Loading feedback.<br>3. UI state tests pass. | [TBD] | (planned) | UI state tests | Spec accepted; impl pending | Planned | cpn |
| R-073 | Feature organization discoverability | 1. Features discoverable.<br>2. IA and nav.<br>3. Navigation tests pass. | [TBD] | (planned) | navigation tests | Spec accepted; impl pending | Planned | cpn |
| R-074 | Accessibility compliance WCAG | 1. WCAG compliant.<br>2. Checks/components.<br>3. Accessibility tests pass. | [TBD] | (planned) | accessibility (axe) tests | Spec accepted; impl pending | Planned | cpn |
| R-075 | Internationalization readiness | 1. i18n prepared.<br>2. Translation ready.<br>3. Locale tests pass. | [TBD] | (planned) | i18n locale tests | Spec accepted; impl pending | Planned | cpn |
| R-076 | In-app onboarding links | 1. Onboarding links.<br>2. Contextual help.<br>3. Onboarding tests pass. | [TBD] | (planned) | onboarding UX tests | Spec accepted; impl pending | Planned | cpn |
| R-077 | Restricted field exclusion prompts | 1. Protected fields excluded.<br>2. Prompts filtered.<br>3. Exclusion tests pass. | [TBD] | (planned) | prompt exclusion tests | Spec accepted; impl pending | Planned | cpn |
| R-078 | Environment variable validation | 1. Env vars validated.<br>2. Schemas enforced.<br>3. Parsing tests pass. | [TBD] | (planned) | env parsing tests | Spec accepted; impl pending | Planned | cpn |
| R-079 | Error codes rate limiting support | 1. Rate limiting aligned.<br>2. Codes standard.<br>3. Integration tests pass. | [TBD] | (planned) | rate limit integration tests | Spec accepted; impl pending | Planned | cpn |
| R-080 | Per-user quota/rate limits | 1. Quotas enforced.<br>2. Per-user.<br>3. Enforcement tests pass. | [TBD] | (planned) | quota enforcement tests | Spec accepted; impl pending | Planned | cpn |
| R-081 | Data residency local inference | 1. Data local.<br>2. Inference controlled.<br>3. Enforcement tests pass. | [TBD] | (planned) | residency enforcement tests | Spec accepted; impl pending | Planned | cpn |
| R-082 | Unit testing coverage | 1. Coverage targets.<br>2. Unit tests enforced.<br>3. Meta-tests pass. | [TBD] | (planned) | meta-tests for coverage | Spec accepted; impl pending | Planned | cpn |
| R-083 | Integration testing ephemeral infra | 1. Ephemeral deps.<br>2. Realistic tests.<br>3. Integration suites pass. | [TBD] | (planned) | integration suites using ephemeral infra | Spec accepted; impl pending | Planned | cpn |
| R-084 | Retrieval ranking tests | 1. Ranking validated.<br>2. Quality tested.<br>3. Accuracy tests pass. | [TBD] | (planned) | ranking accuracy tests | Spec accepted; impl pending | Planned | cpn |
| R-085 | Schema evolution tests | 1. Schemas evolve safely.<br>2. Compatibility maintained.<br>3. Compatibility tests pass. | [TBD] | (planned) | back/forward compatibility tests | Spec accepted; impl pending | Planned | cpn |
| R-086 | End-to-end game flow tests | 1. Complete flows tested.<br>2. API/UI covered.<br>3. E2E scenarios pass. | [TBD] | (planned) | E2E scenarios across API/UI | Spec accepted; impl pending | Planned | cpn |
| R-087 | Property fuzz normalization tests | 1. Normalization fuzzed.<br>2. Generated inputs.<br>3. Property tests pass. | [TBD] | (planned) | property-based tests | Spec accepted; impl pending | Planned | cpn |
| R-088 | Retrieval latency target | 1. Latency budgets.<br>2. Retrieval enforced.<br>3. Regression tests pass. | [TBD] | (planned) | latency regression tests | Spec accepted; impl pending | Planned | cpn |
| R-089 | Streaming first-token latency | 1. First-token optimized.<br>2. Latency tracked.<br>3. Streaming tests pass. | [TBD] | (planned) | streaming latency tests | Spec accepted; impl pending | Planned | cpn |
| R-090 | Outbox eventual consistency | 1. Eventual consistency.<br>2. Outbox pattern.<br>3. Consistency tests pass. | [TBD] | (planned) | consistency tests | Spec accepted; impl pending | Planned | cpn |
| R-091 | Re-embedding horizontal scalability | 1. Horizontal scale.<br>2. Re-embedding.<br>3. Scalability tests pass. | [TBD] | (planned) | scalability tests | Spec accepted; impl pending | Planned | cpn |
| R-092 | Service availability uptime target | 1. Availability targets.<br>2. Health checks.<br>3. Synthetic tests pass. | [TBD] | (planned) | synthetic uptime tests | Spec accepted; impl pending | Planned | cpn |
| R-093 | Session storage HA | 1. HA storage.<br>2. Session data.<br>3. Failover tests pass. | [TBD] | (planned) | failover tests | Spec accepted; impl pending | Planned | cpn |
| R-094 | Validated runtime configuration | 1. Runtime configs validated.<br>2. Schemas enforced.<br>3. Parsing tests pass. | [TBD] | (planned) | config parsing tests | Spec accepted; impl pending | Planned | cpn |
| R-095 | Feature flags governance | 1. Flags governed.<br>2. Usage controlled.<br>3. Gating tests pass. | [TBD] | (planned) | flag gating tests | Spec accepted; impl pending | Planned | cpn |
| R-096 | Containerized distribution | 1. Services containerized.<br>2. Distribution ready.<br>3. Build tests pass. | [TBD] | (planned) | image build tests | Spec accepted; impl pending | Planned | cpn |
| R-097 | Runtime diagnostics endpoint | 1. Diagnostics exposed.<br>2. Operators access.<br>3. Endpoint tests pass. | [TBD] | (planned) | diagnostics endpoint tests | Spec accepted; impl pending | Planned | cpn |
| R-098 | Maintainability quality gates | 1. Quality gates.<br>2. CI enforced.<br>3. Meta-tests pass. | [TBD] | (planned) | quality gate meta-tests | Spec accepted; impl pending | Planned | cpn |
| R-099 | Cross-service observability | 1. Cross-service.<br>2. Observability.<br>3. Integration tests pass. | [TBD] | (planned) | observability integration tests | Spec accepted; impl pending | Planned | cpn |
| R-100 | Horizontal scalability architecture | 1. Horizontal scaling.<br>2. Architecture designed.<br>3. Scale-out tests pass. | [TBD] | (planned) | scale-out tests | Spec accepted; impl pending | Planned | cpn |
| R-101 | Restricted attribute authorization | 1. Sensitive fields controlled.<br>2. Access restricted.<br>3. Authorization tests pass. | [TBD] | (planned) | authorization tests | Spec accepted; impl pending | Planned | cpn |
| R-102 | Accessibility compliance | 1. UI accessible.<br>2. Standards met.<br>3. Audits pass. | [TBD] | (planned) | accessibility audits | Spec accepted; impl pending | Planned | cpn |
| R-103 | Internationalization readiness | 1. Multi-language prepared.<br>2. Primitives ready.<br>3. i18n tests pass. | [TBD] | (planned) | i18n tests | Spec accepted; impl pending | Planned | cpn |
| R-104 | Documentation governance | 1. Docs governed.<br>2. Updates/quality.<br>3. Governance checks pass. | [TBD] | (planned) | docs governance checks | Spec accepted; impl pending | Planned | cpn |
| R-105 | No deep imports constraint | 1. Deep imports disallowed.<br>2. Boundaries enforced.<br>3. Lint rule tests pass. | [TBD] | (planned) | lint rule tests | Spec accepted; impl pending | Planned | cpn |
| R-106 | Local inference default constraint | 1. Local default.<br>2. Inference local.<br>3. Default tests pass. | [TBD] | (planned) | config default tests | Spec accepted; impl pending | Planned | cpn |
| R-107 | Strict TypeScript config constraint | 1. Strict TS enforced.<br>2. Config consistent.<br>3. Type-check gating passes. | [TBD] | (planned) | type-check gating in CI | Spec accepted; impl pending | Planned | cpn |

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
- `packages/rag/src/lib/retriever.ts` → R-002, R-041 (planned), R-045 (planned), R-055 (planned), R-056 (planned)
- `packages/rag/src/lib/retriever/types.ts` → R-005
- `packages/rag/src/lib/retriever/factory.ts` → R-005
- `packages/rag/src/lib/retriever/adapters/pgvector-adapter.ts` → R-005
- `packages/rag/src/lib/retriever/adapters/qdrant-adapter.ts` → R-005
- `packages/rag/src/lib/retriever/dual-read-wrapper.ts` → R-005
- `packages/rag/src/lib/retriever/normalizer.ts` → R-005
- `packages/rag/src/lib/retriever/metrics.ts` → R-002, R-005, R-054 (planned), R-088 (planned), R-089 (planned)
- `packages/rag/src/lib/query-result-cache.ts` → R-002
- `docs/operations/retriever.md` → R-002, R-005
- `docs/operations/variance-monitoring.md` → R-005
- `docs/operations/dual-read-swap-runbook.md` → R-005
- `packages/rag/src/lib/deadline.ts` → R-002, R-054 (planned), R-088 (planned), R-089 (planned)
- `packages/rag/src/lib/feature-gated.ts` → R-002, R-095 (planned)
- `packages/rag/src/lib/metrics.ts` → R-002, R-054 (planned), R-088 (planned), R-089 (planned)
- `packages/rag/src/lib/postprocess.ts` → R-002, R-044 (planned), R-077 (planned)
- `packages/schemas/src/system/versioning/*` → R-003, R-036 (planned), R-060 (planned)
- `packages/schemas/src/entity/canonical/migrations.ts` → R-003
- `packages/http-utils/src/request-validate.ts` → R-004, R-026 (planned), R-028 (planned)
- `packages/http-utils/src/index.ts` → R-004
- `packages/schemas/src/errors.schema.ts` → R-004, R-028 (planned), R-030 (planned)
- `packages/schemas/src/rag/retriever-config.schema.ts` → R-005

Tests:

- `packages/extensions/src/index.test.ts` → R-001
- `packages/schemas/src/__tests__/extensions/extension-manifest.schema.test.ts` → R-001
- `packages/schemas/src/__tests__/client-load.test.ts` → R-001

- `packages/rag/src/lib/__tests__/deadline.test.ts` → R-002, R-054 (planned), R-088 (planned)
- `packages/rag/src/lib/__tests__/metrics.test.ts` → R-002, R-054 (planned), R-088 (planned)
- `packages/rag/src/lib/__tests__/query-result-cache.test.ts` → R-002
- `packages/rag/src/bin/__tests__/bench.test.ts` → R-002, R-054 (planned)
- `packages/rag/src/lib/retriever/__tests__/config-schema.test.ts` → R-005
- `packages/rag/src/lib/retriever/__tests__/factory-swap.test.ts` → R-005
- `packages/rag/src/lib/retriever/__tests__/qdrant-adapter.test.ts` → R-005
- `packages/rag/src/lib/retriever/__tests__/dual-read.test.ts` → R-005
- `packages/rag/src/lib/retriever/__tests__/normalizer.test.ts` → R-005
- `packages/rag/src/lib/retriever/__tests__/shadow-failure.test.ts` → R-005
- `packages/rag/src/lib/retriever/__tests__/perf-smoke.test.ts` → R-005

- `packages/schemas/src/__tests__/versioning.schemas.test.ts` → R-003, R-036 (planned), R-060 (planned)
- `packages/schemas/src/__tests__/error-codes.versioning.schema.test.ts` → R-003, R-030 (planned)
- `packages/schemas/src/__tests__/core-entities.schema.test.ts` → R-003

- `packages/http-utils/src/__tests__/request-validate.test.ts` → R-004, R-026 (planned), R-028 (planned)
- `packages/http-utils/src/__tests__/integration-boundary.test.ts` → R-004, R-026 (planned)

## Notes

- The table above is the primary, auditable source for traceability. Narrative sections in `docs/traceability/rtm.md`
  may provide additional context, but this file contains the authoritative matrix and reverse index.
- Use [TBD] placeholders proactively; replace them with concrete paths and update Status as implementation progresses.
