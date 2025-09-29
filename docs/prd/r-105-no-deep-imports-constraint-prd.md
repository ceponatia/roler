# PRD: R-105 No Deep Imports Constraint

Requirement ID: R-105
Source: requirements.md Section 22
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Enforce prohibition of deep imports into package internals (R-021) via tooling (ESLint rule + path mapping) to preserve encapsulation and refactor safety.

## Problem / Opportunity

Deep imports couple consumers to internal structure, blocking evolution and increasing break risk.

## Goals

- ESLint rule fails on paths outside declared exports.
- CI enforcement (ties R-098).
- Migration guidance for existing violations (if any).

## Non-Goals

- Runtime module sandboxing (compile-time enforcement sufficient).

## User Stories

1. As a developer, I get immediate lint error using disallowed internal path.
2. As a maintainer, I can refactor internal directories without breaking consumers.
3. As a reviewer, I see no deep import usage in diff.

## Functional Scope

- Custom ESLint rule or config pattern.
- Allowed path allowlist per package root.
- Script to scan for existing violations.

## Out of Scope

- Automatic rewriting of legacy imports.

## Acceptance Criteria

- GIVEN deep import in code WHEN lint runs THEN failure emitted.
- GIVEN compliant codebase WHEN scan executes THEN zero violations.
- GIVEN new package export WHEN added THEN rule updated accordingly.

## Metrics / KPIs

- Deep import violation count (target 0).

## Risks & Mitigations

- Risk: False positives → Mitigation: targeted allowlist & tests.

## Dependencies

- R-021 (module boundaries), R-098.

## Security / Privacy Considerations

- None.

## Performance Considerations

- Minimal lint overhead.

## Operational Considerations

- Include rule description in CONTRIBUTING.md.

## Open Questions

- OQ: Should we auto-fix by suggesting root export path?

## Alternatives Considered

- Manual code review policing — rejected (inconsistent).

## Definition of Done

- Rule implemented & enforced.
- Violations resolved.
- Docs updated.

---
