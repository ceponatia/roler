# PRD: R-107 Strict TypeScript Config Constraint

Requirement ID: R-107
Source: requirements.md Section 22
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Mandate strict TypeScript compiler options (strict true, noImplicitAny, exactOptionalPropertyTypes, etc.) remain enabled; changes require formal review to prevent type safety regressions.

## Problem / Opportunity

Relaxing strictness introduces latent runtime defects; codifying immutability of config protects reliability and speeds refactoring confidence.

## Goals

- Baseline tsconfig checked into repo with protected settings.
- CI assertion preventing weakening in PRs.
- Documentation enumerating rationale for each strict flag.

## Non-Goals

- Evaluating alternative type systems.

## User Stories

1. As a reviewer, I see CI block attempts to disable strict flags.
2. As a developer, I understand why a flag is enforced via docs.
3. As a maintainer, I can propose change via explicit ADR with approvals.

## Functional Scope

- CI script diff-check for tsconfig critical fields.
- Doc page mapping strict flags to risk avoided.
- Test ensuring no `any` (ties R-098) & no non-null assertions (DS-003).

## Out of Scope

- Granular per-package TS overrides that reduce strictness.

## Acceptance Criteria

- GIVEN PR modifying tsconfig strict flag WHEN CI runs THEN failure unless approved override label present.
- GIVEN code introducing non-null assertion WHEN lint runs THEN failure.
- GIVEN tsconfig unchanged WHEN CI runs THEN pass.

## Metrics / KPIs

- Attempts to relax config (alert count).

## Risks & Mitigations

- Risk: Developer frustration with verbose types → Mitigation: utility types / helpers library.

## Dependencies

- R-098 (quality gates), DS- standards.

## Security / Privacy Considerations

- None.

## Performance Considerations

- Slightly longer compile times acceptable trade-off.

## Operational Considerations

- ADR template for proposing change.

## Open Questions

- OQ: Automate generation of strictness rationale doc from config?

## Alternatives Considered

- Partial strictness — rejected (inconsistent guarantees).

## Definition of Done

- CI guard active.
- Docs & ADR process in place.
- Tests enforce no `any`/non-null.

---
