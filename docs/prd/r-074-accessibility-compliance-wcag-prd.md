# PRD: Accessibility Compliance (WCAG 2.1 AA) (R-074)

Requirement ID: R-074
Source: requirements.md Section 16 (Frontend Requirements)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Ensure core UI flows (navigation, chat streaming, entity editing, overrides) meet WCAG 2.1 AA guidelines for keyboard navigation, contrast, focus management, and screen reader support.

## Problem / Opportunity

Inaccessible interfaces exclude users and risk compliance deficits. Early baked-in accessibility reduces later retrofit cost.

## Goals

- Keyboard-only full task completion.
- Color contrast ratios ≥4.5:1 for text.
- Proper aria roles for dynamic regions (chat stream, toasts).

## Non-Goals

- AAA compliance (beyond baseline scope).
- Localization of aria labels beyond English baseline.

## User Stories

1. As a keyboard user, I can navigate chat and submit a message without mouse.
2. As a screen reader user, I hear new streamed tokens announced politely.
3. As a compliance reviewer, I verify contrast passes automated checks.

## Functional Scope

- Focus ring styles consistent & visible.
- aria-live regions for streaming tokens and toasts.
- Landmark roles: nav, main, complementary.

## Out of Scope

- Voice control optimization.

## Acceptance Criteria

- GIVEN audit with axe-core WHEN run on key pages THEN zero critical violations.
- GIVEN stream updates WHEN tokens arrive THEN announcements not more than once per 500 ms batch.
- GIVEN tab traversal WHEN executed THEN focus order logical and cyclical (no trap).
- All criteria trace back to R-074.

## Metrics / KPIs

- Accessibility Violation Count (critical) = 0.
- Keyboard Task Completion Success Rate = 100% (test scenarios).

## Risks & Mitigations

- Risk: Token flood spams screen reader → Mitigation: Batch announcements.
- Risk: Custom components lacking semantics → Mitigation: Use native elements or add roles.

## Dependencies

- Incremental chat view (R-070).

## Security / Privacy Considerations

- Avoid exposing restricted attribute values in aria labels for player role.

## Performance Considerations

- Batching reduces CPU overhead for announcements.

## Accessibility & UX Notes

- This section is the focus; design tokens include accessible color palette.

## Operational Considerations

- Automated accessibility tests in CI.

## Open Questions

- OQ-R074-01: Provide high-contrast theme toggle?

## Alternatives Considered

- Post-hoc remediation — Rejected (higher cost, risk of regressions).

## Definition of Done

- Automated and manual audits passed.
- Documentation of accessibility guidelines.
- CI gate enforced.

## Appendix (Optional)

Contrast example: body text 16px #222 on #fff ratio > 12:1.

---
Template compliance confirmed.
