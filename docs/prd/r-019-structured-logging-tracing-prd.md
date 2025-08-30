# PRD: Structured Logging & Tracing (R-019)

Requirement ID: R-019
Source: requirements.md Section 3 (Platform & Technology)
Status: Draft
Owner: Product
Last Updated: 2025-08-29

## Summary

Implement structured JSON logging and optional distributed tracing instrumentation (OpenTelemetry) providing correlated, low-noise observability for debugging, performance analysis, and auditing—while enforcing redaction of restricted data.

## Problem / Opportunity

Unstructured or inconsistent logs impede rapid incident diagnosis and compliance verification. Unified structured logs with tracing spans enable precise correlation (requestId, gameId) and measurement of retrieval/generation performance.

## Goals

- Emit structured logs with consistent fields across services.
- Provide trace spans for key operations (retrieval, embedding, generation) with optional sampling.
- Enforce redaction/masking of restricted & PII fields before emission.

## Non-Goals

- Building a bespoke log storage system (rely on external aggregation).
- Full distributed tracing across third-party dependencies (initial scope internal spans only).

## User Stories

1. As an operator, I correlate all events of a request using requestId & gameId fields.
2. As a developer, I inspect span timings to isolate retrieval bottlenecks.
3. As a security reviewer, I confirm restricted attributes never appear in logs.

## Functional Scope

- Logging library configuration (Pino or similar) with base serializers.
- Context propagation middleware injecting requestId/gameId/user role.
- Redaction rules applied pre-serialization (restricted paths list).
- OpenTelemetry tracer provider setup with retrieval/generation spans & optional exporter.

## Out of Scope

- Advanced anomaly detection or log-based alerting rules (handled in monitoring config later).
- End-user UI log viewing portal.

## Acceptance Criteria

- GIVEN an API request WHEN processed THEN every log line includes requestId and (if applicable) gameId.
- GIVEN retrieval operation WHEN executed THEN a trace span records duration and is linkable via requestId.
- GIVEN a restricted attribute field WHEN logging attempt occurs THEN value is masked or omitted per policy.
- GIVEN tracing disabled via config WHEN request handled THEN no tracing overhead > minimal (verified by benchmark snippet).
- All criteria trace back to R-019.

## Metrics / KPIs

- Log Line Rate (baseline tracked) with target to remain within cost envelope.
- Retrieval Span p95 Duration (observability metric) trending downward via optimization.
- Redaction Violations Detected: 0.

## Risks & Mitigations

- Risk: Excessive log volume → Mitigation: Level-based sampling & structured field whitelisting.
- Risk: PII leakage → Mitigation: Redaction tests & CI check scanning fixtures.
- Risk: Tracing overhead → Mitigation: Adjustable sampling rate; disable in low-traffic dev by default.

## Dependencies

- Error handling & standardized error shape (R-028..R-030).
- Security restrictions metadata (R-059, R-067, R-077).

## Security / Privacy Considerations

- Explicit denylist/redaction for restricted attributes & tokens.
- Logs avoid storing raw user prompts containing sensitive GM-only context (masked segments with hash reference if needed).

## Performance Considerations

- Ensure logging is async & non-blocking; benchmark overhead <5% request time.

## Accessibility & UX Notes

- Developer documentation explains log field schema for quicker onboarding.

## Operational Considerations

- Config flags: LOG_LEVEL, TRACE_ENABLED, TRACE_SAMPLE_RATE.
- Structured log schema versioning for downstream parsing evolutions.

## Open Questions

- OQ-R019-01: Adopt Pino vs another structured logger? (Pino default.)
- OQ-R019-02: Default trace sampling rate (10% vs adaptive)?

## Alternatives Considered

- Unstructured console logs: Rejected (hard to parse/aggregate).
- Full always-on 100% tracing: Rejected (cost/perf overhead at scale).

## Definition of Done

- Structured logger integrated with context middleware.
- Redaction rules & tests in place (failing example validated).
- Tracing spans emitted & visible in exporter (sample run documented).

## Appendix (Optional)

Example log line schema:

```json
{
"ts": 1681234567.123,
"level": "info",
"msg": "retrieval.complete",
"requestId": "abc123",
"gameId": "g789",
"duration_ms": 142,
"retrieved": 12
}
```

---
Template compliance confirmed.
