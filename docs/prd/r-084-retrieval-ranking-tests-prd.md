# PRD: Retrieval Ranking Tests (R-084)

Requirement ID: R-084
Source: requirements.md Section 18 (Testing Strategy)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Implement deterministic tests validating retrieval ordering logic (instance-first, fallback canonical) and latency adherence to performance targets.

## Problem / Opportunity

Unverified ranking changes risk silent relevance regressions. Automated tests guard contract.

## Goals

- Golden test fixtures for retrieval ordering.
- Latency budget test verifying p95 under threshold in integration context.
- Score sanity assertions (no negative values beyond expected range).

## Non-Goals

- Full semantic relevance evaluation benchmark suite.

## User Stories

1. As a developer, I catch ordering regression before merge.
2. As an operator, I ensure retrieval remains within latency budget.
3. As a researcher, I baseline improvements objectively.

## Functional Scope

- Fixture generator creating entities & attributes.
- Test harness executing retrieval queries.
- Latency measurement utilities.

## Out of Scope

- ANN approximation variance testing (future specialized backend).

## Acceptance Criteria

- GIVEN retrieval test WHEN run THEN instance attribute hits precede canonical chunk hits.
- GIVEN performance harness WHEN run THEN p95 latency ≤250 ms (PT-140) under fixture size.
- GIVEN unrecognized field filter WHEN applied THEN empty result set returned.
- All criteria trace back to R-084.

## Metrics / KPIs

- Retrieval Test Pass Rate.
- Latency p95 vs target.

## Risks & Mitigations

- Risk: Flaky latency due to noisy CI → Mitigation: Warm-up runs + median-of-N.
- Risk: Fixture drift → Mitigation: Versioned fixture generator.

## Dependencies

- Retrieval interface (R-041 to R-045).

## Security / Privacy Considerations

- Synthetic data only for tests.

## Performance Considerations

- Limit fixture size to keep test runtime acceptable.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- Latency regression creates issue automatically.

## Open Questions

- OQ-R084-01: Integrate recall/precision evaluation later?

## Alternatives Considered

- Manual ad-hoc queries — Rejected (non-repeatable).

## Definition of Done

- Ranking & latency tests implemented.
- CI gating retrieval latency.
- Docs for adding new fixture scenarios.

## Appendix (Optional)

Ordering rule summary: instanceAttrs → canonChunks.

---
Template compliance confirmed.
