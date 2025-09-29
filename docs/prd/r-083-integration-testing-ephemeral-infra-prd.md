# PRD: Integration Testing with Ephemeral Infra (R-083)

Requirement ID: R-083
Source: requirements.md Section 18 (Testing Strategy)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provision ephemeral Postgres + Redis (and vector extensions) for integration tests validating real data access, migrations, and job flows without shared state interference.

## Problem / Opportunity

Mocking persistence misses schema migration issues and query edge cases. Ephemeral infra catches integration bugs earlier.

## Goals

- Testcontainers (or equivalent) orchestration.
- Automatic schema migration + seed fixtures.
- Tear-down ensuring no residual state.

## Non-Goals

- Long-lived shared staging DB for tests.

## User Stories

1. As a developer, I run integration tests locally with one command.
2. As CI pipeline, I spin up isolated containers per run.
3. As a reviewer, I trust integration tests reflect real schema.

## Functional Scope

- Container orchestration module.
- Migration runner invocation.
- Seed data loader & cleanup.

## Out of Scope

- Performance load tests.

## Acceptance Criteria

- GIVEN integration test run WHEN started THEN containers launch within 30s.
- GIVEN migrations changed WHEN test run THEN they apply successfully.
- GIVEN test completion WHEN finished THEN containers stopped and removed.
- All criteria trace back to R-083.

## Metrics / KPIs

- Integration Test Runtime.
- Container Launch Failure Rate.

## Risks & Mitigations

- Risk: Flaky startup timing → Mitigation: Retry with exponential backoff.
- Risk: Resource contention in CI → Mitigation: Parallelism limits.

## Dependencies

- Data model (R-036), jobs (R-046).

## Security / Privacy Considerations

- Use ephemeral credentials; never reuse production secrets.

## Performance Considerations

- Cache container images to reduce cold start time.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- CI caching strategy for images.

## Open Questions

- OQ-R083-01: Include Qdrant container for dual-read tests initially?

## Alternatives Considered

- Pure mocks — Rejected (false confidence).

## Definition of Done

- Test harness implemented.
- Docs with run instructions.
- CI integration stable.

## Appendix (Optional)

Infra stack: Postgres+pgvector, Redis.

---
Template compliance confirmed.
