# PRD: Centralized Validation Layer (R-017)

Requirement ID: R-017
Source: requirements.md Section 3 (Platform & Technology)
Status: Draft
Owner: Product
Last Updated: 2025-08-29

## Summary

Provide a centralized contracts/validation layer (Zod-based) that defines all external input/output schemas, ensuring consistent validation, type inference reuse, and simplified audits across endpoints, jobs, and frontend forms.

## Problem / Opportunity

Distributed ad-hoc validation causes inconsistent data handling, security gaps, and duplicated types. Centralization reduces drift, guarantees uniform error shapes, and accelerates schema evolution.

## Goals

- Single source of truth for request/response and environment schemas.
- Automatic type inference eliminating manual interface duplication.
- Enforcement mechanism preventing out-of-layer validation definitions.

## Non-Goals

- Replacing runtime validation with compile-time only checks.
- Building a custom schema DSL separate from Zod.

## User Stories

1. As a developer, I import existing schemas instead of redefining shapes for each endpoint.
2. As a security auditor, I can locate all validation logic in one package for review.
3. As a frontend engineer, I reuse identical Zod schema for form validation and server-side parsing.

## Functional Scope

- Contracts package structure (env, dto, errors, index exports).
- Safe parse utilities with standardized error mapping.
- Lint/AST rule or script detecting new Zod schemas outside contracts.
- Versioning / changelog for breaking schema changes.

## Out of Scope

- Automatic client SDK generation (future enhancement).
- Runtime schema transformation across versions (handled by migration logic elsewhere).

## Acceptance Criteria

- GIVEN an endpoint handler WHEN adding a new request schema THEN schema defined in contracts and imported (lint passes, local definition flagged otherwise).
- GIVEN a duplicated schema structure defined outside contracts WHEN CI runs THEN job fails with actionable message.
- GIVEN a schema change (breaking) WHEN version bumped THEN changelog entry present describing migration path.
- All criteria trace back to R-017.

## Metrics / KPIs

- Out-of-layer schema violation count: 0.
- Time to add new endpoint schema (baseline tracked for DX improvement).
- Schema drift incidents: 0.

## Risks & Mitigations

- Risk: Monolithic mega-file → Mitigation: Directory segmentation + curated root index re-export.
- Risk: Unnoticed breaking changes → Mitigation: Version bump & changelog pre-commit hook.
- Risk: Performance overhead of validation → Mitigation: Use parse once at boundary; pass typed objects internally.

## Dependencies

- Type-safe data layer (R-016) for derived types.
- Error handling standard (R-028..R-030).

## Security / Privacy Considerations

- Input validation reduces attack surface (injection / malformed payloads).
- Redaction rules integrated into error responses to avoid sensitive echoing.

## Performance Considerations

- Minimize repeated validation by caching parse results where safe.

## Accessibility & UX Notes

- Unified validation messages enhance frontend accessibility consistency.

## Operational Considerations

- Schema versioning documented; release notes generated.
- CI step runs schema diff detection.

## Open Questions

- OQ-R017-01: Adopt automated schema diff tooling or custom script?
- OQ-R017-02: Enforce semantic versioning for schema packages automatically?

## Alternatives Considered

- Ad-hoc per-endpoint validation: Rejected (duplication & inconsistency).
- JSON Schema + codegen instead of Zod: Rejected for slower DX and duplication cost; revisit if cross-language needed.

## Definition of Done

- Contracts package structured & published.
- Lint/scan enforcement active (failing example validated).
- Versioning & changelog process documented.

## Appendix (Optional)

Example directory layout snippet.

---
Template compliance confirmed.
