# PRD: R-091 Re-Embedding Horizontal Scalability

Requirement ID: R-091
Source: requirements.md Section 19
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Enable re-embedding jobs (triggered by content or schema changes, R-048) to scale horizontally via worker concurrency ensuring backlog clearance within defined SLA.

## Problem / Opportunity

As corpus grows, serial embedding becomes bottleneck; horizontal scaling minimizes staleness and supports timely model migrations.

## Goals

- Linear throughput scaling with additional workers (±15%).
- Backlog clearance SLA: 95% of re-embedding tasks <24h during bulk re-index.
- Concurrency controls to avoid DB saturation (configurable batch size / rate limiting).

## Non-Goals

- GPU scheduling optimization (future if needed).

## User Stories

1. As an operator, I can add worker instances and observe proportional throughput increase.
2. As a GM, updated schema reflects in retrieval within one day of change for all entities.
3. As a developer, I can trigger a bulk re-embed job with progress visibility.

## Functional Scope

- Partitioned work queues or shard assignment.
- Progress metrics (remaining items, processed per minute).
- Rate limiter to cap DB writes per second.

## Out of Scope

- Multi-tenant fairness scheduling.

## Acceptance Criteria

- GIVEN two workers WHEN compared to one THEN throughput increase ≥1.7x.
- GIVEN bulk re-embed (N items) WHEN 24h elapses THEN ≥95% items updated.
- GIVEN rate limit config WHEN exceeded THEN workers backoff without errors.

## Metrics / KPIs

- Items embedded per minute.
- Backlog age p95.

## Risks & Mitigations

- Risk: DB contention → Mitigation: batch size tuning, connection pool limits.
- Risk: Uneven sharding → Mitigation: dynamic work stealing.

## Dependencies

- R-046..R-050 (job system), R-048.

## Security / Privacy Considerations

- Ensure no sensitive text persists in transient logs during embedding.

## Performance Considerations

- Avoid large transaction batches (>100 items) to keep lock durations low.

## Operational Considerations

- Dashboard: backlog size, throughput, error rate.
- Runbook for stuck progress.

## Open Questions

- OQ: Minimum viable worker count default?

## Alternatives Considered

- Single queue with no sharding — rejected (hot-spotting, limited scaling).

## Definition of Done

- Horizontal scaling documented & validated with load test.
- Metrics & alerts in place.
- Tests for rate limiting behavior.

---
