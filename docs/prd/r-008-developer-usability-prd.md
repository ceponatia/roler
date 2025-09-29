# PRD: R-008 Developer Usability

Requirement ID: R-008
Source: requirements.md Section 2
Status: Accepted
Owner: PRODUCT
Last Updated: 2025-09-29

## Summary

Improve developer ergonomics via contracts-first APIs, predictable schema evolution, and automated documentation.

## Problem / Opportunity

Manual documentation and inconsistent naming slow onboarding and increase errors.

## Goals

- Auto-generate up-to-date API reference
- Automate schema change log with breaking change detection
- Centralize error code documentation

## Non-Goals

- Full developer portal UX (basic generated docs only)

## User Stories

1. As a new contributor, I view clear contracts to understand boundaries.
2. As an API consumer, I see consistent naming patterns.
3. As a maintainer, I get automatic schema diff alerts.

## Functional Scope

- Doc generation pipeline from schemas
- Changelog generator (semantic diff of Zod schemas)
- Error code registry page

## Out of Scope

- Multi-language SDK generation

## Acceptance Criteria

- GIVEN a breaking schema change THEN CI fails with required version bump notice.
- GIVEN generation run THEN docs updated without manual edits.
- Error code page enumerates all active codes with descriptions.

## Metrics / KPIs

- Onboarding time reduction (qualitative survey)
- Docs generation success rate 100%

## Risks & Mitigations

- Risk: Docs drift → Mitigation: CI diff check between generated and committed content.

## Dependencies

- Contracts-first development (R-024)
- Boundary safety (R-004)

## Security / Privacy Considerations

- Generated docs exclude sensitive configuration values.

## Performance Considerations

- Doc generation completes < 1 min in CI.

## Operational Considerations

- Nightly job re-generates docs to detect unnoticed drift.

## Open Questions

- Should we version docs per release tag?

## Alternatives Considered

- Manual wiki (rejected: high drift risk)

## Definition of Done

- Automated docs & changelog pipeline merged, initial diff tests passing, error code registry published.
