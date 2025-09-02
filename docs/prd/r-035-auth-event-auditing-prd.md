# PRD: Auth Event Auditing (R-035)

Requirement ID: R-035
Source: requirements.md Section 8 (Authentication & Authorization)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Emit structured log events for authentication lifecycle (login, logout, role change, failed attempt) enabling audit trails, anomaly detection, and compliance reporting.

## Problem / Opportunity

Lack of granular auth event logging hinders investigation of security incidents or usage metrics. Standard event schema improves observability and risk management.

## Goals

- Unified event schema (timestamp, userId, eventType, metadata).
- Coverage of success & failure paths.
- Correlation with requestId & sessionId.

## Non-Goals

- Real-time SIEM integration (export pipeline handled externally).
- Detailed geo/IP enrichment (basic IP optional only).

## User Stories

1. As a security analyst, I filter failed login attempts over time.
2. As an operator, I trace a role escalation event to preceding logins.
3. As a maintainer, I add a new auth event type with test coverage quickly.

## Functional Scope

- AuthEvent emitter utility.
- Middleware hooks at login/logout endpoints.
- Role change / permission update logging.
- Failed attempt classification (invalid credentials vs locked account).

## Out of Scope

- Alert threshold engine (external monitoring config).
- Data retention policy management.

## Acceptance Criteria

- GIVEN successful login WHEN event emitted THEN log includes userId and sessionId.
- GIVEN failed login attempt WHEN emitted THEN includes reason code (e.g., INVALID_CREDENTIALS).
- GIVEN role change WHEN executed THEN event recorded with oldRole/newRole.
- All criteria trace back to R-035.

## Metrics / KPIs

- Failed Login Rate (%).
- Role Change Events per Period.
- Event Emission Failure Count: 0.

## Risks & Mitigations

- Risk: Sensitive data in logs → Mitigation: Strict field allowlist.
- Risk: Event loss under load → Mitigation: Async non-blocking logger with backpressure safeguards.
- Risk: Overly verbose logs → Mitigation: Sampling non-critical failure bursts.

## Dependencies

- Logging & tracing (R-019).
- Session authentication (R-031).

## Security / Privacy Considerations

- Exclude raw credentials; only reason codes.
- Potential PII minimization strategy documented.

## Performance Considerations

- Asynchronous emission; measured overhead negligible (<1ms).

## Accessibility & UX Notes

- UI may surface friendly messages mapped from reason codes.

## Operational Considerations

- Dashboards: failed logins trend, role change audit.
- Alert if failed login spike crosses threshold.

## Open Questions

- OQ-R035-01: Retain events for how long (30/90 days)?
- OQ-R035-02: Include user agent hash for anomaly clustering?

## Alternatives Considered

- Minimal logging only on failures: Rejected (incomplete trail).
- DB persistence of all events now: Rejected (start with log aggregation only).

## Definition of Done

- Event schema & emitter implemented.
- Tests assert presence of required fields.
- Documentation of event types published.

## Appendix (Optional)

Sample event:

```json
{ "type": "auth.login", "userId": "u42", "sessionId": "s123", "requestId": "r1" }
```

---
Template compliance confirmed.
