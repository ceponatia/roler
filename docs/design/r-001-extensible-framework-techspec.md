---
title: R-001 Extensible Framework Technical Specification
status: Draft
last-updated: 2025-09-05
related-prd: ../prd/r-001-extensible-framework-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Provide a pluggable extension subsystem enabling third-party or first-party “extensions” (aka plugins) to augment: (a) entity normalization, (b) retrieval context enrichment, (c) pre-save validation / mutation, (d) attribute processors, without modifying core packages. Design must preserve: type safety (Zod-first), deterministic order, isolation boundaries, semver-governed public API surface, and <5% performance overhead.

In-Scope:

- Extension manifest format + validation schema.
- Registry load order, version / capability negotiation, collision detection.
- Hook lifecycle and execution contracts (normalization, retrieval enrichment, pre-save validation, optional init & shutdown).
- Namespacing & attribute processor resolution.
- Public API boundary for extension authors (stable façade exposed via `@roler/extensions` package).
- Metrics & safe failure behavior (graceful degradation if extension fails).

Out-of-Scope (this spec):

- Remote marketplace distribution, sandboxing untrusted code, billing.
- Hot unload / reload at runtime (initial focus: load-on-start).

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Extension registry | `ExtensionRegistry` + manifest scanning | Deterministic ordered load |
| Version compatibility checks | Semver range validation (core API & peer ext deps) | Hard fail with structured error |
| Hook points (normalization, retrieval, pre-save validation) | Hook interfaces & pipeline orchestrators | Run in defined phases |
| Public API surface documented | `@roler/extensions` stable entrypoint + MD docs | Versioned via semver |
| Sample extension loads | Reference extensions in `examples/extensions/*` + tests | <2h implementation time target |
| Incompatible version rejection | Early bootstrap guard | Error code: `EXT_VERSION_INCOMPATIBLE` |
| Attribute enrichment flows into retrieval | Retrieval enrichment hook aggregates contexts | Weighted merge ordering |
| Performance overhead <5% | Benchmark harness + metrics instrumentation | Abort (warn) if over budget |
| Chat-phase hooks (preChatTurn → postModelDraft → postModeration → prePersistTurn) | Chat hook interfaces & ordered pipeline (Sections 5, 15) | Deterministic ordering, each phase optional |
| State transaction support & conflict policies | StateTransaction schema + merge engine (Sections 5, 15) | first-wins / last-wins / weighted / resolver placeholder |
| Per-hook token & latency budgets | hookBudgets manifest + enforcement (Sections 4, 5) | Soft budgets + truncation + metrics |
| Data class scope gating & logging | dataClassScopes manifest + security filter (Section 11) | Strip & log unauthorized scopes |
| Per-extension concurrency limiting | concurrencyLimit manifest + limiter (Section 5) | Prevent saturation (default 4) |
| Kill-switch operational control | killSwitchEnabled + runtime flag (Sections 5, 12) | Fast disable with metric increment |
| Overhead gating (<5% pass, 5–7% warn, >7% fail) | Benchmark harness + CI gate (Section 12) | Enforces performance acceptance criterion |

## 3. High-Level Architecture

Components:

1. Manifest Files: Each extension exports a manifest object (runtime validated) describing metadata, semver, capabilities, peer requirements, declared hooks.
2. Loader: Discovers installed extension packages (heuristic: packages whose `package.json` contains `"rolerExtension": { ... }` key OR explicit allowlist via config). Loads ESM entrypoint.
3. Registry: Normalized, validated collection of `RegisteredExtension` objects with deterministic ordering & conflict detection.
4. Hook Pipelines:
   - Normalization Pipeline: Runs attribute processors & normalizers before persisting canonical / instance changes.
   - Retrieval Enrichment Pipeline: Extends retrieval context objects (e.g., adds derived facts) before RAG assembly.
   - Pre-Save Validation Pipeline: Guards final entity state with read-only cross-extension introspection.
   - Optional Lifecycle: `onInit`, `onShutdown` (for caching, warmup, metrics).
