# Roler Project Requirements

Version: 1.0
Source Basis: `.github/copilot-instructions.md` (architecture & coding standards directive)
Status: Draft (baseline extracted from existing engineering instructions)

## 1. Project Overview

Roler is a framework (not a full game engine) for building narrative-driven tabletop or hybrid roleplaying experiences that leverage LLM-assisted content generation. Target users: hobbyist Game Masters (GMs), indie narrative designers, and developers embedding dynamic storytelling into custom tools. It offers GM/Player role‑scoped access, canonical + instance game entity management, retrieval‑augmented generation (RAG), and pluggable vector store backends while remaining extensible via custom entity types, attributes, and normalization rules.

## 2. High-Level Goals

- (R-001) Provide an extensible framework enabling dynamic narrative and structured entity state management (framework emphasis clarified).
- (R-002) Support low-latency contextual retrieval for LLM prompts.
- (R-003) Preserve canonical source-of-truth versions for game entities with lineage & diff/merge capabilities.
- (R-004) Enforce strong typing, validation, and safety across all boundaries (no unchecked inputs).
- (R-005) Vector store backend must be pluggable and replaceable without changing application logic.
- (R-006) Enable extensibility: custom entity types, custom attributes, and optional plugin-style feature injection.
- (R-007) Support modding & community content via import/export of canon objects (version-aware structured JSON).
- (R-008) Promote developer usability through contracts-first APIs and predictable schema evolution.
- (R-009) Provide transparent normalization with user override capabilities.

## 3. Platform & Technology Requirements (High-Level)

Note: Detailed stack choices are documented in Architecture Decision Records (ADR-001..n). This section states technology-agnostic requirements; current implementation (SvelteKit, Postgres, etc.) satisfies them but may evolve.

- (R-010) Provide a web-based reactive frontend supporting incremental streaming updates.
- (R-011) Use a modern, actively maintained server runtime with strong TypeScript support.
- (R-012) Provide a transactional relational datastore supporting vector similarity search (initially Postgres + pgvector).
- (R-013) Support alternative specialized vector index backends via a pluggable interface (e.g., Qdrant) selected by configuration.
- (R-014) Provide an in-memory store / queue for background job orchestration.
- (R-015) Support local LLM inference & embeddings (privacy-first) with option to substitute external providers later.
- (R-016) Employ a type-safe data access layer / ORM.
- (R-017) All external input validation centralized in a shared schema/contracts layer.
- (R-018) Provide automated test framework covering unit, integration (with ephemeral infra), and E2E flows.
- (R-019) Structured logging with optional distributed tracing instrumentation.

## 4. Modular Architecture & Packaging

- (R-020) System organized into deployable apps and reusable packages with clear public surfaces.
- (R-021) Internal module boundaries enforced to prevent leaking non-public implementation details (no deep import reliance).
- (R-022) Build pipeline must support incremental / affected rebuilds to optimize CI.
- (R-023) Strict type safety configuration is mandatory (cannot be relaxed without approval).
- (R-024) Contracts-first development: all external interfaces derive from shared schemas.

## 5. (Moved) Development Standards

The detailed coding and validation standards (now enumerated as DS-001 through DS-017, previously R-050 through R-060 and R-070 through R-082) are normative but relocated to Appendix A: Development Standards to reduce noise in core product requirements. Historical R-series IDs are deprecated; DS-series mapping preserves traceability.

## 6. Validation & Schema Strategy

- (R-025) Shared schema layer defines environment, API, and data boundary contracts.
- (R-026) All inbound requests validated before business logic executes.
- (R-027) Internal code reuses inferred types—no manual duplication.

## 7. Error Handling

- (R-028) Single standardized error shape used across services.
- (R-029) Errors logged with contextual metadata (requestId, gameId, user role where relevant).
- (R-030) Distinct error codes enumerated in contract; codes are stable and versioned.

## 8. Authentication & Authorization

