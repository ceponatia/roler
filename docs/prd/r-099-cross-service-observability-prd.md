# PRD: R-099 Cross-Service Observability

Requirement ID: R-099
Source: requirements.md Section 21
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide unified observability (structured logs, distributed traces, metrics) across web and worker services enabling end-to-end request correlation.

## Problem / Opportunity

Fragmented logs impede root cause analysis. Correlated telemetry accelerates incident resolution and optimization.

## Goals

- Standard log fields: requestId, spanId, gameId, userRole.
- Trace propagation across HTTP, job queue boundaries.
- Central dashboards for latency & error trends.

## Non-Goals

- Proprietary vendor lock-in (prefer OpenTelemetry standards).

## User Stories

1. As an operator, I trace a slow request from API to embedding job.
2. As a developer, I identify which segment causes latency spikes.
3. As a security reviewer, I confirm restricted fields are masked.

## Functional Scope

- OpenTelemetry SDK integration.
- Log exporter (JSON) + trace exporter.
- Correlation utility library.

## Out of Scope

- Advanced anomaly detection ML.

## Acceptance Criteria

- GIVEN request WHEN completed THEN trace spans visible with latency breakdown.
- GIVEN job triggered by request WHEN inspected THEN spans linked via trace ID.
- GIVEN restricted attribute log attempt WHEN emitted THEN masked value appears.

## Metrics / KPIs

- Trace sampling rate (≥20% default; configurable).
- Log ingestion error rate <1%.

## Risks & Mitigations

- Risk: High telemetry cost → Mitigation: adjustable sampling.
- Risk: Missing correlation → Mitigation: integration tests verifying headers.

## Dependencies

- R-063..R-066 (logging basics), R-065 (masking).

## Security / Privacy Considerations

- Enforce allowlist for log fields.

## Performance Considerations

- Asynchronous exporters; budget <5% overhead.

## Operational Considerations

- Runbook: tuning sampling under load.

## Open Questions

- OQ: Default sampling percentage vs cost trade-off?

## Alternatives Considered

- Only logs without traces — rejected (poor causal analysis).

## Definition of Done

- Telemetry stack integrated & documented.
- Tests cover propagation & masking.

---
