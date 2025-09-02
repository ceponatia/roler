# PRD: Sensitive Data Exclusion from Logs (R-067)

Requirement ID: R-067
Source: requirements.md Section 15 (Logging & Observability)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Enforce policy ensuring PII and GM-only sensitive narrative data never appear in logs by combining detection, masking (R-065), and test enforcement.

## Problem / Opportunity

Log leakage creates privacy, security, and narrative spoiler risks. Proactive exclusion reduces compliance exposure and preserves story integrity.

## Goals

- Define sensitive field classification list.
- Add static and runtime checks preventing serialization.
- Provide failing test if forbidden patterns detected in fixture logs.

## Non-Goals

- Content-based ML classification of sensitive text.
- Retroactive scrubbing of historical logs.

## User Stories

1. As a security auditor, I run tests confirming no PII patterns present.
2. As a developer, I get immediate CI failure if I log a restricted field.
3. As a GM, I know secret plot twists remain private.

## Functional Scope

- Forbidden patterns config (regex list) with allow overrides.
- Lint rule or custom AST check for logger.* calls with raw objects containing restricted keys.
- Runtime guard raising warning if detection missed at build time.

## Out of Scope

- Automatic anonymization beyond removal/masking.
- External DLP service integration.

## Acceptance Criteria

- GIVEN code that logs restricted field name WHEN lint runs THEN error raised.
- GIVEN runtime attempt to log dynamic object containing restricted key WHEN executed THEN value masked and warning emitted.
- GIVEN CI test suite WHEN run THEN sample logs contain zero forbidden tokens.
- All criteria trace back to R-067.

## Metrics / KPIs

- Leakage Incidents (target 0).
- Lint Violation Count (track downward trend to near zero stable).

## Risks & Mitigations

- Risk: Overblocking legitimate logs → Mitigation: Allowlist mechanism with review.
- Risk: Regex false negatives → Mitigation: Periodic pattern review & test corpus expansion.

## Dependencies

- Masking (R-065).
- Structured logging (R-066).

## Security / Privacy Considerations

- Central sensitive key registry maintained under change control.

## Performance Considerations

- Pattern checks limited to a small key set for low overhead.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- Alert on any detected leakage incident.

## Open Questions

- OQ-R067-01: Need runtime sampling of logs for random deep scan?

## Alternatives Considered

- Manual code review only — Rejected (inconsistent).

## Definition of Done

- Lint + runtime guard implemented.
- Test corpus passes.
- Documentation of sensitive registry updated.

## Appendix (Optional)

Forbidden key example list: `password`, `sessionToken`, `plot.twist`.

---
Template compliance confirmed.
