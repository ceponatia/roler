---
title: R-001 Changes — Deferred Runtime Execution & Enforcement (Phase 5)
status: Accepted
last-updated: 2025-09-09
related-prd: none (local change log for R-001; executor work deferred)
revision: 0.1.0
---

## 1. Purpose & Scope

Document changes and deferrals for R-001 after GA (Phases 0–4 complete). This note enumerates Phase 5 items that remain deferred and provides stable integration points to reduce future churn. It is not a full tech spec; it derives structure from `techspec-template.md` for consistency.

In-Scope:

- List of deferred runtime execution and enforcement tasks (Phase 5) and their intent
- Lightweight interface and integration notes to minimize future refactors

Out-of-Scope (this change):

- Full executor design and benchmarks (will be done when the runtime effort is scheduled)

## 2. Deferred Items (Phase 5)

- Hook Execution Engine
  - Deterministic pipelines for: normalization, retrievalEnrichment, preSaveValidate, and chat phases (preChatTurn → postModelDraft → postModeration → prePersistTurn)
  - Stable hook ordering: priority DESC, id ASC; within-extension declared order
  - Unified BaseHookContext propagation (tenantId, sessionId, role, requestId, budgets)
- Budget Enforcement
  - Time budgets: soft timeouts (AbortController + Promise.race)
  - Token budgets: truncation where applicable (e.g., postModelDraft)
  - Emit metrics on overruns
- Concurrency & Kill-Switch
  - Per-extension concurrency limiter (default 4), FIFO queue
  - Runtime kill-switch short-circuit with disabled_invocations metric
- Circuit Breaker
  - Per (extensionId, hookType) failure tracking; open/half-open behavior
- State Transactions Merge
  - Policies: first-wins, last-wins, weighted, resolver placeholder
  - Coalescing compatible ops; deterministic merge
- Data Class Scope Gating
  - Runtime checks aligned with manifest-declared scopes
- Metrics Wiring
  - onHookStart/onHookEnd/onHookError/onBudgetOverrun lifecycle events
- Benchmark Harness & CI Gate
  - Added overhead p95 <5% (warn 5–7%, fail >7%)
- Integration Tests
  - Ordering, budgets enforcement, kill-switch, concurrency, data scope gating, circuit breaker, peer/version errors

## 3. Minimal Integration Notes (Now, No-Op)

To reduce future integration cost while keeping runtime deferred, the following non-functional boundaries are acceptable now:

- Executor Boundary (No-Op)
  - Shape: `runPipelines(context, inputs): HookResults` returns empty/no-op results
  - Wiring: call sites in chat loop and entity lifecycle are allowed to import an executor interface that currently resolves to a no-op implementation
  - Guard: gated behind EXTENSIONS_ENABLED (and optionally a future EXTENSIONS_RUNTIME_ENABLED)

- Budgets & Metrics Types
  - `DefaultHookBudgets` and `effectiveHookBudget()` remain the source for enforcement inputs (already implemented)
  - `MetricsSink` events reserved for executor lifecycle hooks

- Kill-Switch & Counters Location
  - Decision placeholder: store kill-switch state and counters in an in-memory map or Redis; final choice deferred

Completion Note (2025-09-09):

- No-op executor boundary added and exported (`runPipelines`, `PipelineInputs`, `PipelineOutputs`).
- Runtime guard helper added (`shouldEnableExtensionsRuntime`) using a new `EXTENSIONS_RUNTIME_ENABLED` parsed via `@roler/schemas`.
- Budgets and metrics types already present remain the canonical inputs for future enforcement.

## 4. Open Questions

- OQ-R001-CH-01: Do we introduce a dedicated EXTENSIONS_RUNTIME_ENABLED flag separate from discovery?
- OQ-R001-CH-02: Global max queue depth to avoid unbounded waits — needed?

## 5. Acceptance Note

This document serves as the authoritative change log for R-001 post-GA deferrals. Implementations must not assume the runtime executor exists until scheduled. Public authoring APIs remain stable; runtime behavior is a no-op where execution would be required.
