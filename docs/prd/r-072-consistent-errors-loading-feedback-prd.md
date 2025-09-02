# PRD: Consistent Errors & Loading Feedback (R-072)

Requirement ID: R-072
Source: requirements.md Section 16 (Frontend Requirements)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Provide standardized components for loading states, optimistic updates, and error presentation ensuring predictability and reducing duplicated patterns.

## Problem / Opportunity

Inconsistent spinners, toasts, and error blocks cause cognitive friction and hinder accessibility. A unified pattern library reduces maintenance.

## Goals

- Shared LoadingSpinner, InlineError, Toast components.
- Optimistic mutation wrapper handling success/error revert.
- Central error mapping from backend error shape (R-028).

## Non-Goals

- Full design system theming engine (minimum viable components only).
- Complex notification queue prioritization.

## User Stories

1. As a user, I see consistent inline validation and toast errors across pages.
2. As a developer, I wrap a mutation with optimistic helper instead of bespoke logic.
3. As an accessibility tester, I verify error announcements via aria-live.

## Functional Scope

- UI primitives library.
- Mutation helper orchestrating optimistic state.
- Global toast store with queue.

## Out of Scope

- Offline retry queue.
- Theming beyond light/dark baseline.

## Acceptance Criteria

- GIVEN API error WHEN thrown THEN mapped user-friendly message displayed via Toast.
- GIVEN optimistic update WHEN failure THEN revert occurs within one render cycle.
- GIVEN loading state WHEN data fetch pending THEN skeleton or spinner displayed (no layout jump).
- All criteria trace back to R-072.

## Metrics / KPIs

- Optimistic Failure Revert Time p95 <150 ms.
- Duplicate Error Component Implementations (target decreasing to 0).

## Risks & Mitigations

- Risk: Overuse of toasts → Mitigation: Severity gating (info, warn, error).
- Risk: Unmapped new error codes → Mitigation: Fallback generic message + monitoring.

## Dependencies

- Error shape (R-028 to R-030).

## Security / Privacy Considerations

- Redact restricted error details for players.

## Performance Considerations

- Lightweight components; avoid large re-renders by scoping stores.

## Accessibility & UX Notes

- Toast container aria-live polite; error inline region described by form field.

## Operational Considerations

- None.

## Open Questions

- OQ-R072-01: Provide persistent error log panel for developers?

## Alternatives Considered

- Page-level blocking modals — Rejected (disruptive flow).

## Definition of Done

- Components and helper shipped.
- Tests for optimistic revert.
- Docs updated.

## Appendix (Optional)

Toast shape: `{ id, type, message }`.

---
Template compliance confirmed.
