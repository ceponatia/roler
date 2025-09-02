# PRD: Session-Based Authentication (R-031)

Requirement ID: R-031
Source: requirements.md Section 8 (Authentication & Authorization)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Implement session-based authentication using a secure HTTP-only cookie referencing server-side session state (Redis) to manage authenticated user identity and roles.

## Problem / Opportunity

Token-based stateless auth complicates server-side invalidation and role updates. Central session storage enables immediate revocation, simpler rotation, and reduced exposure of credentials to client JavaScript.

## Goals

- Secure, HTTP-only, same-site (lax/strict) session cookie.
- Server-side session store with TTL & renewal on activity.
- Logout & invalidation flows propagated immediately.

## Non-Goals

- Supporting third-party OAuth providers (handled later R-034 extension).
- Multi-factor authentication flows (future security enhancement).

## User Stories

1. As a user, I remain logged in across page reloads until session expiry.
2. As an operator, I can revoke a session and subsequent requests fail auth immediately.
3. As a developer, I can inspect session metadata (role, createdAt, lastAccess) in a controlled admin view.

## Functional Scope

- Session creation, renewal, revocation endpoints.
- Redis-backed session store with structured key namespace.
- Cookie issuance (secure, httpOnly, sameSite) + CSRF mitigation strategy.
- Session TTL and sliding expiration configuration.

## Out of Scope

- Social login and external identity providers.
- Persistent remember-me tokens beyond standard TTL.

## Acceptance Criteria

- GIVEN valid credentials WHEN login THEN cookie set with secure & httpOnly flags and session persisted.
- GIVEN revoked session WHEN subsequent request made THEN endpoint responds 401.
- GIVEN active session nearing expiry WHEN user activity occurs THEN TTL extended (sliding) up to max lifetime.
- All criteria trace back to R-031.

## Metrics / KPIs

- Session Revocation Propagation Time: <5s.
- Active Sessions Count (tracked) for capacity planning.
- Unauthorized Access Attempts vs successful logins ratio.

## Risks & Mitigations

- Risk: Session fixation → Mitigation: Regenerate session ID on privilege elevation.
- Risk: CSRF exploitation → Mitigation: SameSite cookie + anti-CSRF token on state-changing requests.
- Risk: Redis outage → Mitigation: Graceful fallback denies auth; health checks alert.

## Dependencies

- Central validation (R-026) for login payloads.
- Error codes (R-030) for auth failures.

## Security / Privacy Considerations

- Store minimal session data (userId, role, timestamps) no secrets beyond necessity.
- Encrypt sensitive attributes if added later.

## Performance Considerations

- Redis access latency monitored; connection pool sizing documented.

## Accessibility & UX Notes

- Clear login failure messages (general—not enumerating reasons) assist screen reader comprehension.

## Operational Considerations

- Session purge job for stale sessions beyond max lifetime.
- Configuration: SESSION_TTL, SESSION_SLIDING_WINDOW.

## Open Questions

- OQ-R031-01: Should we use rotating session secrets per deployment cycle?
- OQ-R031-02: Max sliding window duration (e.g., 7 days)?

## Alternatives Considered

- JWT stateless auth only: Rejected (harder server invalidation, role change propagation).
- LocalStorage tokens: Rejected (XSS risk, manual renewal complexity).

## Definition of Done

- Session middleware + endpoints implemented.
- Security headers & cookie attributes validated in tests.
- Revocation & renewal scenarios covered by integration tests.

## Appendix (Optional)

Example session record (conceptual):

```json
{
  "sid": "sess:abc123",
  "userId": "u42",
  "role": "GM",
  "createdAt": 1681234567,
  "lastAccess": 1681237890
}
```

---
Template compliance confirmed.
