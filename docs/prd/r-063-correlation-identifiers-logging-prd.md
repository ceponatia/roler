# PRD: Correlation Identifiers in Logging (R-063)

Requirement ID: R-063
Source: requirements.md Section 15 (Logging & Observability)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Every inbound request and background job execution must be assigned correlation identifiers (requestId, jobId, gameId, userId where applicable) propagated through logs and traces to enable precise troubleshooting and root cause analysis.

## Problem / Opportunity

Without consistent correlation IDs, assembling an end-to-end narrative of a user action or job run across services is slow and error-prone. Standardized IDs improve MTTR and support distributed tracing linkage.

## Goals

- Generate or accept inbound requestId header and propagate.
- Attach gameId and user role where available to each log entry.
- Provide helper to bind correlation context inside async flows.

## Non-Goals

- Cross-service global trace storage implementation.
- PII logging beyond IDs.

## User Stories

1. As an operator, I filter logs by requestId to view full timeline.
2. As a developer, I programmatically include correlation context with minimal code.
3. As a support engineer, I trace a reported issue using a single ID from UI error page.

## Functional Scope

- Middleware to create/parse requestId.
- Context storage (async-local) to access IDs anywhere in request lifecycle.
- Log formatter injecting correlation fields.

## Out of Scope

- Legacy log format transformation.
- Correlation of third-party API calls (placeholder future work).

## Acceptance Criteria

- GIVEN inbound request without requestId header WHEN processed THEN new UUID v4 assigned and logged.
- GIVEN outbound log WHEN emitted inside request THEN includes requestId and gameId if present.
- GIVEN background job WHEN executed THEN jobId present in all job logs.
- All criteria trace back to R-063.

## Metrics / KPIs

- Correlated Log Coverage (% logs containing requestId) ≥99%.
- Mean Time to Debug (qualitative baseline, target reduction post-implementation).

## Risks & Mitigations

- Risk: Lost context in async hops → Mitigation: AsyncLocalStorage wrapper tests.
- Risk: ID collisions → Mitigation: UUID v4 plus optional entropy check.

## Dependencies

- Structured logging framework (R-066).

## Security / Privacy Considerations

- Do not log raw session tokens; IDs are opaque.

## Performance Considerations

- Minimal overhead (<1 ms) for context initialization.

## Accessibility & UX Notes

- Error page shows requestId for support reference.

## Operational Considerations

- Include requestId in incident reports automatically.

## Open Questions

- OQ-R063-01: Support x-request-id passthrough vs always regenerate?

## Alternatives Considered

- No correlation (status quo) — Rejected (poor debuggability).
- Random short IDs — Rejected (collision risk, insufficient uniqueness).

## Definition of Done

- Middleware + context helper shipped.
- Tests verifying propagation.
- Documentation updated.

## Appendix (Optional)

Example log fragment (JSON keys order not guaranteed): `{ "level": "info", "msg": "retrieval start", "requestId": "...", "gameId": "g123" }`.

---
Template compliance confirmed.
