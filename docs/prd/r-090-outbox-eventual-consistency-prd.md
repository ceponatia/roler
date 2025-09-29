# PRD: R-090 Outbox Eventual Consistency

Requirement ID: R-090
Source: requirements.md Section 19
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Ensure outbox-driven propagation (R-039, R-049) achieves eventual consistency with guaranteed durable enqueue, idempotent processing, and bounded replication lag for secondary vector stores.

## Problem / Opportunity

Without robust outbox guarantees, dual-store divergence risks stale retrieval context and correctness issues in dual-read mode.

## Goals

- Write operations atomically record outbox events in same transaction.
- Processor retries with exponential backoff; no lost messages.
- Replication lag (creation → applied downstream) p95 ≤60 s.

## Non-Goals

- Strong immediate consistency across stores.
- Cross-datacenter multi-primary replication.

## User Stories

1. As a GM, newly added entity text appears in retrieval within a minute.
2. As an operator, I can inspect pending outbox size and lag.
3. As a developer, I can reprocess a failed event safely (idempotent).

## Functional Scope

- Outbox table schema with status & attempt counters.
- Worker consuming events, applying to vector store(s).
- Metrics: queue depth, processing rate, max/avg lag.

## Out of Scope

- Multi-region replication strategy.

## Acceptance Criteria

- GIVEN successful write WHEN transaction commits THEN outbox row persisted.
- GIVEN transient downstream failure WHEN processing THEN event retried with backoff until success or max attempts flagged.
- GIVEN duplicate processing attempt WHEN executed THEN no duplicate vector entries created.
- GIVEN nominal conditions WHEN measuring 500 events THEN p95 lag ≤60 s.

## Metrics / KPIs

- Replication p95 lag: ≤60 s.
- Failure retry success rate: ≥99% within 5 attempts.

## Risks & Mitigations

- Risk: Poison messages blocking progress → Mitigation: DLQ / quarantine state.
- Risk: Table growth unbounded → Mitigation: archival job after success retention window.

## Dependencies

- R-046..R-050 (job framework).
- R-055 (vector backend selection).

## Security / Privacy Considerations

- Outbox rows exclude sensitive restricted text (store references/IDs instead).

## Performance Considerations

- Index on status + created_at for efficient polling.

## Operational Considerations

- Alert if backlog >X (configurable) or oldest pending age >5 min.
- Runbook: identify stuck events, requeue or quarantine.

## Open Questions

- OQ: Retention duration for processed rows (7 vs 30 days?).

## Alternatives Considered

- Direct dual-write without outbox — rejected (higher inconsistency risk).

## Definition of Done

- Schema + worker implemented.
- Metrics and alerts configured.
- Test suite covers idempotency & retry.

---
