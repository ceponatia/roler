# PRD: Shared Schema Layer (R-025)

Requirement ID: R-025
Source: requirements.md Section 6 (Validation & Schema Strategy)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Establish a shared schema/contracts layer (packages/contracts) that defines environment variables, API request/response DTOs, and data boundary contracts as the single authoritative source reused across backend services, workers, and frontend clients to eliminate duplication and drift.

## Problem / Opportunity

Without a centralized schema layer, shape definitions fragment across codebases, increasing risk of mismatch, runtime errors, and security oversights. A single source-of-truth accelerates development (auto-inferred types), improves auditability, and enables safer evolutions (versioning + changelog) supporting contracts-first development (R-024) and centralized validation (R-017).

## Goals

- Provide unified schemas for env, HTTP APIs, queue payloads, and canonical import/export.
- Support type inference everywhere (no manual interface duplication).
- Enable versioned evolution with documented breaking changes.

## Non-Goals

- Automatic polyglot SDK generation (future enhancement).
- Schema migration automation for persisted historical payloads (handled elsewhere).

## User Stories

1. As a developer, I import a schema from the contracts package and get accurate inferred types instantly.
2. As an auditor, I can review all externally exposed payload shapes in a single directory tree.
3. As a maintainer, I publish a minor version of contracts and dependent packages update without manual edits to duplicated types.

## Functional Scope

- Directory structure: env/, http/, dto/, errors/, index re-exports.
- Version tagging & changelog entries for breaking changes.
- Zod schema definitions; type inference for internal usage.
- Build step to generate d.ts outputs consumed by other packages.

## Out of Scope

- Runtime schema negotiation across versions (clients expected to stay current within support window).
- Automatic OpenAPI spec generation (optional later addition).

## Acceptance Criteria

- GIVEN a new API endpoint WHEN schema is added THEN it resides in contracts package and is imported by endpoint handler (lint passes).
- GIVEN a change removing or renaming a field WHEN contracts build runs THEN dependent package type checks fail until updated.
- GIVEN an environment variable definition WHEN application starts THEN parsing uses contracts env schema and aborts on invalid values.
- All criteria trace back to R-025.

## Metrics / KPIs

- Out-of-layer schema occurrences (AST scan): 0.
- Time to add new schema + inference availability: <5 minutes baseline.
- Contract version adoption lag (p50): ≤7 days across packages.

## Risks & Mitigations

- Risk: Schema sprawl → Mitigation: Enforced directory conventions + review checklist.
- Risk: Large index causing slow type checking → Mitigation: Barrel modules segmented by domain.
- Risk: Silent breaking change → Mitigation: CI diff script flags deletions / type incompatibilities.

## Dependencies

- Centralized validation principle (R-017).
- Type-safe data access (R-016) for consistent model shapes.

## Security / Privacy Considerations

- Clear marking of restricted vs public-facing fields to prevent leakage.
- Redaction-aware schemas for logging contexts.

## Performance Considerations

- Build time kept minimal via incremental TS build; monitor schema compile time growth.

## Accessibility & UX Notes

- Developer README section explaining schema addition flow aids onboarding clarity.

## Operational Considerations

- Semantic version increments published via automated release pipeline.
- Changelog entries required for breaking schema changes (pre-merge check).

## Open Questions

- OQ-R025-01: Introduce OpenAPI/Swagger generation now or later?
- OQ-R025-02: Minimum supported version window (N vs N-1)?

## Alternatives Considered

- Distributed inline definitions: Rejected (duplication, drift risk).
- JSON Schema primary with Zod secondary: Rejected for DX overhead initially.

## Definition of Done

- Contracts package structure established and documented.
- CI enforcement for out-of-layer schema creation active.
- Versioning + changelog pipeline producing an initial release tag.

## Appendix (Optional)

Proposed directory tree snippet:

packages/contracts/
  env/
  http/
  dto/
  errors/
  index.ts

