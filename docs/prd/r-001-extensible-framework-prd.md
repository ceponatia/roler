# PRD: R-001 Extensible Framework

Requirement ID: R-001
Source: requirements.md Section 2
Status: Accepted
Owner: PRODUCT
Last Updated: 2025-09-29

## Summary

Deliver a pluggable, type-safe extension framework that lets authors augment normalization, retrieval, validation, and the chat gameplay loop (conversation phases) with deterministic ordering, strict capability & data scope controls, and operational guardrails (budgets, concurrency, kill‑switch) while keeping core upgradeable without forks.

## Problem / Opportunity

Current core-only implementations block rapid feature experimentation (house rules, narrative adaptations, dynamic memory). Forking or patching core introduces divergence and upgrade friction. We need a governed extension surface covering both entity lifecycle and conversational game loop so creators and GMs can add mechanics (relationship scoring, scene tagging, compliance checks) safely, with predictable performance and rollback controls.

## Goals

- Core extensibility across entities (normalization, retrieval enrichment, pre-save validation)
- Chat-aware hook phases (preChatTurn, postModelDraft, postModeration, prePersistTurn)
- Manifest-declared per-hook token + latency budgets with enforcement & metrics
- State transaction mechanism for composable, conflict-resolvable game state changes
- Tenant / session / role (GM | Player) context injected into every hook
- Capability & data class scope model (e.g., `attr:private`, `memory:l2-graph`, `rag:external-source`)
- Operational guardrails: concurrency limit per extension, kill-switch, per-hook p95 targets
- ≥3 documented reference extensions (relationship-score-normalizer, scene-retrieval-tags, pre-save-age-check)
- Semantic versioned public API with deprecation policy

## Non-Goals

- Extension marketplace / distribution channel
- Paid monetization or billing integration
- Untrusted code sandboxing (Phase 1 assumes trusted code)
- Hot reload of extensions at runtime

## User Stories

1. As a developer, I add a new normalization rule via an extension without touching core packages.
2. As a GM, I enable a relationship-score extension to adjust NPC affinity after each moderated chat turn.
3. As a plugin author, I define per-hook token budgets so my augmentation does not exceed latency targets.
4. As an operator, I can disable (kill-switch) a misbehaving extension instantly without redeploy.
5. As a security reviewer, I can inspect declared data class scopes to ensure no unauthorized sensitive access.
6. As a system maintainer, I can observe per-hook p95 latency and budget overruns per extension.
7. As a developer, I publish state transaction operations (increment relationship.X) and rely on deterministic conflict resolution.
8. As a GM, I retain upstream framework updates while my custom extensions continue to function (no fork drift).

## Functional Scope

- Extension registry (discovery, validation, deterministic ordering)
- Manifest schema including: capabilities, data class scopes, chat hook declarations, budgets, concurrency limit, kill-switch flag
- Hook execution engine for: normalization, retrievalEnrichment, preSaveValidate, preChatTurn, postModelDraft, postModeration, prePersistTurn
- State transaction contract (operations, policies: first-wins, last-wins, weighted, resolver placeholder)
- Per-hook token & latency budget enforcement + metrics
- Capability & data class scope access checks (deny & log if not granted)
- Reference extensions (3) showcasing core patterns

## Out of Scope

- Marketplace publishing UX
- Remote download / signature verification of third-party bundles
- Sandboxed isolation (WASM/VM)
- Real-time hot swapping of loaded extensions

## Acceptance Criteria

- GIVEN a valid extension manifest WHEN the system boots THEN it appears in the registry with ordered priority.
- GIVEN an extension declaring an unsupported core API range WHEN loading THEN load fails with `EXT_VERSION_INCOMPATIBLE` and no partial activation.
- GIVEN peer dependency requirement missing WHEN loading THEN error `EXT_PEER_UNRESOLVED` is emitted and extension excluded.
- GIVEN an extension with chat-phase hooks WHEN a chat turn occurs THEN those hooks execute in order: preChatTurn → postModelDraft → postModeration → prePersistTurn.
- GIVEN state transactions from multiple extensions touching same path with first-wins policy THEN only the first mutation persists.
- GIVEN token budget exceeded in postModelDraft THEN added content is truncated and metric `budget_overrun_total{type=token}` increments.
- GIVEN latency budget exceeded in preChatTurn THEN a timeout warning is logged and execution proceeds (non-fatal) unless strict mode enabled.
- GIVEN kill-switch toggled for an extension THEN all subsequent hook invocations are skipped with `disabled_invocations_total` metric incremented.
- GIVEN data class scope not granted BUT requested THEN extension loads with that scope stripped and warning recorded.
- GIVEN three reference extensions installed THEN all load successfully and are listed via registry API.
- Overall overhead of all enabled extensions combined remains <5% added p95 vs baseline benchmark.

