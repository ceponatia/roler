# PRD: R-020 Modular Packaging Structure

Requirement ID: R-020
Source: requirements.md Section 4
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide a modular monorepo structure of deployable apps and reusable packages with clear public surfaces to enable independent evolution, reuse, and faster builds.

## Problem / Opportunity

A growing codebase without enforced boundaries leads to tight coupling, harder refactors, and slow CI. We need explicit packaging to isolate domains (retrieval, canon, games, db, web, worker) and prevent leakage of internals.

## Goals

- Clear separation between deployables (apps/*) and libraries (packages/*)
- Stable, minimal public exports per package
- Enforce no deep imports referencing internal source
- Facilitate parallel development and caching in CI

## Non-Goals

- Defining full CI pipeline details (covered elsewhere)
- Multi-repo splitting (stay monorepo)

## User Stories

1. As a developer, I can import only documented exports from a package so I avoid relying on internal code that may break.
2. As a build engineer, I can run affected-only builds after changes to reduce CI time.
3. As a contributor, I can discover domain ownership quickly by inspecting folder structure.

## Functional Scope

- Directory layout: apps/web, apps/worker, packages/{contracts,db,ollama,rag,canon,games}
- Package entry points expose only built output (dist) via exports field
- Lint rule preventing deep imports (ESLint no-restricted-imports)
- Scripts for building all packages with dependency graph ordering (e.g., Turborepo)

## Out of Scope

- Publishing packages to external registry
- Runtime plugin loader (addressed in extensibility requirements)

## Acceptance Criteria

- GIVEN a consumer package, WHEN it imports another internal package, THEN only declared public exports resolve.
- GIVEN an attempt to deep import a source file, THEN lint fails.
- GIVEN a change in one package, WHEN CI runs, THEN only dependent packages rebuild (verified by build log referencing subset).
- Directory structure matches documented layout.

## Metrics / KPIs

- CI build duration for unaffected change < 40% of full rebuild baseline.
- Number of deep import violations = 0 after enforcement.

## Risks & Mitigations

- Risk: Over-granular packages increase overhead → Mitigation: Keep package count minimal; review additions.
- Risk: Inconsistent build outputs → Mitigation: Shared tsconfig + build script template.

## Dependencies

- Tooling: TypeScript project references, Turborepo (or pnpm recursive), ESLint config.

## Open Questions

- Should we generate API docs from public exports automatically?

## Definition of Done

- Structure created, lint rules active, sample deep import fails CI, docs updated.
