# PRD: R-004 Boundary Safety & Validation

Requirement ID: R-004
Source: requirements.md Section 2
Status: Draft
Owner: PRODUCT
Last Updated: YYYY-MM-DD

## Summary

Enforce strong typing and centralized validation across all boundaries to prevent unsafe inputs and type drift.

## Problem / Opportunity

Unvalidated input and loose typing introduce security and reliability risks.

## Goals

- 100% inbound requests validated via shared schemas
- Standardized error shape across services
- Eliminate `any` and non-null assertions

## Non-Goals

- Custom DSL for validation (reuse Zod)

## User Stories

1. As a developer, I receive early runtime validation errors with clear messages.
2. As a security auditor, I confirm all ingress points enforce schemas.
3. As a maintainer, I rely on inferred types to avoid duplication.

## Functional Scope

- Zod validation for params/body/headers
- Central error mapper → standardized payload
- Type inference exported for internal use

## Out of Scope

- Automatic client generation (future consideration)

## Acceptance Criteria

- GIVEN an endpoint without validation THEN lint/CI fails.
- GIVEN invalid input THEN response returns standardized error with code.
- Codebase contains zero `any` and zero non-null assertions (enforced by lint rules + DS-002/DS-003).

## Metrics / KPIs

- Production incidents due to unvalidated input < 1%

## Risks & Mitigations

- Risk: Performance overhead → Mitigation: precompile schemas / cache parse results.

## Dependencies

- Contracts-first development (R-024)

## Security / Privacy Considerations

- Input redaction for restricted fields in error logs.

## Performance Considerations

- Validation adds <5 ms p95 per request.

## Operational Considerations

- CI check enumerating endpoints vs validation imports.

## Open Questions

- Do we need a code-mod to auto-insert validation wrappers?

## Alternatives Considered

- Ad-hoc manual validation (rejected: inconsistent)

## Definition of Done

- All endpoints validated, zero lint violations, error mapping tests pass.
