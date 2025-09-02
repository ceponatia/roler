# PRD: Schema Evolution Tests (R-085)

Requirement ID: R-085
Source: requirements.md Section 18 (Testing Strategy)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Validate backward compatibility of canonical versioning and database schema migrations via automated evolution tests comparing pre/post-migration behavior.

## Problem / Opportunity

Schema changes can silently break older data interpretations. Evolution tests catch incompatibilities early.

## Goals

- Migration test harness applying previous -> current schema.
- Fixture snapshots for canon objects & versions.
- Compatibility assertions (no dropped required columns without defaults).

## Non-Goals

- Automatic migration rollback tooling.

## User Stories

1. As a developer, I add migration and see evolution test verifying compatibility.
2. As an operator, I trust upgrade path through CI validation.
3. As a data engineer, I identify breaking change before deploy.

## Functional Scope

- Historical schema baseline store.
- Migration runner verifying idempotency.
- Diff reporting of structural changes.

## Out of Scope

- Data anonymization for snapshots.

## Acceptance Criteria

- GIVEN breaking removal of non-null column WHEN test runs THEN failure with explanation.
- GIVEN additive nullable column WHEN test runs THEN passes.
- GIVEN migration re-run WHEN executed THEN no error (idempotent).
- All criteria trace back to R-085.

## Metrics / KPIs

- Migration Test Failure Rate.
- Time to Detect Incompatibility.

## Risks & Mitigations

- Risk: Snapshot bloat → Mitigation: Prune & compress older snapshots.
- Risk: False positives due to timestamp differences → Mitigation: Normalization in diff.

## Dependencies

- Data & persistence (R-036 to R-040).

## Security / Privacy Considerations

- Snapshots contain synthetic data only.

## Performance Considerations

- Limit test to critical tables for speed.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- Pre-deploy gate in CI pipeline.

## Open Questions

- OQ-R085-01: Keep how many historical baselines?

## Alternatives Considered

- Manual migration review only — Rejected (error risk).

## Definition of Done

- Harness & snapshots committed.
- Docs on adding new migration tests.
- Passing pipeline.

## Appendix (Optional)

Structural diff example: `ADD COLUMN foo TEXT NULL`.

---
Template compliance confirmed.