5. API Façade: Narrow stable TypeScript interfaces re-exported for extension authors (no leaking internal package internals).
6. Error & Metrics Layer: Standard error shape; per-hook timing + error counters aggregated.

## 4. Data & Schema Design (Zod-First)

New schemas (to be added in `@roler/schemas` under `system/extensions` path):

- ExtensionManifestSchema
  - id (string, ULID or reverse-DNS safe slug, lower-kebab, validated pattern)
  - name (string)
  - version (semver string)
  - description (string)
  - license (string | optional)
  - author (string | optional)
  - coreApiRange (semver range satisfied by host core API version)
  - peerExtensions: readonly array of `{ id: string; range: string }`
  - capabilities: readonly array of string (namespaced: `attr:`, `normalize:`, `retrieve:` etc.)
  - hooks: object with optional arrays (normalize, retrievalEnrichment, preSaveValidate) listing exported hook identifiers OR boolean flags if using convention export names.
  - priority (integer, default 0; higher runs earlier) – ties broken by `id` lexical order.
  - unsafeCapabilities?: readonly array (GM gated; must declare) – validated against allowlist.
  - configSchema?: JSON schema reference name (points to a Zod schema in extension bundle) for structured per-extension config.
  - chatHooks?: { preChatTurn?: string[]; postModelDraft?: string[]; postModeration?: string[]; prePersistTurn?: string[] } (optional explicit export names; falls back to convention if omitted)
  - hookBudgets?: { [hookName: string]: { maxTokens?: number; maxLatencyMs?: number } } (per-hook soft budgets; enforced + metered)
  - concurrencyLimit?: number (max simultaneous hook executions for this extension; default 4)
  - killSwitchEnabled?: boolean (default true; host can disable extension rapidly)
  - dataClassScopes?: readonly string[] (declared sensitive data classes requested; host must allow) (e.g. `attr:private`, `memory:l2-graph`, `rag:external-source`)
  - stateTransactionSupport?: boolean (declares that certain hooks return state transactions instead of direct deltas)

Additional Manifest Notes:

- Budgets are advisory; overruns trigger warnings & optional enforcement (configurable) before hard timeout.
- Data class scopes augment `unsafeCapabilities`; granting requires operator policy alignment.
- Concurrency limit prevents a single extension saturating event loop under bursty chat phases.

Supporting internal schema(s):

- ExtensionRegistrationConfigSchema: Host-level config enumerating enabled extensions, explicit order overrides, capability allowlist, and fail-open toggles.

All external boundaries parse with Zod; types derived via `z.infer`. No `any`; brand IDs where applicable.

## 5. Hook Interface Contracts

All hook functions return a Result-like object (success | error) OR throw only unrecoverable programmer errors. Prefer:
`type HookResult<T> = { ok: true; value: T; meta?: Record<string, unknown> } | { ok: false; error: ExtensionError }`

Phases:

1. Normalization: `(input: NormalizationContext) -> HookResult<Partial<NormalizedEntityDelta>>`
2. Retrieval Enrichment: `(ctx: RetrievalContext) -> HookResult<RetrievalAugmentation>`
3. Pre-Save Validation: `(candidate: EntityStateSnapshot) -> HookResult<void>` (no mutation).

Chat-Aware Conversation Phases (added for RPG game loop):
4. preChatTurn: `(ctx: ChatTurnContext) -> HookResult<ChatTurnPreparation>` executed before model prompt assembly (inject additional RAG snippets, adjust tone directives, enforce house rules preliminarily).
5. postModelDraft: `(ctx: ModelDraftContext) -> HookResult<ModelDraftAdjustment>` executed immediately after raw model draft tokens arrive (before moderation). May trim, tag, or suggest rewrites (bounded by token budget).
6. postModeration: `(ctx: ModerationContext) -> HookResult<ModeratedAdjustment>` after safety filters pass; can annotate with metadata (relationship deltas, XP accrual suggestions).
7. prePersistTurn: `(ctx: PersistContext) -> HookResult<StateTransaction | void>` just before persisting chat turn + derived memory; final chance to attach state transaction proposals.

