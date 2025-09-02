# PRD: Outbox Propagation (R-039)

Requirement ID: R-039
Source: requirements.md Section 9 (Data & Persistence)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Implement outbox pattern capturing vector-affecting changes for reliable asynchronous propagation to secondary vector stores or downstream processors.

## Problem / Opportunity

Direct dual-writes risk inconsistency or partial failure. Outbox guarantees at-least-once delivery with idempotent consumers, supporting safe eventual consistency.

## Goals

- Durable outbox table with minimal schema.
- Worker job consuming and syncing entries.
- Idempotent processing ensuring duplicate safety.

## Non-Goals

- Guaranteed exactly-once semantics (at-least-once acceptable).
- Cross-region outbox replication (future scale item).

## User Stories

1. As an operator, I reprocess stuck outbox entries.
2. As a developer, I add a new downstream backend by subscribing to outbox feed.
3. As a maintainer, I monitor lag between primary write and propagation.

## Functional Scope

- Outbox table (event id, type, payload, createdAt, processedAt, attempt count).
- Consumer worker with exponential backoff & dead-letter.
- Metrics: backlog size, processing latency.

## Out of Scope

- Change data capture streaming (CDC) via logical replication (may revisit).
- Complex dependency ordering between events.

## Acceptance Criteria

- GIVEN new embedding write WHEN committed THEN outbox row created within same transaction.
- GIVEN transient consumer failure WHEN retried THEN processing eventually succeeds without duplication effect.
- GIVEN processed entry WHEN completed THEN processedAt timestamp set and not reprocessed.
- All criteria trace back to R-039.

## Metrics / KPIs

- Outbox Backlog Size.
- Average Propagation Latency.
- Dead-Letter Entry Count.

## Risks & Mitigations

- Risk: Growing backlog → Mitigation: Scale worker concurrency & alert thresholds.
- Risk: Poison messages → Mitigation: Max attempt & DLQ segregation.
- Risk: Payload bloat → Mitigation: Lean payload referencing primary keys.

## Dependencies

- Job/queue system (R-014, R-046..R-050).
- Vector backend strategy (R-038, R-056).

## Security / Privacy Considerations

- Ensure restricted fields not replicated where unnecessary.

## Performance Considerations

- Batch retrieval of outbox rows tuned to reduce I/O.

## Accessibility & UX Notes

- Operator docs describe backlog introspection.

## Operational Considerations

- Dashboard for backlog + latency.
- Replay CLI command.

## Open Questions

- OQ-R039-01: Maximum retries before DLQ?
- OQ-R039-02: Retention policy for processed entries?

## Alternatives Considered

- Direct dual-write: Rejected (hard to ensure consistency).
- CDC-only approach: Rejected early (extra infra overhead initially).

## Definition of Done

- Outbox table & consumer implemented.
- Metrics + alerts configured.
- Idempotent processing tests pass.

## Appendix (Optional)

Example outbox row (conceptual):

```json
{ "id": 1, "type": "EMBED_UPSERT", "payload": { "chunkId": "c1" } }
```

---
Template compliance confirmed.
