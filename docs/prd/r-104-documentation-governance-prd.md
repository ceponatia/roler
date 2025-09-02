# PRD: R-104 Documentation Governance

Requirement ID: R-104
Source: requirements.md Section 21
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Establish process & structure for developer API reference and GM user guide versioning, ensuring docs remain accurate with code changes (supports R-008, R-076).

## Problem / Opportunity

Stale documentation causes onboarding friction and misuse of APIs. Governance ensures traceability and review.

## Goals

- Versioned docs matching releases.
- Change checklist requiring doc update confirmation.
- Automated link validation in CI.

## Non-Goals

- Full docs site theming (basic Markdown acceptable initially).

## User Stories

1. As a GM, I find up-to-date guide for entity editing.
2. As a developer, I rely on API docs reflecting current contracts.
3. As a maintainer, I block merges lacking required doc updates.

## Functional Scope

- Docs directory structure & version tags.
- CI link checker.
- PR template with docs update checkbox.

## Out of Scope

- Automated doc generation for all code (selective only).

## Acceptance Criteria

- GIVEN breaking API change WHEN PR opened THEN failing checklist if docs not updated.
- GIVEN CI link check WHEN run THEN no broken internal doc links.
- GIVEN release tag WHEN created THEN snapshot of docs preserved.

## Metrics / KPIs

- Broken link count (target 0).
- Missing doc update PR rejections.

## Risks & Mitigations

- Risk: Checklist ignored → Mitigation: CI enforcement.

## Dependencies

- R-025..R-027 (contracts), R-098 (CI gates).

## Security / Privacy Considerations

- Avoid exposing internal secrets in docs examples.

## Performance Considerations

- Link check completes within acceptable CI time (<1 min).

## Operational Considerations

- Release playbook includes doc version tagging.

## Open Questions

- OQ: Use static site generator later?

## Alternatives Considered

- Ad-hoc manual docs — rejected (untracked drift).

## Definition of Done

- Governance process documented & enforced.
- CI link check active.
- PR template updated.

---