Unified Context Requirements:
`BaseHookContext = { tenantId: string; sessionId: string; role: 'GM' | 'Player'; timeBudgetMs?: number; tokenBudget?: number; requestId: string }` present in every hook context (existing normalization/retrieval contexts extended to include these properties) ensuring consistent authorization & telemetry dimensions.

State Transactions:
Extensions MAY return a `StateTransaction` object instead of or in addition to direct deltas in chat-phase & normalization hooks if `stateTransactionSupport` is true.
`StateTransaction = { txId: string; originExtension: string; operations: readonly TxOp[]; conflictPolicy: 'first-wins' | 'last-wins' | 'weighted' | 'resolver'; weight?: number; resolverId?: string; metadata?: Record<string, unknown> }`
`TxOp = { path: string; op: 'set' | 'increment' | 'append'; value?: unknown; delta?: number }`
Merge Strategy:

- Gather transactions in a deterministic order (priority DESC, weight DESC where applicable, then extension id ASC).
- Apply conflictPolicy rules:
      - first-wins: first op on a path wins; later conflicting ops skipped.
      - last-wins: later op overwrites earlier on same path.
      - weighted: choose op with highest `weight` for conflicting path; ties resolved by priority then id.
      - resolver: delegate conflicting path set to a named resolver hook (future extension; placeholder). If resolver missing → warning + fallback to first-wins.
- Produce consolidated idempotent delta (operations reduced: e.g., consecutive increments combined) before persistence.

Budgets Enforcement:

- Each context derives effective `timeBudgetMs` & `tokenBudget` from manifest hookBudgets + host defaults.
- Exceeding tokenBudget results in truncation of added content & warning metric (does not hard fail unless strict flag).
- Exceeding timeBudget triggers soft timeout logic earlier than generic per-hook limits.

Ordering:

- Extensions sorted by priority DESC then id ASC.
- Within an extension, hooks executed in declared array order; absence implies skip.

Timeouts & Guards:

- Per-hook soft timeout (default 50ms normalization, 30ms retrieval enrichment, 40ms validation); exceed → warn + continue unless `strictMode` enabled.
- Circuit breaker: 3 consecutive failures → skip extension for remainder of request; metrics increment.

Concurrency:

- Per-extension concurrency capped (default 4 or manifest override) across asynchronous hook executions; additional invocations queue (FIFO) to avoid CPU spikes.

Kill-Switch:

- Host config may mark an extension disabled at runtime (in-memory flag) → all subsequent hook invocations short-circuit with noop & a metric increment (`disabled_invocations_total`).

## 6. Registration & Loading Flow

1. Discover candidate packages (workspace scanning or config allowlist).
2. Read each `package.json` for `rolerExtension` key → path to manifest export (default `dist/extension.js`).
3. Dynamic import ESM entrypoint (Node 20, ESM only).
4. Validate exported manifest via `ExtensionManifestSchema`.
5. Version compatibility checks:
   - Core: `satisfies(coreApiVersion, manifest.coreApiRange)`.
   - Peers: For each peer requirement, ensure loaded extension version satisfies; if missing, error code `EXT_PEER_UNRESOLVED`.
6. Collision detection:
   - Duplicate id → fail.
   - Capability collisions where exclusivity declared (future: exclusive capabilities list) → fail.
7. Assemble `RegisteredExtension` objects (freeze for immutability).
8. Emit registry ready event (observable for diagnostics / tests).

## 7. Versioning & Stability Model

- Core publishes an `extensionsApiVersion` (semver). Breaking changes only on major bump.
- Deprecations: Mark interface members with JSDoc `@deprecated` + maintain for ≥1 minor before removal.
- Capability Flags: New capabilities behind additive flags; extensions declare only those they use.

## 8. Public API Surface (Initial)

Exposed via new package `packages/extensions`:

- `loadExtensions(config: ExtensionRegistrationConfig): Promise<ExtensionRegistry>`
- Type exports: `ExtensionManifest`, `NormalizationHook`, `RetrievalEnrichmentHook`, `PreSaveValidationHook`, `HookResult`, `ExtensionError`, `RegisteredExtension`.
- Utility: `createExtension(manifest: ExtensionManifest, hooks: HookBundle)` (validates at build-time using Zod + types).
- Minimal logger interface (subset of core logger) to avoid leaking full internals.

