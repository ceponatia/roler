# PRD: R-024 Contracts-First Development

Requirement ID: R-024
Source: requirements.md Section 4
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

All external interfaces (API routes, DB schemas, message payloads) derive from shared Zod schemas in the contracts package.

## Problem / Opportunity

Divergent ad-hoc interface definitions cause runtime mismatches and duplicated validation logic.

## Goals

- Single source of truth for request/response + persistence schemas
- Automatic type inference from schemas
- Validation at boundaries only; internal code trusts parsed types

## User Stories

1. As an API developer, I define a Zod schema and get both runtime validation and TypeScript types.
2. As a consumer, I can rely on published contract version to remain stable within a minor release.

## Functional Scope

- contracts package exporting Zod schemas + inferred types
- Pre-commit check ensuring every new API route references a contract schema
- Versioning strategy for breaking schema changes

## Acceptance Criteria

- GIVEN a new API endpoint THEN a corresponding schema file exists and is imported.
- GIVEN a schema change that is breaking THEN version bump + changelog entry recorded.

## Metrics / KPIs

- Number of endpoints lacking schema = 0
- Schema/lint check pass rate 100%

## Risks & Mitigations

- Risk: Schema sprawl → Mitigation: Naming conventions + folder taxonomy (api/, domain/, primitives/).

## Dependencies

- R-023 strict typing; DS-012..DS-014 schema standards

## Open Questions

- Should we auto-generate OpenAPI specs from Zod contracts?

## Definition of Done

- All existing endpoints refactored to contracts-first pattern; automated check enforced.
