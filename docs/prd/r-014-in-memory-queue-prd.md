# PRD: In-Memory Queue & Jobs (R-014)

Requirement ID: R-014
Source: requirements.md Section 3 (Platform & Technology)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide an in-memory queue abstraction (initially Redis-backed BullMQ) enabling background job orchestration for ingestion, re-embedding, synchronization, and maintenance tasks with retry, scheduling, and metrics visibility.

## Problem / Opportunity

Synchronous processing of embedding and ingestion tasks increases request latency and reduces throughput. A dedicated queue decouples latency-sensitive API paths from long-running or retry-prone operations, improving responsiveness and reliability.

## Goals

- Enqueue and process domain jobs (ingest, reembed, sync) asynchronously.
- Configurable retry & backoff policies per job type.
- Operational visibility via metrics and health endpoints.

## Non-Goals

- Implementing a fully distributed workflow engine (e.g., temporal-like features).
- Guaranteed exactly-once semantics (at-least-once with idempotency is sufficient).

## User Stories

1. As a developer, I can enqueue a re-embed job when content changes so that embeddings refresh asynchronously.
2. As an operator, I can view counts of active, delayed, failed jobs to assess system health.
3. As a maintainer, I can configure retry backoff without code changes (env or config file).

## Functional Scope

- Queue abstraction API (enqueue, schedule/delay, retry metadata, cancel).
- Job type registration & handler mapping.
- Metrics export: active, waiting, delayed, failed, completed, retry counts.
- Configurable concurrency per job type.

## Out of Scope

- Cross-region queue replication.
- Cron expression parsing beyond basic periodic scheduling.

## Acceptance Criteria

- GIVEN a reembed job enqueue WHEN worker processes THEN job status transitions to completed and embedding updated.
- GIVEN a transient failure WHEN job retries configured (maxRetries=3, exponential) THEN job attempts increment until success or marked failed with reason.
- GIVEN metrics endpoint request WHEN queue has jobs in multiple states THEN response includes per-state counts.
- GIVEN concurrency=1 for a job type WHEN two jobs submitted concurrently THEN second waits until first completes.
- All criteria trace back to R-014.

## Metrics / KPIs

- Job Success Rate: ≥99% (excluding intentional failures).
- Average Queue Wait Time (p95): Tracked (baseline to ensure SLAs met for re-embed freshness).
- Retry Exhaustion Count per Day: ≤5 (investigate spikes).

## Risks & Mitigations

- Risk: Memory pressure / backlog growth → Mitigation: Alert on queue length threshold; scale workers horizontally.
- Risk: Poison messages causing infinite retries → Mitigation: Dead-letter / max retries enforced with alert.
- Risk: Handler idempotency bugs → Mitigation: Idempotent design guidelines + tests.

## Dependencies

- Redis (or equivalent) for persistence & pub/sub features.
- Worker deployment (R-047) infrastructure.

## Security / Privacy Considerations

- Job payloads must exclude restricted attributes unless encryption applied.
- Limit visibility of job data to authorized operator endpoints.

## Performance Considerations

- Concurrency tuning documented per job type.
- Backoff and retry defaults balance throughput vs resource contention.

## Accessibility & UX Notes

- Operator dashboard (future) should present accessible counts; current phase limited to JSON metrics.

## Operational Considerations

- Health check includes queue connectivity & worker heartbeat.
- Configuration via env: QUEUE_BACKOFF_STRATEGY, QUEUE_MAX_RETRIES.
- Graceful shutdown drains in-flight jobs or requeues safely.

## Open Questions

- OQ-R014-01: Introduce dead-letter queue persistence for inspection?
- OQ-R014-02: Standardize job priority levels now or defer?

## Alternatives Considered

- Direct synchronous processing: Rejected (increases API latency & error coupling).
- External managed queue (e.g., SQS) early: Rejected for local dev simplicity; revisit at scale.

## Definition of Done

- Queue abstraction & handlers implemented.
- Metrics endpoint validated in integration tests.
- Retry/backoff configuration documented.
- Idempotency guidelines added to developer docs.

## Appendix (Optional)

Sample metrics response snippet:

```json
{
"jobs": { "active": 2, "waiting": 5, "failed": 0, "delayed": 1, "completed": 120 }
}
```

---
Template compliance confirmed.
