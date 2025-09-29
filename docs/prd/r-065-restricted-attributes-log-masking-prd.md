# PRD: Restricted Attributes Log Masking (R-065)

Requirement ID: R-065
Source: requirements.md Section 15 (Logging & Observability)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Implement automatic masking of restricted (GM-only) attribute values in all logs to prevent accidental leakage while preserving structural context for debugging.

## Problem / Opportunity

Logs can inadvertently expose spoilers or sensitive data. A centralized masking policy ensures safety without relying on ad-hoc developer discipline.

## Goals

- Central mask utility `maskRestricted(obj)` applied before emission.
- Configurable placeholder token (default `"<redacted>"`).
- Test harness verifying no restricted values appear unmasked.

## Non-Goals

- Field-level encryption (separate concern).
- Retroactive log scrubbing.

## User Stories

1. As a security reviewer, I run tests confirming no raw restricted values in logs.
2. As a GM, I trust that secrets do not leak through backend logs.
3. As a developer, I reuse a simple helper rather than re-implement masking.

## Functional Scope

- Detection uses attribute metadata (R-059) to identify restricted paths.
- Masking applied in logger serializer / hook.
- Metrics counting masked field occurrences.

## Out of Scope

- Partial hashing of values.
- Conditional unmask for privileged runtime (future console mode).

## Acceptance Criteria

- GIVEN restricted atom WHEN log emitted THEN value replaced by placeholder.
- GIVEN non-restricted atom WHEN logged THEN value intact.
- GIVEN logger unit tests WHEN run THEN zero violations reported.
- All criteria trace back to R-065.

## Metrics / KPIs

- Masked Field Count (monitor anomalies).
- Leakage Incidents (target 0).

## Risks & Mitigations

- Risk: Developer bypasses helper → Mitigation: ESLint rule forbidding direct logger.info(object) on raw atoms.
- Risk: Performance impact of deep clone → Mitigation: Shallow traversal using path index.

## Dependencies

- Restricted metadata tagging (R-059).
- Logging framework (R-066).

## Security / Privacy Considerations

- Mask token must not reveal content length if that leaks information (optionally fixed length string).

## Performance Considerations

- Traversal O(n) in number of atoms — acceptable baseline.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- Alert if leakage incident metric >0.

## Open Questions

- OQ-R065-01: Should we store masked counts per path for analytics?

## Alternatives Considered

- Manual developer discipline — Rejected (error-prone).
- Full encryption — Rejected (complexity, minimal add’l value for internal logs).

## Definition of Done

- Masking utility + integration shipped.
- ESLint rule or code review checklist updated.
- Test suite passes.

## Appendix (Optional)

Example masked log: `{ "attrPath": "plot.twist", "value": "<redacted>" }`.

---
Template compliance confirmed.