Additional Exports (chat & transactions):

- Types: `PreChatTurnHook`, `PostModelDraftHook`, `PostModerationHook`, `PrePersistTurnHook`, `StateTransaction`, `TxOp`, `ChatTurnContext`, `ModelDraftContext`, `ModerationContext`, `PersistContext`.
- Helper: `composeStateTransactions(...txs: StateTransaction[]): StateTransaction` (utility for extensions delegating to sub-modules).

Forbidden: Direct imports from internal game/entity modules; extension authors must rely only on types & helpers surfaced by `@roler/extensions` and `@roler/schemas`.

## 9. Error Handling & Codes

Extend existing standardized error shape (see R-028/R-029) with domain `extension` and codes:

- `EXT_VERSION_INCOMPATIBLE`
- `EXT_PEER_UNRESOLVED`
- `EXT_DUPLICATE_ID`
- `EXT_HOOK_TIMEOUT`
- `EXT_HOOK_FAILURE`
- `EXT_UNSAFE_CAPABILITY_DENIED`
- `EXT_CONFIG_INVALID`
- `EXT_TOKEN_BUDGET_EXCEEDED`
- `EXT_TIME_BUDGET_EXCEEDED`
- `EXT_STATE_TX_CONFLICT` (unexpected unresolved conflict after merge phase)

All errors carry: `code`, `message`, `extensionId?`, `hook?`, `causes?` (array), `severity` (warn|error|fatal). Logged through shared logger with request / correlation IDs.

## 10. Security & Capability Model

- Extension manifest `unsafeCapabilities` gated by deploy-time allowlist (e.g., `gm:restricted-data`). If not permitted, registry rejects with `EXT_UNSAFE_CAPABILITY_DENIED`.
- Read-only entity snapshots for validation; mutation only via explicit normalization delta path.
- No direct DB handle; provide narrow service proxies (e.g., `vectorSearch(query)`) that enforce auth context.
- Isolation: Single process for now; future sandbox adapter interface left open.

Data Class Scopes (granular capabilities, must be explicitly declared & allowed):

- `attr:private` (private / sensitive attribute subsets)
- `memory:l2-graph` (second-level associative memory graph access)
- `rag:external-source` (ability to inject externally sourced context snippets)
- `chat:moderation-flags` (read moderation classification metadata)

Operators can globally deny any subset; denied scopes removed from manifest at registry build with warning.

## 11. Performance Considerations

Targets: <5% added p95 for a typical request hitting all three pipelines.
Strategies:

- Pre-resolve hook arrays (no dynamic lookups per invocation).
- Micro-batching normalization deltas: merge partial outputs incrementally.
- Short-circuit if all extensions return empty delta.
- Collect high-resolution timing (hrtime) per hook; aggregate metrics (histograms) exposed to observability.

Benchmark Harness (new script):

- Simulate N entities normalization with M extensions; output latency distribution & overhead percentage.
- Threshold gate in CI: warn if overhead >5%, fail if >7%.

Per-Hook p95 Targets (Advisory):

| Hook | p95 Target (ms) | Notes |
|------|-----------------|-------|
| normalization | 50 | existing default |
| retrievalEnrichment | 30 | before RAG assembly |
| preSaveValidate | 40 | must be fast; no blocking I/O |
| preChatTurn | 40 | before prompt build; includes small RAG adds |
| postModelDraft | 25 | token buffer pruning/annotation only |
| postModeration | 20 | metadata tagging, light adjustments |
| prePersistTurn | 30 | state transaction consolidation |

Budget Relationship: timeBudgetMs per hook MUST be ≤ these targets; CI can assert configuration.

## 12. Observability & Metrics

Per extension + hook:

- `invocations_total`
- `errors_total{code}`
- `timeouts_total`
- `duration_ms_histogram`
- `circuit_open` gauge
- `token_usage_total{hook}` (tokens added / suggested by extension within budget)
- `budget_overrun_total{hook,type=token|time}`
- `state_transactions_total{result=applied|skipped|conflicted}`
- `disabled_invocations_total`