- (R-031) Session-based authentication with secure token referencing server-side session state.
- (R-032) GM vs Player roles enforced on endpoint access and entity operations.
- (R-033) Per-game and per-instance authorization applied to all CRUD operations (deny-by-default principle).
- (R-034) Authentication subsystem shall be extensible to support additional providers (e.g., OAuth/SSO) without refactoring core domain logic.
- (R-035) Auth events (login, logout, permission changes) shall be auditable via structured log events.

## 9. Data & Persistence

- (R-036) System maintains canonical entities, version snapshots, instance entities, and content/attribute vectors.
- (R-037) Flexible structured fields support overrides while enabling indexed queries.
- (R-038) Primary vector search may reside in relational store until scale warrants specialized backend.
- (R-039) Outbox pattern ensures reliable propagation to secondary vector stores.
- (R-040) Canon objects and versions can be exported/imported as structured JSON (with schema version) for modding & version control workflows.

## 10. Retrieval / RAG

- (R-041) A single retrieval interface abstracts backend differences.
- (R-042) Field-aware retrieval order: instance-first attributes, then canonical text fallback.
- (R-043) Embedding model pluggable; baseline uses local model to avoid external PII exposure.
- (R-044) Prompt assembly integrates retrieved context deterministically.
- (R-045) Retrieval supports field-level filtering and scoping (e.g., restrict by attribute path or owner type).

## 11. Jobs & Asynchronous Processing

- (R-046) System supports asynchronous ingestion, re-embedding, synchronization, and upstream application tasks.
- (R-047) A dedicated worker deployment processes background jobs independently of interactive traffic.
- (R-048) Re-embedding triggered on relevant content or schema changes.
- (R-049) Outbox-driven sync ensures at-least-once propagation to secondary vector stores (idempotent processors required).
- (R-050) Job framework must allow horizontal scaling and job retry with exponential backoff.

## 12. Streaming & Realtime

- (R-051) A streaming transport (SSE, WebSocket, or equivalent) delivers incremental chat tokens.
- (R-052) Retrieval/meta events can interleave with token stream for progressive UI updates.
- (R-053) Client state layer handles ordered, incremental assembly of streamed content.
- (R-054) First token delivery target: <1s from request acceptance under nominal load.

## 13. Vector Store Strategy & Scalability

Performance Targets (PT):

- (PT-140) Maintain retrieval latency p95 ≤250 ms while corpus <10M chunks on baseline backend.
- (PT-141) Introduce specialized vector backend when corpus scale or latency budget exceeded.
- (R-055) Vector backend selection controlled via configuration without consumer code changes.
- (R-056) Dual-read mode logs variance metrics prior to cutover to new backend.

## 14. Normalization & Canonical Data

- (R-057) Entity submissions normalized deterministically (regex rules) to extract attribute facts (e.g., `eyes.color(blue)`).
- (R-058) Optional LLM fallback augmentation for ambiguous extractions (feature-flag controlled).
- (R-059) Restricted metadata marks GM-only data excluded from player prompts.
- (R-060) Canon version linkage preserved for diff & merge.
- (R-061) Normalization is transparent: original user input remains viewable/editable.
- (R-062) Users (GM) can manually override or correct normalized attribute atoms.

## 15. Logging & Observability

- (R-063) All request logs include correlation identifiers (e.g., requestId) and contextual entity/game IDs.
- (R-064) Tracing spans instrument retrieval and generation segments (optional sampling).
- (R-065) Restricted attributes masked/redacted in logs.
- (R-066) Logs are structured (JSON) and exportable to external aggregation systems.
- (R-067) PII and sensitive GM-only data must never appear in logs (enforced via redaction policy tests).

## 16. Frontend Requirements

