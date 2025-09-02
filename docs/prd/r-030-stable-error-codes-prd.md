# PRD: Stable Error Codes (R-030)

Requirement ID: R-030
Source: requirements.md Section 7 (Error Handling)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Define a versioned catalog of stable, machine-readable error codes referenced by all services so that clients and operators can rely on consistent semantics over time.

## Problem / Opportunity

Frequently changing or ad-hoc error identifiers break clients and complicate analytics. A stable catalog with deprecation workflow preserves backward compatibility while permitting iterative expansion.

## Goals

- Provide registry with unique codes, categories, and human descriptions.
- Enforce usage mapping to defined codes only (no unknown values).
- Support deprecation & replacement strategy without breaking existing clients.

## Non-Goals

- Automatic translation of legacy codes at runtime (clients expected to migrate by deprecation date).
- Multi-language localization of code identifiers.

## User Stories

1. As a frontend developer, I branch logic based on error.code stable across versions.
2. As an operator, I build dashboards aggregating error counts per category.
3. As a maintainer, I add a new code via documented PR process receiving validation.

## Functional Scope

- Central error-codes.ts manifest including: code, category, description, deprecated?, replacement?.
- Lint/AST rule verifying only listed codes are used.
- Deprecation policy & timeline documentation.
- Script to generate markdown catalog table for docs site.

## Out of Scope

- Telemetry ingestion pipeline changes (existing logging infra reused).
- Severity scoring system (category grouping suffices initially).

## Acceptance Criteria

- GIVEN a thrown error referencing code WHEN build runs THEN code exists in manifest or build fails.
- GIVEN a deprecated code usage WHEN lint runs post-grace THEN failure instructs replacement.
- GIVEN manifest change adding code WHEN CI runs THEN generated docs updated (diff visible).
- All criteria trace back to R-030.

## Metrics / KPIs

- Unknown Code Usage Count: 0.
- Deprecated Code Usage Past Sunset: 0.
- Code Addition Review Lead Time: ≤2 days (median).

## Risks & Mitigations

- Risk: Over-fragmentation of codes → Mitigation: Governance guidelines & category review.
- Risk: Unused codes accumulate → Mitigation: Periodic audit (quarterly) removing stale proposals.
- Risk: Manual sync errors for docs → Mitigation: Auto-generation script in CI.

## Dependencies

- Standardized error shape (R-028).
- Contextual error logging (R-029) for usage analytics.

## Security / Privacy Considerations

- Avoid codes revealing sensitive internal system details (generic but actionable).

## Performance Considerations

- Negligible; manifest lookup is O(1).

## Accessibility & UX Notes

- Clear code names improve assistive explanation mapping in UI.

## Operational Considerations

- Deprecation schedule communicated via CHANGELOG + docs.
- Monitoring dashboards keyed by code and category.

## Open Questions

- OQ-R030-01: Category taxonomy (e.g., VALIDATION, AUTH, RATE_LIMIT, SYSTEM)?
- OQ-R030-02: Grace period length for deprecations (1 release vs 2)?

## Alternatives Considered

- Free-form string codes: Rejected (inconsistent semantics).
- Numeric codes only: Rejected (harder readability without mapping table).

## Definition of Done

- Manifest created & lint rule active.
- Initial catalog published & doc generation script integrated.
- Deprecation workflow documented with example.

## Appendix (Optional)

Example manifest entry snippet:

```ts
export const ERROR_CODES = [
  { code: 'VALIDATION_FAILED', category: 'VALIDATION', description: 'Request body invalid' },
  { code: 'AUTH_REQUIRED', category: 'AUTH', description: 'Authentication required' }
] as const;
```

---
Template compliance confirmed.
