# PRD: Error Codes for Rate Limiting & Abuse Signaling (R-079)

Requirement ID: R-079
Source: requirements.md Section 17 (Security & Access Controls)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Standardize error codes enabling client-side handling of rate limit, abuse, and security-related responses distinct from generic failures.

## Problem / Opportunity

Ambiguous errors prevent clients from differentiating retryable vs fatal vs abuse scenarios. Clear codes improve UX and mitigate misuse.

## Goals

- Enumerated stable codes (e.g., RATE_LIMITED, QUOTA_EXCEEDED, PERMISSION_DENIED, ABUSE_DETECTED).
- Mapping to HTTP status + message.
- Client guidance for backoff or user messaging.

## Non-Goals

- Complex adaptive penalty algorithms.

## User Stories

1. As a client developer, I detect RATE_LIMITED and show retry-after timer.
2. As an operator, I monitor rate limit code frequency for tuning.
3. As a security analyst, I identify ABUSE_DETECTED events quickly.

## Functional Scope

- Central error factory assigning codes.
- Rate limit middleware using specific code when enforced.
- Metrics per code.

## Out of Scope

- Multi-tier dynamic pricing tiers.

## Acceptance Criteria

- GIVEN exceeded quota WHEN request processed THEN QUOTA_EXCEEDED code returned.
- GIVEN rate limiting triggered WHEN request blocked THEN RATE_LIMITED with Retry-After header.
- GIVEN unauthorized access WHEN blocked THEN PERMISSION_DENIED code present.
- All criteria trace back to R-079.

## Metrics / KPIs

- Rate Limit Event Count.
- Abuse Detection Event Count.

## Risks & Mitigations

- Risk: Code proliferation → Mitigation: Approval process before adding new codes.
- Risk: Clients ignore Retry-After → Mitigation: Documented guidelines + example SDK.

## Dependencies

- Error shape (R-028 to R-030).

## Security / Privacy Considerations

- Avoid exposing internal thresholds in messages.

## Performance Considerations

- Minimal overhead; static code mapping.

## Accessibility & UX Notes

- Error messages concise & screen reader readable.

## Operational Considerations

- Dashboard segmentation by code.

## Open Questions

- OQ-R079-01: Provide separate soft vs hard quota codes?

## Alternatives Considered

- Generic error messages — Rejected (poor handling differentiation).

## Definition of Done

- Enumerated codes documented.
- Middleware & factory tests.
- Metrics instrumented.

## Appendix (Optional)

Sample error JSON: `{ "code": "RATE_LIMITED", "message": "Too many requests" }`.

---
Template compliance confirmed.