- (R-068) UI is role-aware: GM vs Player experiences adapt capabilities and data visibility.
- (R-069) Forms & inputs validated against shared schemas before submission acceptance.
- (R-070) Chat view updates incrementally as tokens stream and displays retrieval context.
- (R-071) Entity editor surfaces normalized attributes with ability to override corrections.
- (R-072) Errors and loading states presented consistently with non-blocking feedback mechanisms.
- (R-073) Feature organization promotes discoverability (modular, domain-focused grouping).
- (R-074) Accessibility: core flows (navigation, chat, entity editing) meet WCAG 2.1 AA for keyboard & screen reader support.
- (R-075) Internationalization readiness: text surfaced through a translation layer (English baseline).
- (R-076) Documentation links/guides accessible in-app for new GM onboarding.

## 17. Security & Access Controls

- (R-077) GM-restricted fields excluded from player prompt assembly automatically.
- (R-078) Environment variables validated at startup; invalid config aborts boot.
- (R-079) Shared error codes support rate limiting & abuse signaling.
- (R-080) Chat and generation endpoints enforce per-user quota / rate limits to prevent abuse.
- (R-081) Data residency/privacy constraints documented; architecture supports local inference to avoid external data egress.

## 18. Testing Strategy

- (R-082) Unit tests for pure functions in each package.
- (R-083) Integration tests provision ephemeral datastore & cache.
- (R-084) Retrieval tests assert ranking determinism & latency budgets.
- (R-085) Schema evolution tests ensure backward compatibility for canonical versioning.
- (R-086) End-to-end tests cover main game flow: create entity → chat → modify entity → retrieval context update.
- (R-087) Property/fuzz tests validate normalization robustness against malformed/edge inputs.

## 19. Performance & Reliability

- (R-088) Retrieval latency meets performance target PT-140 baseline.
- (R-089) Streaming transport delivers first token ≤1s (R-054) under nominal load.
- (R-090) Outbox processing guarantees eventual consistency with retry & idempotency.
- (R-091) Re-embedding throughput scales horizontally via worker concurrency.
- (R-092) Service availability target: ≥99.9% monthly uptime for core chat & retrieval endpoints.
- (R-093) Session storage layer supports horizontal scaling / HA (e.g., Redis clustering or failover) without session loss.

## 20. Deployment & Configuration

- (R-094) Runtime configuration loaded via validated environment variables (12-factor compliant; no secrets in code).
- (R-095) Feature flags govern vector backend selection & normalization LLM fallback.
- (R-096) System deliverable as container images, suitable for orchestration platforms.
- (R-097) Configuration changes (flags, env) observable at runtime through diagnostics endpoint (non-secret subset).

## 21. Non-Functional Requirements

- (R-098) Maintainability: strict linting & formatting gate merges.
- (R-099) Observability: structured logs, trace propagation across service boundaries.
- (R-100) Scalability: independent horizontal scaling of web and worker tiers with connection pool tuning.
- (R-101) Security: GM-only attributes never serialized to unauthorized clients (test coverage required).
- (R-102) Accessibility: core UI flows conform to WCAG 2.1 AA.
- (R-103) Internationalization readiness: text externalized for translation.
- (R-104) Documentation: developer API reference & GM user guide maintained and versioned.

## 22. Constraints

- (R-105) No reliance on non-public internal module paths (enforced via tooling).
- (R-106) Default LLM/embedding execution remains local unless explicit opt-in to hosted providers (privacy control).
- (R-107) Strict TypeScript configuration flags must remain enabled.

## 23. Risks & Mitigations

| Risk                                  | Impact                   | Mitigation                                                       |
| ------------------------------------- | ------------------------ | ---------------------------------------------------------------- |
| Vector latency growth                 | Slower prompts           | Migration plan & dual-read validation (PT-140, R-056)            |
| Schema drift                          | Data inconsistency       | Versioned canon objects + evolution tests (R-085)                |
| Unauthorized data leakage             | Privacy breach           | Restricted metadata filtering & redaction (R-059, R-067, R-077)  |
| Dual-read divergence                  | Incorrect retrieval      | Variance logging & alerting prior to cutover (R-056)             |
| LLM hallucination (normalization)     | Data corruption          | Deterministic regex first, manual overrides (R-057, R-062)       |
| LLM model drift / quality changes     | Degraded output          | Pin model versions, regression prompt tests, periodic eval suite |
| Token cost escalation (if hosted LLM) | Increased operating cost | Favor local inference; cost monitoring & fallback models         |