## Metrics / KPIs

- Reference extensions count: ≥3 (GA)
- Median time to implement a new simple extension: <2 engineer hours
- Extension overhead p95: <5% (warn at ≥5%, fail at >7%)
- Per-hook latency targets: normalization 50ms, retrievalEnrichment 30ms, preSaveValidate 40ms, preChatTurn 40ms, postModelDraft 25ms, postModeration 20ms, prePersistTurn 30ms
- Budget overrun rate (token/latency): <2% of total invocations per hook type
- Zero critical security incidents from unauthorized data scope access in first 90 days

## Risks & Mitigations

- Risk: Extension conflicts on same attribute → Mitigation: deterministic priority + conflict policy logging.
- Risk: Performance regressions → Mitigation: per-hook timing histograms + CI benchmark gate.
- Risk: Capability creep / privilege escalation → Mitigation: explicit scope declaration + operator allowlist.
- Risk: Unbounded token growth in augmentation → Mitigation: manifest token budgets + truncation.
- Risk: Runaway concurrent executions → Mitigation: per-extension concurrency limit queue.
- Risk: Difficult rollback of misbehaving extension → Mitigation: kill-switch flag + feature flag global disable.

## Dependencies

- Contracts / schemas package for Zod manifest + context types
- R-004 Boundary Safety (validation enforcement)
- R-009 Transparent Normalization (shared normalization model)
- R-002 Low Latency Retrieval (retrieval context pipeline integration)

## Security / Privacy Considerations

- Data class scopes gate access to sensitive attributes (e.g., `attr:private`).
- Role (GM | Player) & tenantId passed in every hook to prevent cross-tenant access leakage.
- Unsafe capabilities require explicit allowlist approval at deploy time.
- Extension errors must not leak raw PII or hidden GM data in logs (redaction layer reused).

## Performance Considerations

- Aggregate overhead <5% p95 vs baseline.
- Per-hook p95 targets enumerated (see Metrics / KPIs) and enforced via monitoring alerts.
- Token budgets limit added prompt tokens per hook to reduce latency cost curve.

## Accessibility & UX Notes

- Author documentation must provide clear manifest field descriptions and example code snippets; not user-facing UI scope in this release.

## Operational Considerations

- Feature flag: `EXTENSIONS_ENABLED` gating entire subsystem.
- Kill-switch toggle per extension (dynamic in-memory + persisted config optional).
- Concurrency limit configurable per extension (default 4) to prevent saturation.
- Metrics dashboards: latency histogram, error counts, budget overruns, disabled invocations.
- Alert thresholds: >7% overhead, >5% budget overrun rate, sustained hook timeout spike.

## Open Questions

- OQ-1 Should we enforce hard failure on repeated token budget overruns (>N occurrences)?
- OQ-2 What is minimum data retained for auditing state transactions (full ops vs summarized hash)?
- OQ-3 Resolver conflict policy timeline (include in initial GA or defer)?
- OQ-4 Formal resource limits (memory heap ceilings) in manifest future field?

## Alternatives Considered

- Hard-coded extension points only — Rejected: insufficient flexibility for emergent game mechanics.
- Dynamic `eval` script loading — Rejected: security & observability risks.
- Per-hook event bus (pub/sub) instead of ordered pipeline — Rejected: nondeterministic ordering complicates conflict resolution.

## Definition of Done

- All Acceptance Criteria satisfied
- Three reference extensions implemented & documented
- Performance benchmark script reports <5% overhead
- Per-hook metrics, budget, and concurrency instrumentation integrated
- API docs & authoring guide published
- Tests: unit (schemas, loader, ordering) + integration (pipeline execution) + conflict & budget edge cases
- No TODO/FIXME or placeholder values; manifest schemas versioned
- Security review completed (capabilities & scopes) and logging redaction verified

## Appendix (Optional)

- Example manifest snippet with budgets & chat hooks
- State transaction operation example table

---
Template Usage: Based on standard PRD template; sections adapted for extension-specific requirements.
