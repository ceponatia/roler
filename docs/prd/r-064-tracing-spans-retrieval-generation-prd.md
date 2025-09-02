# PRD: Tracing Spans for Retrieval & Generation (R-064)

Requirement ID: R-064
Source: requirements.md Section 15 (Logging & Observability)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Instrument distributed traces enclosing key phases (retrieval, prompt assembly, model inference streaming) enabling latency breakdown and bottleneck identification with optional sampling to control overhead.

## Problem / Opportunity

Aggregate latency metrics obscure which stage causes slow responses. Fine-grained spans allow targeted optimization and regression detection.

## Goals

- Create spans: retrieval, embeddingLookup (optional), promptAssembly, modelInference, streamFlush.
- Propagate trace context through async tasks (queue jobs optional).
- Configurable sampling rate (env) with dynamic adjustment capability.

## Non-Goals

- Full vendor-specific APM feature set.
- Automatic trace-based anomaly detection (future).

## User Stories

1. As a performance engineer, I view traces to pinpoint slow model inference.
2. As an operator, I reduce sampling to 1% during incident to limit overhead.
3. As a developer, I add new span types with a helper API.

## Functional Scope

- Tracing library integration (OpenTelemetry compliant).
- Span helper functions mapping internal phases.
- Exporter configuration via env (stdout, OTLP endpoint).

## Out of Scope

- Proprietary vendor exporters beyond OTLP baseline.
- Browser distributed tracing linkage (future enhancement).

## Acceptance Criteria

- GIVEN trace sampling=1.0 WHEN 10 requests processed THEN ≥9 include retrieval and modelInference spans.
- GIVEN sampling=0 WHEN request processed THEN no spans exported.
- GIVEN span errors WHEN thrown THEN status recorded with error flag.
- All criteria trace back to R-064.

## Metrics / KPIs

- Span Coverage (% requests with at least retrieval span) ≥95% at sampling=1.
- Overhead (<5% added latency p95 vs baseline).

## Risks & Mitigations

- Risk: High cardinality attributes → Mitigation: Limit attributes to controlled set.
- Risk: Performance overhead → Mitigation: Adjustable sampling & minimal processing.

## Dependencies

- Correlation IDs (R-063).

## Security / Privacy Considerations

- Redact restricted attribute values; only include path counts.

## Performance Considerations

- Use batch span processor with flush on shutdown.

## Accessibility & UX Notes

- N/A (operator tooling only).

## Operational Considerations

- Dynamic sampling adjustable via config reload.

## Open Questions

- OQ-R064-01: Provide per-endpoint sampling override?

## Alternatives Considered

- Single aggregate timing metric only — Rejected (insufficient granularity).

## Definition of Done

- Spans implemented & tests verifying presence.
- Sampling documented.
- Exporter configuration instructions.

## Appendix (Optional)

Span names draft: `retrieval`, `prompt_assembly`, `model_inference`, `stream_flush`.

---
Template compliance confirmed.