Registry metrics:

- `extensions_loaded_total`
- `extensions_failed_total`

Emit structured events (`extension.hook.start`, `extension.hook.end`) for trace correlation.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Hook timeout (soft) | Record warning, mark `timeout`, continue | Non-fatal |
| Hook throws | Catch → record `EXT_HOOK_FAILURE`, continue (unless strict) | Resilience |
| Manifest invalid | Abort startup (fail fast) | Safety |
| Version mismatch | Abort startup | Prevent undefined behavior |
| Peer unresolved | Abort startup | Contract integrity |
| Circuit open | Skip further hook runs, periodic half-open probe | Contain cascading failures |

Strict Mode (config): escalate certain soft failures to hard.

## 14. Implementation Plan (Step-by-Step)

1. Schemas: Add `ExtensionManifestSchema` & supporting types to `@roler/schemas` (system/extensions path) with tests.
2. New Package: `packages/extensions` scaffold (exports map, tsconfig, vitest config, README).
3. Core Version Constant: Add `extensionsApiVersion` constant exported from new package.
4. Registry Types: Implement internal types (`RegisteredExtension`, `HookBundle`, `HookResult`).
5. Manifest Validation Utility: `validateManifest()` using Zod parse + semantic validation (duplicates inside hooks, pattern checks).
6. Loader: Implement `discoverExtensions()` scanning workspace or provided config list.
7. Version & Peer Checks: Implement semver validation (add `semver` dependency pinned).
8. Registry Builder: Deterministic sort, collision detection, unsafe capability filtering.
9. Hook Execution Engine: Separate pipelines with shared execution helper measuring timing + enforcing deadlines (AbortController + Promise.race pattern).
10. Circuit Breaker: Track per (extensionId, hookType) failure counts with exponential backoff timestamp.
11. Metrics Adapter: Expose simple interface pluggable into existing logging / future telemetry.
12. Error Mapping: Extend contracts error codes list (schemas + central mapping).
13. Public API Façade: Curate exports; freeze objects to preserve immutability.
14. Reference Extensions: Create three minimal examples (e.g., `attr-color-normalizer`, `scene-retrieval-tags`, `pre-save-age-check`).
      - Add official game-focused reference extensions:
         - `relationship-score-normalizer` (updates relationship/bond metrics from dialogue events via postModeration)
         - `scene-retrieval-tags` (injects scene/location facts during preChatTurn retrieval augmentation)
         - `pre-save-age-check` (rules example using prePersistTurn + preSaveValidate)
15. Add chat-phase hook pipeline implementations (preChatTurn, postModelDraft, postModeration, prePersistTurn) and context propagation (tenantId/sessionId/role).
16. Implement state transaction merge engine (conflict policies, weighting, resolver placeholder) + tests.
17. Enforce per-hook budgets (token + latency) with instrumentation & truncation logic.
18. Add concurrency limiter + per-extension kill-switch handling.
19. Extend manifest schemas & validation for new fields (chatHooks, hookBudgets, dataClassScopes, concurrencyLimit, stateTransactionSupport).
20. Update metrics adapter with new counters/histograms.
21. Update authoring docs to include chat-phase hooks & state transactions.
22. Tests:
    - Manifest validation (positive/negative).
    - Version compatibility (matrix tests).
    - Peer dependency resolution ordering.
    - Hook ordering & priority tie-break.
    - Timeout & circuit breaker simulation.
    - Performance benchmark (smoke) ensuring overhead budget.
23. Bench Harness & CI Integration: Add script to run micro-bench (Node timing) gating thresholds.
24. Docs: Author `docs/extensions/authoring.md` and API reference summary.
25. Release: Add changesets for `schemas` & new `extensions` package publish.
26. Post-Launch Monitoring: Add dashboard queries for new metrics.

## 15. Testing Strategy

Test Layers:

