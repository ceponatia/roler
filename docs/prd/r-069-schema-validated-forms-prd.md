# PRD: Schema-Validated Forms (R-069)

Requirement ID: R-069
Source: requirements.md Section 16 (Frontend Requirements)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Front-end forms must validate inputs using shared contracts (Zod schemas) prior to submission, providing immediate feedback and preventing round-trips with invalid payloads.

## Problem / Opportunity

Server-only validation yields slower feedback loops and inconsistent error messages. Shared schema validation reduces friction and errors.

## Goals

- Import and reuse @contracts schemas client-side.
- Inline error messaging with accessible descriptions.
- Prevent submission when invalid, disabling action button.

## Non-Goals

- Client-only validation logic divergence (must mirror server schema).
- Complex form builder DSL.

## User Stories

1. As a user, I see immediate field error when leaving a required input blank.
2. As a developer, I update one schema and both client & server logic adjust.
3. As a QA engineer, I rely on uniform error shape in UI tests.

## Functional Scope

- Form hooks integrating schema parse on blur & submit.
- Aggregated form validity state.
- Consistent error display component.

## Out of Scope

- Autosave drafts (future).
- Offline validation caching.

## Acceptance Criteria

- GIVEN invalid field WHEN user blurs THEN inline error appears referencing rule.
- GIVEN valid corrections WHEN user edits THEN error clears and form can submit.
- GIVEN schema update adding required field WHEN form loaded THEN field shows required indicator.
- All criteria trace back to R-069.

## Metrics / KPIs

- Client Validation Pass Rate.
- Submission Rejection Rate (should decrease post-implementation).

## Risks & Mitigations

- Risk: Version mismatch between client and server → Mitigation: Single version bundle / semantic version check.
- Risk: Performance hit on large schemas → Mitigation: Debounced validation.

## Dependencies

- Shared schema layer (R-025 to R-027).

## Security / Privacy Considerations

- Never trust client-only result; server re-validation mandatory.

## Performance Considerations

- O(n) field validation; prefer incremental re-parse.

## Accessibility & UX Notes

- Associate errors via aria-describedby and role=alert for first error focus.

## Operational Considerations

- None (static capability).

## Open Questions

- OQ-R069-01: Provide global form error summary at top?

## Alternatives Considered

- Pure server validation — Rejected (latency, inconsistency).

## Definition of Done

- Form validation utilities shipped.
- Tests covering invalid/valid cycles.
- Docs updated.

## Appendix (Optional)

Pseudo: `schema.safeParse(formData)`.

---
Template compliance confirmed.
