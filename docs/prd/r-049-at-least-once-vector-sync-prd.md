# PRD: At-Least-Once Vector Sync (R-049)

Requirement ID: R-049
Source: requirements.md Section 11 (Jobs & Asynchronous Processing)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Guarantee at-least-once propagation of vector data to secondary backends using resilient processors and idempotent upsert semantics integrating with outbox pattern (R-039).

## Problem / Opportunity

Inconsistent secondary indexes degrade retrieval accuracy post-migration or dual-read phases. Reliable sync ensures parity and confidence during backend transitions.

## Goals

- Idempotent upsert operations on secondary store.
- Retry with exponential backoff.
- Monitoring of lag and failure counts.

## Non-Goals

- Exactly-once semantics.
- Multi-destination fan-out ordering guarantees.

## User Stories

1. As an operator, I view sync lag (max event age) below threshold.
2. As a developer, I add a new secondary backend with minimal boilerplate.
3. As a maintainer, I reprocess failed events from DLQ.

## Functional Scope

- Sync processor consuming outbox entries (R-039).
- Idempotency key logic (chunkId/version).
- Lag metrics & alert thresholds.

## Out of Scope

- Bidirectional sync (secondary back to primary).
- Conflict resolution beyond last-write-wins.

## Acceptance Criteria

- GIVEN processed entry WHEN repeated due to retry THEN secondary state unchanged (idempotent).
- GIVEN sync lag > threshold WHEN detected THEN alert emitted.
- GIVEN secondary outage WHEN recovered THEN backlog drains automatically.
- All criteria trace back to R-049.

## Metrics / KPIs

- Sync Lag (seconds).
- Failed Sync Attempt Rate.
- DLQ Size.

## Risks & Mitigations

- Risk: Idempotency mismatch → Mitigation: Canonical version keying.
- Risk: Runaway retries → Mitigation: Attempt cap + DLQ.
- Risk: Silent failures → Mitigation: Mandatory error logging + alerting.

## Dependencies

- Outbox propagation (R-039).
- Dual-read strategy (R-056).

## Security / Privacy Considerations

- Ensure restricted fields excluded when not needed in secondary.

## Performance Considerations

- Batch upserts where supported for throughput.

## Accessibility & UX Notes

- Ops dashboard clarity for lag & failures.

## Operational Considerations

- Replay CLI / script.
- Alert threshold configuration.

## Open Questions

- OQ-R049-01: Use checksum to detect silent divergence?
- OQ-R049-02: Provide dry run compare mode pre-cutover?

## Alternatives Considered

- On-demand catch-up only: Rejected (constant partial divergence risk).
- Immediate strong consistency dual-write: Rejected (failure coupling).

## Definition of Done

- Sync processor + idempotency implemented.
- Metrics & alerts active.
- Docs describe cutover readiness checklist.

## Appendix (Optional)

Idempotency key example: `<chunkId>:<version>`.

---
Template compliance confirmed.
