# PRD: R-103 Internationalization Readiness

Requirement ID: R-103
Source: requirements.md Section 21
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Prepare UI for future localization by externalizing user-facing strings, establishing translation key conventions, and providing fallback mechanisms (reinforces R-075).

## Problem / Opportunity

Hard-coded strings impede adding new locales; preparing early de-risks expansion and community contributions.

## Goals

- 100% of user-visible text externalized with stable keys.
- Fallback to English for missing translations.
- Lint rule preventing new hard-coded strings in components.

## Non-Goals

- Providing multiple locale translations initially (English only).

## User Stories

1. As a developer, I add a new UI string via translation file not inline.
2. As a contributor, I can add a locale file without code refactor.
3. As a user, I see English defaults when translation key missing.

## Functional Scope

- Translation key registry/files.
- i18n helper function with fallback.
- Lint rule / codemod enforcement.

## Out of Scope

- Dynamic per-user locale negotiation (fixed env/user setting later).

## Acceptance Criteria

- GIVEN code scan WHEN executed THEN zero disallowed inline strings (excluding allowlist e.g., aria labels constants).
- GIVEN missing key in non-English file WHEN referenced THEN English fallback displayed.
- GIVEN added component WHEN reviewed THEN translation keys used.

## Metrics / KPIs

- Inline string lint violations (target 0).

## Risks & Mitigations

- Risk: Over-nesting keys → Mitigation: naming convention guide.

## Dependencies

- R-075 (i18n readiness statement), R-098 (lint gates).

## Security / Privacy Considerations

- Avoid leaking restricted attributes via translation keys.

## Performance Considerations

- Lazy-load locale bundles (future optimization) not required now.

## Operational Considerations

- Contribution guide section for translations.

## Open Questions

- OQ: Key naming convention (dot vs slash)?

## Alternatives Considered

- Later retrofit — rejected (higher refactor cost).

## Definition of Done

- Externalization complete.
- Lint rule active.
- Docs updated.

---
