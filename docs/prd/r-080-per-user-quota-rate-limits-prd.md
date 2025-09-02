# PRD: Per-User Quota & Rate Limits (R-080)

Requirement ID: R-080
Source: requirements.md Section 17 (Security & Access Controls)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Implement per-user rolling rate limits and daily quota enforcement for chat/generation endpoints to mitigate abuse and manage resource costs.

## Problem / Opportunity

Unbounded usage risks system overload and unfair resource consumption; structured limits maintain stability.

## Goals

- Sliding window or token bucket limit per minute.
- Daily quota counter persisted (Redis + expiration).
- Clear error response with retry guidance.

## Non-Goals

- Monetary billing integration.
- Per-endpoint granular dynamic pricing.

## User Stories

1. As an operator, I adjust rate limit thresholds via config.
2. As a player hitting limit, I receive message indicating wait time.
3. As a developer, I simulate quota exhaustion in tests.

## Functional Scope

- Middleware checking usage counters.
- Increment + expire pattern for daily counts.
- Configurable thresholds via env.

## Out of Scope

- Burst credit accumulation beyond window.

## Acceptance Criteria

- GIVEN user exceeds per-minute rate WHEN request arrives THEN RATE_LIMITED returned with Retry-After.
- GIVEN user daily quota exhausted WHEN further request THEN QUOTA_EXCEEDED returned.
- GIVEN thresholds updated WHEN service restarted THEN new limits enforced.
- All criteria trace back to R-080.

## Metrics / KPIs

- Rate Limit Hit Rate.
- Quota Exhaustion Count.

## Risks & Mitigations

- Risk: Hot key contention in Redis → Mitigation: Sharded keys or Lua script atomic ops.
- Risk: Clock skew negative impacts → Mitigation: Expiration reliance over wall time.

## Dependencies

- Error codes (R-079).
- Environment validation (R-078).

## Security / Privacy Considerations

- Avoid exposing raw thresholds in client messages; provide relative guidance.

## Performance Considerations

- Redis operations O(1); keep pipeline to minimize latency.

## Accessibility & UX Notes

- Friendly, plain-language limit messages.

## Operational Considerations

- Dashboard for limit events to tune thresholds.

## Open Questions

- OQ-R080-01: Implement exponential backoff suggestion vs static Retry-After?

## Alternatives Considered

- No limits — Rejected (abuse risk).

## Definition of Done

- Middleware + counters implemented.
- Tests for limit & quota scenarios.
- Metrics instrumentation.

## Appendix (Optional)

Key pattern example: `rate:{userId}:{minuteEpoch}`.

---
Template compliance confirmed.
