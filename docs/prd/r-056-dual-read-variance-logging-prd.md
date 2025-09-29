# PRD: Dual-Read Variance Logging (R-056)

Requirement ID: R-056
Source: requirements.md Section 13 (Vector Store Strategy and Scalability)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Introduce dual-read mode issuing retrieval queries to both current and candidate vector backends, logging variance metrics prior to cutover.

## Problem / Opportunity

Switching vector backends without empirical comparison risks degraded relevance or latency. Dual-read enables quantitative evaluation (overlap, score delta) while serving production traffic safely.

## Goals

- Parallel query issuance (primary: serve results, secondary: measure).
- Metrics: overlap percent, MRR delta, latency delta.
- Configurable sampling rate.

## Non-Goals

- Serving blended merged results to users.
- Automatic cutover decision logic (human review required).

## User Stories

1. As an operator, I observe dashboard comparing relevance metrics between backends.
2. As a developer, I adjust sampling percentage without redeploy (config reload acceptable if simpler initially).
3. As a maintainer, I export variance report supporting migration go or no-go.

## Functional Scope

- DualReadRetriever wrapper calling both implementations.
- Variance calculator (Jaccard overlap, score distribution stats).
- Metrics and structured log events.

## Out of Scope

- Automated rollback triggers.
- Real-time per-query user-visible difference explanation.

## Acceptance Criteria

- GIVEN dual-read enabled WHEN query executed THEN primary path latency impact <10% overhead.
- GIVEN sampling=0 WHEN set THEN no secondary queries issued.
- GIVEN variance metrics collected WHEN threshold breach THEN alert generated.
- All criteria trace back to R-056.

## Metrics / KPIs

- Overlap Percentage.
- Latency Overhead Percentage.
- Sample Coverage Rate.

## Risks and Mitigations

- Risk: Cost increase from duplicate queries → Mitigation: Sampling and off-peak scheduling.
- Risk: Latency regression on primary path → Mitigation: Async secondary execution.
- Risk: Misinterpretation of metrics → Mitigation: Clear documentation of formulas.

## Dependencies

- Configurable backend selection (R-055).
- Retrieval interface (R-041) and embeddings (R-043).

## Security and Privacy Considerations

- Ensure restricted fields filtering identical across both paths.

## Performance Considerations

- Secondary query executed in parallel to minimize added latency.

## Accessibility and UX Notes

- Operator dashboards labeled clearly for each backend.

## Operational Considerations

- Feature flag: DUAL_READ_ENABLED.
- Alerting on sustained low overlap.

## Open Questions

- OQ-R056-01: Additional metric (NDCG) needed.
- OQ-R056-02: How long to run dual-read before cutover baseline (days or weeks).

## Alternatives Considered

- Immediate cutover without measurement: Rejected (high risk).
- Shadow copy offline batch comparison only: Rejected (misses live query distribution nuances).

## Definition of Done

- DualReadRetriever implemented and tested.
- Metrics and alerts configured.
- Variance report template documented.

## Appendix (Optional)

Overlap formula: overlap = |A ∩ B| / |A| (A primary result ids, B secondary).

---
Template compliance confirmed.
