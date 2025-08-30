# PRD: R-021 Enforced Module Boundaries

Requirement ID: R-021
Source: requirements.md Section 4

## Summary

Prevent leaking of non-public implementation details by enforcing import boundaries and restricting deep imports.

## Problem / Opportunity

Without guardrails, developers may import internal source paths, creating tight coupling and brittle refactors.

## Goals

- Block deep imports into src/ internals of other packages
- Provide clear error feedback at lint time
- Preserve ability to refactor internal structure without cascading breaks

## User Stories

1. As a developer, I get a lint error if I import a file that isn't part of a package's public exports.
2. As a maintainer, I can reorganize internal folders without affecting consumers.

## Functional Scope

- ESLint rule configuration (no-restricted-imports) with patterns blocking internal paths
- Optional runtime assertion in dev mode warning if deep path is resolved
- Documentation of allowed import patterns

## Acceptance Criteria

- GIVEN a deep import attempt (e.g., @games/src/lib/internal.ts) THEN lint fails with clear message.
- GIVEN refactor of internal file structure THEN no consumer changes required.

## Metrics / KPIs

- Deep import violations after rollout: 0
- Time to refactor internal file (baseline vs after rule) reduced (qualitative)

## Risks & Mitigations

- Risk: Overly broad restriction blocks legitimate shared types → Mitigation: Introduce dedicated types export barrel.

## Dependencies

- R-020 modular packaging baseline

## Open Questions

- Should we auto-generate allowed exports list to avoid drift?

## Definition of Done

- Lint rule active, sample violation fails CI, guidance doc updated.
