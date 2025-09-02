# PRD: End-to-End Game Flow Tests (R-086)

Requirement ID: R-086
Source: requirements.md Section 18 (Testing Strategy)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Automate E2E tests covering core gameplay loop: create canon object → create game entity instance → chat with retrieval context → modify entity → verify updated retrieval context.

## Problem / Opportunity

Unit/integration tests miss cross-layer regressions; E2E ensures primary user journeys remain functional.

## Goals

- Headless browser or API-driven scenario orchestration.
- Deterministic test data seeding.
- Assertions on retrieval context reflecting modification.

## Non-Goals

- Visual regression testing.

## User Stories

1. As a QA engineer, I run full flow test locally to validate release candidate.
2. As a product manager, I trust core loop remains intact across refactors.
3. As a developer, I quickly identify layer causing failure via structured step logs.

## Functional Scope

- Scenario script modules.
- Login/session simulation.
- Retrieval verification step (embedding updated or atoms changed).

## Out of Scope

- Multi-player concurrency simulation (separate tests).

## Acceptance Criteria

- GIVEN canonical object created WHEN instance generated THEN retrieval includes canonical attributes.
- GIVEN entity modified attribute WHEN chat executed THEN prompt context reflects new value.
- GIVEN test run WHEN completes THEN all steps pass within defined time budget.
- All criteria trace back to R-086.

## Metrics / KPIs

- E2E Runtime.
- Failure Rate per Run.

## Risks & Mitigations

- Risk: Flaky network timing → Mitigation: Retry with idempotent operations.
- Risk: Long runtime → Mitigation: Parallel scenario shards.

## Dependencies

- Prior layers (R-036, R-041 to R-045, R-070, R-071).

## Security / Privacy Considerations

- Test accounts isolated; no production data.

## Performance Considerations

- Time budget target <2 min for full suite.

## Accessibility & UX Notes

- Optional: Basic keyboard navigation step.

## Operational Considerations

- Nightly scheduled run plus PR gating subset.

## Open Questions

- OQ-R086-01: Include streaming timing assertions now or later?

## Alternatives Considered

- Manual smoke tests — Rejected (inconsistent, slower).

## Definition of Done

- E2E scripts implemented.
- CI integration.
- Docs with troubleshooting.

## Appendix (Optional)

Scenario step list sketch.

---
Template compliance confirmed.
