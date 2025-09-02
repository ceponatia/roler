# PRD: R-088 Retrieval Latency Target

Requirement ID: R-088
Source: requirements.md Section 19
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Ensure retrieval operations (vector + field-aware assembly) meet performance target PT-140 with p95 end-to-end latency ≤250 ms for corpus sizes below 10M chunks, providing responsive context generation for chat and minimizing perceived lag.

## Problem / Opportunity

Slow retrieval degrades user experience and increases abandonment during interactive storytelling. Establishing a clear latency target with instrumentation lets us detect regressions early, plan scaling/cutover (R-056), and maintain competitive responsiveness.

## Goals

- p95 retrieval (request received → contexts ready for prompt assembly) ≤250 ms under baseline load.
- p99 retrieval ≤400 ms under baseline load.
- Instrumentation & dashboards exposing p50/p95/p99, error rate, and backend breakdown.

## Non-Goals

- ANN / specialized vector backend implementation (handled via later cutover R-055/R-056 when thresholds breached).
- Optimizing LLM generation latency (separate concern from retrieval).

## User Stories

1. As a player, I receive context-enhanced responses without noticeable delay.
2. As a GM, I can trigger entity updates and still see retrieval remain within target budgets.
3. As an operator, I can view real-time retrieval latency percentiles to detect degradation.

## Functional Scope

- Metrics collection around retriever interface.
- Percentile aggregation & export (Prometheus/OpenTelemetry).
- Alert thresholds for p95 >250 ms sustained 5 min.

## Out of Scope

- Query caching layer (future optimization if needed).
- Backend switching automation (manual decision aided by metrics).

## Acceptance Criteria

- GIVEN normal load WHEN 1000 sequential retrievals executed THEN p95 ≤250 ms (test harness report).
- GIVEN load spike (2x baseline) WHEN autoscaling not yet triggered THEN p95 may exceed 250 ms but p99 ≤500 ms.
- GIVEN instrumentation WHEN viewing dashboard THEN p50/p95/p99 visible with last 24h trend.
- GIVEN code change that adds new retrieval path WHEN merged THEN metrics still emitted (no missing series).

## Metrics / KPIs

- Retrieval p95 latency: ≤250 ms.
- Retrieval error rate (non-success): <0.5%.
- Dashboard freshness: data delay <60 s.

## Risks & Mitigations

- Risk: Metric cardinality explosion → Mitigation: limit label set (backend, success, error_code).
- Risk: Underestimation of latency due to sampling → Mitigation: full instrumentation (no sampling) until corpus >10M.

## Dependencies

- R-041..R-045 (retrieval interface & field-aware logic).
- R-055, R-056 (backend configurability & dual-read for future cutover).

## Security / Privacy Considerations

- No PII in metric labels (use numeric/status codes only).

## Performance Considerations

- Low-overhead high-resolution timers; ensure <2% CPU overhead.

## Accessibility & UX Notes

- Indirect: faster retrieval improves perceived responsiveness.

## Operational Considerations

- Alert rule: p95 >250 ms for 5 consecutive minutes → page.
- Runbook: check DB/vector CPU, index bloat, lock contention.

## Open Questions

- OQ: Threshold for early warning (p95 >200 ms?).

## Alternatives Considered

- Pure DB logs parsing for latency — rejected (incomplete context + overhead).
- Client-side timing only — rejected (excludes server-side breakdown).

## Definition of Done

- Metrics implemented & visible in dashboard.
- Automated perf test demonstrates compliance.
- Alert configured and documented.
- Tests cover metric emission path.

---
