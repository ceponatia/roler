# PRD: Standardized Error Shape (R-028)

Requirement ID: R-028
Source: requirements.md Section 7 (Error Handling)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Define and enforce a single structured error shape returned by all backend endpoints, workers, and internal services to enable consistent client handling, logging, and tracing correlation.

## Problem / Opportunity

Inconsistent error response formats increase client complexity and obscure observability. A unified error contract simplifies UI handling, supports analytics, and ensures security redactions are uniformly applied.

## Goals

- Establish canonical fields (code, message, details?, requestId?).
- Provide helper factory/utilities for creating typed errors.
- Ensure all thrown/returned errors map to documented codes.

## Non-Goals

- Encoding full stack traces to clients (kept server-side).
- Exhaustive internationalization of error messages (structural first).

## User Stories

1. As a frontend developer, I can rely on `error.code` to branch UX states.
2. As an operator, I correlate log entries with `requestId` from error payload.
3. As a maintainer, I extend the catalog with a new code via documented process.

## Functional Scope

- Error code catalog (stable identifiers) with description.
- Error construction utilities (e.g., makeError({ code, message, meta })).
- Middleware translating internal exceptions to standardized shape.
- Documentation of lifecycle: creation → logging → client response.

## Out of Scope

- Fine-grained localization of messages.
- Automatic retry orchestration (handled at client/job layer).

## Acceptance Criteria

- GIVEN an endpoint throws internal domain error WHEN middleware handles THEN client receives structured JSON with documented fields.
- GIVEN unknown/unhandled exception WHEN caught THEN mapped to generic internal code without leaking stack details.
- GIVEN new error code addition WHEN PR merged THEN catalog updated & lint passes linking usage to definition.
- All criteria trace back to R-028.

## Metrics / KPIs

- Undocumented Error Code Occurrences: 0.
- Error Mapping Coverage: 100% of thrown domain errors mapped.
- Mean Error Payload Size: Tracked (avoid bloat).

## Risks & Mitigations

- Risk: Overly verbose details leaking sensitive info → Mitigation: Whitelist safe meta keys; redact restricted attributes.
- Risk: Code explosion / fragmentation → Mitigation: Review process + categories.
- Risk: Unmapped legacy errors → Mitigation: CI scan for throw statements bypassing helper.

## Dependencies

- Inbound validation (R-026) for uniform validation errors.
- Logging & tracing (R-019) for correlated identifiers.

## Security / Privacy Considerations

- Redact sensitive values before inclusion in details.
- Avoid differentiating error messages that facilitate enumeration attacks.

## Performance Considerations

- Minimal overhead; ensure middleware adds negligible latency (<1ms typical).

## Accessibility & UX Notes

- Consistent codes allow accessible UI message mapping, simplifying narration.

## Operational Considerations

- Error code catalog versioning policy with deprecation warnings.
- Alerting on spike of specific codes (e.g., RATE_LIMIT, VALIDATION_FAILED).

## Open Questions

- OQ-R028-01: Include HTTP status inside error body redundantly?
- OQ-R028-02: Provide doc generator for error catalog automatically?

## Alternatives Considered

- Free-form error objects: Rejected (inconsistent & hard to log).
- Single generic error code: Rejected (insufficient diagnostic power).

## Definition of Done

- Error utilities + middleware implemented.
- Catalog documented & linked; tests ensure mapping coverage.
- CI scan prevents undocumented codes.

## Appendix (Optional)

Example error response schema snippet:

```json
{
  "code": "VALIDATION_FAILED",
  "message": "Invalid request payload",
  "requestId": "abc123",
  "details": { "fields": [ { "path": "name", "msg": "Required" } ] }
}
```

---
Template compliance confirmed.