- Unit (schemas, manifest parser, semver checks, sorter).
- Integration (load multiple mock extensions, run pipelines, assert merged outputs).
- Resilience (forced throw, timeout, circuit open/half-open logic).
- Performance (benchmark harness executed in CI with reduced iterations for speed + separate local larger run profile).
- Type Tests (compile-time generic constraints verifying HookResult shapes & immutability of inputs).
- Chat-phase ordering tests (ensuring postModelDraft runs before postModeration, etc.).
- State transaction conflict resolution matrix (first-wins / last-wins / weighted).
- Budget enforcement tests (token truncation & latency soft cut).
- Concurrency limiter test (queued execution) & kill-switch bypass test.

Coverage Goals: ≥95% lines for new package; snapshot tests for manifest structural outputs kept minimal (id, version, capabilities, hooks keys) to avoid churn.

## 16. Documentation Plan

Artifacts:

- Author Guide: Installation, manifest fields, hooks, best practices, examples.
- Capability Catalog: Enumerate stable capability identifiers & semantics.
- Versioning & Deprecation Policy doc.
- Performance Guidelines & optimization tips (batching, defensive checks).

## 17. Migration / Rollout

Phase 0 (Complete): Core scaffolding behind feature flag `EXTENSIONS_ENABLED=false`.

- Implemented core schemas (`ExtensionManifest`, `ExtensionRegistrationConfig`, `StateTransaction`).
- Implemented loader + registry (`@roler/extensions` load/discover + deterministic order, peer checks).
- Feature flag wiring added:
  - Env schema: `@roler/schemas/system/env/extensions-env.schema.ts` (Zod) parses `EXTENSIONS_ENABLED` (defaults false).
  - Guarded entrypoints: `@roler/extensions` exports `shouldEnableExtensions`, `loadExtensionsGuarded`, and `loadExtensionsFromConfigGuarded` which short-circuit to an empty registry when the flag is disabled.
  - Rollback is immediate: set `EXTENSIONS_ENABLED=false` and the registry returns empty pipelines.

Phase 1 (Complete): Enable flag in dev; integrate reference extensions.

- Dev enablement via `.env.example` (EXTENSIONS_ENABLED=true).
- Reference extensions added under `packages/`:
  - `relationship-score-normalizer` (postModeration chat hook; state transactions enabled)
  - `scene-retrieval-tags` (preChatTurn retrieval tagging)
  - `pre-save-age-check` (preSaveValidate + prePersistTurn rule example)

Phase 2 (Complete): Collect metrics & adjust timeouts.

- Metrics adapter added in `@roler/extensions`:
  - Public API exports `getMetricsSink`/`setMetricsSink` and `MetricsSink` interface with events: `onHookStart`, `onHookEnd`, `onHookError`, `onBudgetOverrun`.
  - Default sink is no-op; hosts can inject their telemetry implementation (Prometheus, OpenTelemetry, or app logger).
- Budgets & timeouts:
  - Default per-hook time budgets exported as `DefaultHookBudgets` with p95-aligned ms values.
  - `effectiveHookBudget(hookName, manifestBudgets?)` provides the merged budget (manifest override wins). These are advisory for now and will feed the runtime executor's soft timeout logic.
- Tests added for budgets merging and metrics sink set/get behavior.

Phase 3 (Complete): Public preview (publish docs) – compatibility window defined.

- Documentation published for extension authors:
  - `docs/extensions/authoring.md` explains manifest fields, package setup, chat hooks, budgets, and the feature flag.
  - Reference extensions documented by example: `relationship-score-normalizer`, `scene-retrieval-tags`, `pre-save-age-check`.
- Compatibility window for Public Preview:
  - API surface is considered preview-stable; no breaking changes without a major bump or explicit deprecation window.
  - Additive changes may occur; breaking changes (if unavoidable) will be guarded behind flags and documented with migration notes.
- Operator guidance:
  - Keep `EXTENSIONS_ENABLED` gated outside dev; enable per-environment after validating budgets and telemetry.
  - Use guarded loaders (`shouldEnableExtensions`, `loadExtensionsGuarded`) for safe rollback.

Phase 4 (Complete): GA – flag defaults to true; deprecation policy active.

