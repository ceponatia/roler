# PRD: Relational Primary Vector Search (R-038)

Requirement ID: R-038
Source: requirements.md Section 9 (Data & Persistence)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Use the relational datastore (Postgres + pgvector) as the primary vector search backend until scale or latency thresholds justify migration to a specialized store.

## Problem / Opportunity

Operating separate vector infrastructure early adds cost and complexity. A single datastore supports ACID workflows and reduces synchronization needs while dataset size is moderate.

## Goals

- Provide acceptable retrieval latency (PT-140) under growth thresholds.
- Simplify operational footprint for early stages.
- Enable later migration path (R-013, R-056).

## Non-Goals

- Implementing approximate ANN optimizations beyond pgvector capabilities.
- Multi-region replication strategy.

## User Stories

1. As an operator, I monitor retrieval latency to determine migration timing.
2. As a developer, I perform similarity queries via unified repository.
3. As a maintainer, I adjust index parameters without code changes.

## Functional Scope

- Vector columns & indexes (ivfflat / hnsw config).
- Metrics: query latency, index size.
- Migration playbook triggers when thresholds exceeded.

## Out of Scope

- Dual-read variance logic (R-056 covers).
- Cross-backend replication (R-039 handles outbox propagation).

## Acceptance Criteria

- GIVEN corpus size < threshold WHEN similarity query k=10 THEN p95 latency ≤ target.
- GIVEN index parameter update WHEN applied THEN queries continue functioning (smoke test).
- GIVEN threshold breach (latency or size) WHEN detected THEN issue created referencing migration plan.
- All criteria trace back to R-038.

## Metrics / KPIs

- Retrieval p95 Latency.
- Vector Index Size Growth.
- Migration Trigger Events Count.

## Risks & Mitigations

- Risk: Sudden corpus spike → Mitigation: Monitoring & pre-scaling guidance.
- Risk: Index rebuild downtime → Mitigation: Concurrent build + swap strategy.
- Risk: Underestimating migration lead time → Mitigation: Early warning thresholds.

## Dependencies

- Relational datastore (R-012).
- Retrieval interface (R-041).

## Security / Privacy Considerations

- Restricted data filtering pre-embedding (R-059/067/077).

## Performance Considerations

- Periodic analyze to keep planner stats accurate.

## Accessibility & UX Notes

- Operational runbook documentation clarity.

## Operational Considerations

- Alert on latency > target across N intervals.

## Open Questions

- OQ-R038-01: Determine exact corpus threshold value (chunks count).
- OQ-R038-02: Default distance metric (cosine vs inner product)?

## Alternatives Considered

- Early adoption of specialized backend: Rejected (premature complexity).
- Embedding store separate table only: Rejected (atomicity simplicity preferred initially).

## Definition of Done

- Vector schema & indexes present.
- Metrics instrumentation shipped.
- Threshold monitoring in place.

## Appendix (Optional)

Baseline latency dashboard fields documented.

---
Template compliance confirmed.
