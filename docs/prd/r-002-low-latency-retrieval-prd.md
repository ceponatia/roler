# PRD: R-002 Low-Latency Retrieval

Requirement ID: R-002
Source: requirements.md Section 2
Status: Draft
Owner: PRODUCT
Last Updated: YYYY-MM-DD

## Summary

Deliver fast contextual retrieval feeding LLM prompts with predictable latency and deterministic ordering.

## Problem / Opportunity

High retrieval latency degrades conversational UX and reduces perceived responsiveness.

## Goals

- p95 retrieval latency ≤ 250 ms (PT-140)
- Deterministic ordering for identical inputs
- Graceful timeout fallback (partial context)

## Non-Goals

- ANN specialized backend migration (covered by R-055/R-056)

## User Stories

1. As a player, I receive near-immediate context-driven responses.
2. As a GM, newly added session facts appear in retrieval quickly.
3. As an operator, I view real-time latency percentiles.

## Functional Scope

- Optimized vector similarity queries (pgvector baseline)
- LRU / window cache for recent embeddings & query results
- Latency metrics (p50/p95/p99) + timeout handling

## Out of Scope

- Cross-region replication strategy

## Acceptance Criteria

- GIVEN typical corpus size WHEN retrieval executed THEN p95 ≤ 250 ms in staging benchmarks.
- GIVEN a timeout event THEN partial ordered subset returned with warning flag.
- Latency dashboard exposes rolling percentiles and error rates.

## Metrics / KPIs

- p95 latency ≤ 250 ms (daily)
- Timeout rate < 1%

## Risks & Mitigations

- Risk: Corpus growth increases latency → Mitigation: proactive index reorganization & plan to introduce ANN backend (R-055).

## Dependencies

- Retriever interface (R-041)
- Observability (R-063..R-067)

## Security / Privacy Considerations

- Ensure restricted attributes excluded per R-059/R-067.

## Performance Considerations

- Query parallelism tuned to avoid saturating DB connections.

## Operational Considerations

- Alert on p95 > target for 5 consecutive minutes.

## Open Questions

- Cache invalidation strategy granularity?

## Alternatives Considered

- Full precomputation of all context sets (rejected: explosion of combinations)

## Definition of Done

- Benchmarks recorded, dashboards live, tests verifying timeout fallback + ordering.