- Feature flag default flipped to enabled:
  - `EXTENSIONS_ENABLED` now defaults to true when unset (schema-level default). Set to `false/no/0/off` to disable.
- Stability and deprecations:
  - Public API is GA-stable. Breaking changes require a major version bump of `extensionsApiVersion` and a documented migration path.
  - Deprecations will be annotated and maintained for at least one minor release before removal.

Rollback Plan: Disable feature flag; guarded loaders short-circuit, returning empty pipelines. No runtime executor changes required.

## 18. Assumptions

- Node 20 ESM environment; no CJS support for extension entrypoints.
- Extension count initially small (<20); O(n) iteration acceptable.
- Per-hook synchronous CPU cost low; blocking I/O discouraged (extension guidelines will state this).
- Extensions trusted (no hostile code) in this phase (no sandbox).
- Chat loop phases follow single-threaded ordering per session; no parallel model drafts for same session.
- Token accounting uses model tokenization service identical to production LLM tokenizer for accuracy.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance regressions | SLA breaches | Bench + timing histograms + budgets |
| Extension conflicts in normalization | Undefined state | Deterministic ordering + conflict detection heuristics (detect same attribute changed by >1 extension with divergent values → log warning + choose earliest) |
| Version drift | Runtime failures | Early startup validation + semver ranges |
| Capability creep | Security dilution | Central catalog + review process + unsafe gating |
| Silent failures | Data integrity issues | Mandatory metrics + warning escalation thresholds |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Manifest resource limits? | Defer; include placeholder fields reserved for future. | Add TODO comment in schema. |
| Hot reload needed short-term? | No; restart-based iteration acceptable. | Document limitation. |
| Multi-tenancy concerns? | Provide per-request context isolating tenant ID; extension contexts carry it. | Include tenantId in hook context types. |

## 21. Acceptance Criteria Traceability

Each PRD acceptance criterion mapped to test cases: see Section 15 matrix (to be added in test plan index). A passing CI run with coverage & performance gate satisfied constitutes completion.

Key criteria trace mapping:

- Chat-phase hook ordering (preChatTurn → postModelDraft → postModeration → prePersistTurn): Sections 5 & 15 (chat-phase ordering tests)
- State transaction conflict policies (first-wins / last-wins / weighted / resolver placeholder): Sections 5 & 15 (conflict resolution matrix tests)
- Per-hook token & latency budgets (enforcement + truncation metrics): Sections 5 (Budgets Enforcement) & 12 (Metrics) & 15 (budget enforcement tests)
- Concurrency limiter & queueing behavior: Sections 5 (Concurrency) & 15 (concurrency limiter test)
- Kill-switch disable behavior + disabled invocation metrics: Sections 5 (Kill-Switch), 12 (Metrics), 15 (kill-switch test)
- Data class scope gating & stripped scope logging: Section 11 (Security Model) & 12 (Metrics)
- Overhead gating thresholds (<5% pass, 5–7% warn, >7% fail): Sections 12 (Performance/Metrics) & 15 (benchmark harness)

## 22. KPI Measurement Plan

- Implementation time: Track time from scaffold commit to first reference extension (engineering log).
- Reference extensions count: CI ensures 3 example packages exist & load.
- Overhead: Benchmark script outputs JSON; CI step parses & asserts overhead ≤5% (warn if 5–7%).

## 23. Future Extensions (Not Implemented Now)

- Sandboxed execution (WASM / isolated VM).
- Remote extension fetching & signature verification.
- UI surface for enabling/disabling extensions per game instance.
- Capability negotiation with fallback strategies.

## 24. Out-of-Scope Confirmations

Explicitly reiterating excluded items to reduce scope creep: marketplace distribution, billing, untrusted sandbox, runtime hot swap, remote code loading, dynamic script evaluation.

## 25. Summary

This design introduces a structured, type-safe, and performance-conscious extension framework. It centers on a validated manifest, deterministic registry, well-bounded hook contracts, and robust observability. The plan emphasizes minimal public surface area, strong validation, and graceful degradation to enable safe ecosystem growth while preserving core stability.
