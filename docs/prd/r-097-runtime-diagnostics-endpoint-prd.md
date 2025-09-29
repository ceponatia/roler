# PRD: R-097 Runtime Diagnostics Endpoint

Requirement ID: R-097
Source: requirements.md Section 20
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide authenticated diagnostics endpoint exposing non-secret runtime information (config summary, feature flags state, build/version, health indicators) for operators.

## Problem / Opportunity

Lack of centralized diagnostics slows incident triage and obscures configuration drift.

## Goals

- JSON endpoint with build metadata, enabled flags, sanitized config.
- Access restricted to GM/operator role (or internal auth header).
- Cache TTL to prevent performance impact.

## Non-Goals

- Full admin UI (endpoint only initially).

## User Stories

1. As an operator, I can fetch diagnostics to verify flag states post-deploy.
2. As a developer, I can confirm commit SHA and build time in production.
3. As a security reviewer, I verify no secret values present.

## Functional Scope

- Endpoint route + auth guard.
- Data aggregation: config (sanitized), flags, version, uptime, dependency versions.
- Cache layer (in-memory) with short TTL (e.g., 30 s).

## Out of Scope

- Log streaming.

## Acceptance Criteria

- GIVEN authorized request WHEN hitting endpoint THEN JSON includes version, uptime, flag list, sanitized config.
- GIVEN unauthorized request WHEN hitting endpoint THEN 403 returned.
- GIVEN secret (e.g., DATABASE_URL) WHEN present THEN only placeholder displayed.

## Metrics / KPIs

- Endpoint latency (<50 ms p95).
- Unauthorized access attempts (monitored).

## Risks & Mitigations

- Risk: Accidental secret exposure → Mitigation: explicit allowlist fields + tests.

## Dependencies

- R-094 (config), R-095 (flags), R-063..R-066 (observability data optional).

## Security / Privacy Considerations

- Strict authorization; rate limit to prevent probing.

## Performance Considerations

- Cached snapshot reduces repeated heavy operations.

## Operational Considerations

- Include in runbooks for incident triage.

## Open Questions

- OQ: Should we include queue backlog metrics here or separate endpoint?

## Alternatives Considered

- Multiple scattered endpoints — rejected (harder to audit & secure).

## Definition of Done

- Endpoint implemented with tests.
- Redaction verified.
- Docs updated.

---
