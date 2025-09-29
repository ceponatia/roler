# PRD: First Token Latency Target (R-054)

Requirement ID: R-054
Source: requirements.md Section 12 (Streaming & Realtime)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Ensure system delivers first streamed token within <1s of request acceptance under nominal load, improving perceived responsiveness.

## Problem / Opportunity

High initial latency reduces user engagement and trust. Setting and instrumenting a strict TTFT (time to first token) target drives architectural optimizations and early detection of regressions.

## Goals

- Instrument TTFT end-to-end (request accepted to first token event flush).
- Surface TTFT metrics and alerts.
- Identify and optimize contributing stages (retrieval, prompt assembly, model warmup).

## Non-Goals

- Guarantees under heavy pathological load (separate stress scenarios).
- Full-token generation latency optimization (beyond scope here).

## User Stories

1. As an operator, I see TTFT dashboard staying within target.
2. As a developer, I detect regression via failing performance test.
3. As a player, I perceive immediate response start.

## Functional Scope

- TTFT measurement instrumentation.
- Performance test harness simulating representative prompts.
- Alert threshold configuration.

## Out of Scope

- Per-token throughput optimization.
- Adaptive model selection for latency.

## Acceptance Criteria

- GIVEN nominal load test WHEN executed THEN p95 TTFT <1000ms.
- GIVEN performance regression (p95 >= target) WHEN detected THEN alert triggers and issue auto-created.
- GIVEN instrumentation failure WHEN metrics absent THEN health check flags missing data.
- All criteria trace back to R-054.

## Metrics / KPIs

- TTFT p50 and p95.
- Instrumentation Coverage (percentage endpoints emitting metric).
- Regression Alerts per Month.

## Risks and Mitigations

- Risk: Clock skew → Mitigation: Use monotonic timers server-side.
- Risk: Metric sampling misses spikes → Mitigation: High-resolution sampling and rolling windows.
- Risk: Over-optimization reduces quality → Mitigation: Balance with quality evaluation gating.

## Dependencies

- Streaming transport (R-051).
- Retrieval and prompt assembly (R-041 to R-044).

## Security and Privacy Considerations

- Metrics avoid embedding sensitive prompt content.

## Performance Considerations

- Warm model or keep-alive to reduce cold starts.

## Accessibility and UX Notes

- Early token presence triggers progressive rendering for assistive tech.

## Operational Considerations

- Performance test part of CI gating.
- Alert route to on-call rotation.

## Open Questions

- OQ-R054-01: Separate target for cold start scenarios.
- OQ-R054-02: Track variance contribution breakdown automatically.

## Alternatives Considered

- No explicit target: Rejected (no performance accountability).
- Full completion latency only: Rejected (does not reflect perceived responsiveness).

## Definition of Done

- TTFT instrumentation and dashboards.
- CI performance test passes.
- Alert rules active.

## Appendix (Optional)

Formula: TTFT = firstTokenTimestamp - requestAcceptedTimestamp.

---
Template compliance confirmed.
