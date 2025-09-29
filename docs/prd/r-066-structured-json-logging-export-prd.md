# PRD: Structured JSON Logging & Export (R-066)

Requirement ID: R-066
Source: requirements.md Section 15 (Logging & Observability)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Adopt structured JSON logging across services with consistent field schema enabling downstream aggregation, filtering, and analytics, plus optional export pipeline.

## Problem / Opportunity

Unstructured logs hinder automated processing and alerting. A unified JSON schema improves operational visibility and simplifies tooling integration.

## Goals

- Single logger abstraction emitting JSON lines.
- Field schema: timestamp, level, msg, requestId, gameId, userRole, component.
- Pluggable transport: stdout default; optional HTTP/OTLP.

## Non-Goals

- Proprietary binary log formats.
- Full log retention policy management.

## User Stories

1. As an operator, I query logs for all warnings in retrieval component.
2. As a developer, I add contextual fields without breaking schema.
3. As a compliance reviewer, I confirm restricted fields masked (R-065).

## Functional Scope

- Logger module with child loggers per component.
- Level configuration via env.
- Structured serializer applying masking & correlation IDs.

## Out of Scope

- Multi-tenant log segregation.
- Real-time log streaming UI.

## Acceptance Criteria

- GIVEN log emission WHEN inspected THEN output is valid JSON object per schema.
- GIVEN invalid log level env WHEN startup THEN system defaults and logs warning.
- GIVEN child logger creation WHEN used THEN inherits correlation context.
- All criteria trace back to R-066.

## Metrics / KPIs

- Invalid Log Rate (parse errors) = 0.
- Log Volume per Request (monitor bloat).

## Risks & Mitigations

- Risk: Excessive log volume cost → Mitigation: Level gating & sampling for debug.
- Risk: Schema drift → Mitigation: JSON schema validation tests.

## Dependencies

- Correlation IDs (R-063).
- Masking (R-065).

## Security / Privacy Considerations

- Ensure no raw secrets (env auditing R-078, R-094).

## Performance Considerations

- Batched write or async flush for high-volume.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- Rotatable log sinks (stdout aggregated externally).

## Open Questions

- OQ-R066-01: Introduce log sampling for info level?

## Alternatives Considered

- Plain text logs — Rejected (harder machine parsing).

## Definition of Done

- Logger abstraction shipped.
- Schema validation tests green.
- Documentation updated.

## Appendix (Optional)

Field schema draft: `[timestamp, level, msg, requestId, gameId, userRole, component]`.

---
Template compliance confirmed.
