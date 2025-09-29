# PRD: Type-Safe Data Access (R-016)

Requirement ID: R-016
Source: requirements.md Section 3 (Platform & Technology)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide a strongly typed data access layer (Prisma ORM baseline) ensuring compile-time safety for queries, automated schema evolution, and minimal abstraction overhead, enabling rapid iteration without compromising correctness.

## Problem / Opportunity

Hand-written queries without type inference invite runtime errors and drift between schema and application code. A type-safe ORM accelerates development while guarding against invalid field names, incorrect relations, and nullability mistakes under strict TS settings.

## Goals

- Generate fully typed client from single schema source.
- Enforce absence of `any` in data layer (alignment with DS standards).
- Provide thin repositories where needed for composition and test seams.

## Non-Goals

- Abstracting ORM completely behind custom DSL.
- Supporting multiple ORMs simultaneously.

## User Stories

1. As a developer, I get compile-time errors for invalid field references in queries.
2. As a maintainer, I regenerate types after schema change and see impacted code compile-break promptly.
3. As a reviewer, I can inspect migration diff output in CI before applying to production.

## Functional Scope

- Prisma (or equivalent) schema definition & migration pipeline.
- Code generation step integrated in build (pnpm build / dev).
- Repository helper functions for common patterns (pagination, soft delete) kept minimal.
- Lint rule / script scanning for disallowed `any` in data path.

## Out of Scope

- Full data access caching layer (later performance work).
- Multi-tenant sharding strategy.

## Acceptance Criteria

- GIVEN a schema change introducing new field WHEN types regenerate THEN code referencing old shape fails compilation until updated.
- GIVEN attempt to introduce `any` type in data layer WHEN lint runs THEN build fails with clear message.
- GIVEN migration generation in CI WHEN diff contains destructive change THEN manual approval label required before apply step proceeds.
- All criteria trace back to R-016.

## Metrics / KPIs

- Schema Drift Incidents: 0 (runtime mismatches).
- Migration Generation Time (baseline tracked for large schemas).
- Percentage of queries using typed client: 100%.

## Risks & Mitigations

- Risk: Over-abstraction via repositories leading to indirection → Mitigation: Keep repositories thin & allow direct ORM usage for complex queries with tests.
- Risk: Large monolithic schema file → Mitigation: Modular model segmentation with clear comments.
- Risk: Slow type generation on growth → Mitigation: Incremental generation caching where supported.

## Dependencies

- Node runtime (R-011).
- Relational datastore (R-012).

## Security / Privacy Considerations

- Ensure restricted fields flagged for exclusion in serialization layers (tie with R-059/R-077).

## Performance Considerations

- Monitor query plans; provide escape hatch for raw SQL with typed result mapping.

## Accessibility & UX Notes

- Developer docs include quick start for adding new model + migration.

## Operational Considerations

- Migration apply step gated in CI workflow.
- Rollback procedure documented for failed migration.

## Open Questions

- OQ-R016-01: Adopt Prisma migrate or use a separate migration tool for finer control?
- OQ-R016-02: Standard pattern for pagination (cursor vs offset) baseline?

## Alternatives Considered

- Raw SQL only: Rejected (higher maintenance & runtime risk).
- Custom codegen over SQL schemas: Rejected (reinventing established tooling).

## Definition of Done

- ORM integrated; generation step stable.
- Lint rule preventing `any` active.
- Migration review process documented + tested.

## Appendix (Optional)

Sample migration review checklist snippet.

---
Template compliance confirmed.