## 24. Open Questions / TBD

- (OQ-01) Specific rate-limiting algorithm & quotas.
- (OQ-02) Exact diff/merge conflict resolution strategy for `GameEntity` beyond version linkage.
- (OQ-03) Cache invalidation policy for retrieval context caches.
- (OQ-04) Observability stack (collector deployment, trace sampling %).
- (OQ-05) Multi-player concurrent session conflict resolution & merge semantics.
- (OQ-06) Git-based editing workflow for canon files vs UI-only editing.
- (OQ-07) Offline / desktop mode requirements & packaging.

## 25. Definition of Done (DoD)

Each change must:

1. Pass lint & type checks (R-098, R-107).
2. Include or update schemas for new/changed external interfaces (R-025..R-027).
3. Provide/extend tests (unit + integration + E2E where impacted) (R-082..R-087).
4. Maintain performance & availability targets (PT-140, R-088..R-093) or include variance tracking issue.
5. Document new env vars / feature flags (R-094..R-095, R-097) in config & docs.
6. Avoid introduction of `any` / non-null assertions (DS-002..DS-003).
7. Ensure authorization & restricted data handling maintained (R-077, R-067, R-101).
8. Include user-facing acceptance note when relevant (e.g., “GM can export canon object as JSON”).

## 26. Traceability Matrix (Excerpt)

| Requirement   | Origin Note                         |
| ------------- | ----------------------------------- |
| DS-001..DS-011 | Development standards (Appendix A) |
| R-041..R-045  | Retrieval / RAG section             |
| PT-140..R-056 | Vector store strategy section       |
| R-057..R-062  | Normalization & override section    |
| R-077..R-081  | Security / provenance section       |
| R-098..R-104  | Non-functional & quality attributes |

## 27. Glossary

- Canon Object: Source canonical entity definition independent of in-game instance state.
- Canon Version: Versioned snapshot enabling lineage/diff.
- AttrAtom: Extracted attribute fact with optional restriction metadata and vector embedding.
- TextChunk: Chunked canonical or instance text content for retrieval.
- Dual Read: Transitional state querying both pgvector and an alternative backend.
- Normalization: Deterministic + optional AI-assisted transformation of free-form input into structured facts.
- Retriever: Interface abstraction for similarity search backend.

## Appendix A: Development Standards (Summary Reference)

Development standards use DS-* identifiers to avoid collision with sequential requirement numbering.

- (DS-001) Explicit return types required for exported APIs.
- (DS-002) `any` disallowed; prefer `unknown` + narrowing.
- (DS-003) Non-null assertions forbidden; enforce via guards.
- (DS-004) Prefer type aliases & discriminated unions for domain modeling.
- (DS-005) Explicit optionality; no implicit undefined semantics.
- (DS-006) Boundary validation via shared schemas.
- (DS-007) Prefer immutability for data structures.
- (DS-008) Exhaustive switches with `never` check.
- (DS-009) No ambient globals; explicit imports.
- (DS-010) Favor pure functions; isolate side effects.
- (DS-011) Fallible operations use Result or boundary-managed errors.
- (DS-012) Central schema repository for all external interfaces.
- (DS-013) Validate all inbound request shapes.
- (DS-014) Use inferred types internally.
- (DS-015) Standard error shape across services.
- (DS-016) Error logging with contextual metadata.
- (DS-017) Stable enumerated error codes.

---

End of baseline requirements. Future revisions should append change log with semantic versioning of requirements document.
