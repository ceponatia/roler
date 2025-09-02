# PRD: R-089 Streaming First Token Latency

Requirement ID: R-089
Source: requirements.md Section 19
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Guarantee first-token delivery (TTFT) in streaming responses (SSE) occurs within ≤1 second p95 (aligned with R-054) to maintain conversational flow and reduce perceived wait time.

## Problem / Opportunity

Users disengage if initial generation stalls. Early token visibility enhances trust and interactive pacing.

## Goals

- p95 TTFT ≤1000 ms under nominal load.
- p99 TTFT ≤1500 ms.
- Separate instrumentation for queue wait, retrieval, model warmup portions.

## Non-Goals

- Full generation throughput optimization (handled elsewhere).
- Guarantee under pathological overload (beyond autoscale thresholds).

## User Stories

1. As a player, I see text start streaming almost immediately after sending a message.
2. As a GM, I observe first token speed unaffected by retrieval complexity within target.
3. As an operator, I can diagnose TTFT regressions by breakdown stage.

## Functional Scope

- Timer instrumentation from request accept → first SSE data token.
- Log + metrics with percentiles.
- Optional warmup pre-request for models on cold start.

## Out of Scope

- Multi-model selection heuristics.

## Acceptance Criteria

- GIVEN nominal load WHEN 500 chat requests executed THEN TTFT p95 ≤1000 ms.
- GIVEN cold start (no prior requests 10 min) WHEN first request arrives THEN TTFT p95 across subsequent 10 requests ≤1200 ms.
- GIVEN dashboard WHEN operator inspects THEN TTFT breakdown (retrieval vs generation start) is visible.

## Metrics / KPIs

- TTFT p95: ≤1000 ms.
- Warm vs hot start delta: ≤300 ms.

## Risks & Mitigations

- Risk: Model cold-load spikes — Mitigation: background warmup ping.
- Risk: Retrieval tail affects TTFT — Mitigation: monitor R-088 jointly.

## Dependencies

- R-051..R-053 (streaming transport & assembly).
- R-054 (first-token target baseline).

## Security / Privacy Considerations

- TTFT metrics exclude token content.

## Performance Considerations

- Minimal additional overhead timers only.

## Operational Considerations

- Alert: TTFT p95 >1s for 10 min.
- Runbook includes checking model server logs & CPU.

## Open Questions

- OQ: Should we pre-warm on deploy or lazily first user?

## Alternatives Considered

- Delay stream until full sentence — rejected (hurts interactivity).

## Definition of Done

- Instrumentation merged, metrics displayed.
- Perf test proves compliance.
- Alert & runbook documented.

---
