# State Transactions (Draft)

## Overview

State transactions allow extensions to propose atomic attribute-level modifications with explicit conflict resolution semantics.

## Schema Elements

- `id` (optional client-provided) for correlation
- `operations[]` each containing:
  - `op`: `set | increment | append`
  - `path`: attribute keyPath
  - `value` / `delta` / `items` depending on op
- `conflictPolicy`: `first-wins | last-wins | weighted | resolver`
- `meta`: optional extension-defined metadata

## Conflict Policies

- first-wins: earliest accepted transaction takes precedence
- last-wins: later transaction overrides prior
- weighted: selection based on weight (future implementation)
- resolver: custom logic (placeholder for future execution engine)

## Validation Rules

- `increment` requires numeric `delta`
- `append` requires non-empty `items` array
- Size limits enforced upstream (future) to bound payload

## Planned Runtime Behavior

1. Collect pending transactions per entity / frame.
2. Order + resolve via policy.
3. Apply deterministic merged attribute set.
4. Emit state change event for audit.

## Metrics (Planned)

- Transactions proposed / applied / rejected
- Conflict policy distribution
- Resolution latency (p95)
- Collision rate (multiple ops on same path)

## Future Work

- Implement weighted + resolver strategies
- Add rollback/compensation support
- Integrate with extension budgets & kill switch
