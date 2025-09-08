# Extension System (Early Draft)

This draft outlines the emerging extension framework as represented by current schemas. Runtime execution logic will be added later.

## Current Schemas

- ExtensionManifest: Declares identity, hooks, chatHooks, budgets, concurrencyLimit, killSwitchEnabled, dataClassScopes, stateTransactionSupport.
- ExtensionRegistrationConfig: Host-level allow/deny lists, ordering overrides, performance overhead thresholds (warn/fail), fail-open vs strict mode flags.
- StateTransaction: Atomic attribute operations with conflict policies (first-wins, last-wins, weighted, resolver placeholder).

## Goals

- Pluggable feature contributions (normalization, retrieval enrichment, chat phases) without core modifications.
- Deterministic ordering + performance guardrails (<5% overhead target; warn 5–7%; fail >7%).
- Safe attribute mutations via state transactions with conflict resolution semantics.

## Hook Phases (Planned)

- Normalization hooks
- Retrieval enrichment hooks
- Chat hooks: preChatTurn, postModelDraft, postModeration, prePersistTurn
- Validation/pre-save hooks

## Operational Controls

- Global kill switch per extension
- Concurrency limit (default small value) to protect latency budget
- Budgets per hook (ms, tokens) declared in manifest

## Security & Scope

- dataClassScopes gate access to sensitive classes (e.g., private attributes, external sources)
- unsafeCapabilities allowlist for privileged operations (planned)

## Observability (Planned Metrics)

- Invocation counters per hook
- Duration histograms & p95 tracking
- Overhead percentage vs baseline
- State transaction conflict outcomes
- Disabled / skipped counts (kill switch, budget exceeded)

## Next Steps

- Implement runtime registry (manifest loading + validation)
- Add execution pipeline with timing + overhead measurement
- Enforce budgets & concurrency at runtime
- Add resolver strategy for weighted/conflict policies

## References

- Schemas: `packages/schemas/src/system/extensions/`
- Design Spec: `docs/design/r-001-extensible-framework-techspec.md`
