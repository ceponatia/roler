# PRD: Inbound Request Validation (R-026)

Requirement ID: R-026
Source: requirements.md Section 6 (Validation & Schema Strategy)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Validate every inbound request (HTTP, streaming initiation, job payload, CLI ingestion) against a centralized schema before executing business logic, ensuring malformed or unauthorized data is rejected early with standardized errors.

## Problem / Opportunity

Unvalidated inputs risk runtime errors, security vulnerabilities (injection, over-posting), and inconsistent error responses. Edge validation plus shared error shape (R-028) reduces downstream guard code, improves reliability, and narrows attack surface.

## Goals

- Enforce parse/validate step at all external boundaries.
- Provide consistent 4xx error responses with stable codes.
- Minimize duplicate validation logic inside service internals.

## Non-Goals

- Implementing a WAF layer (network-level concerns outside scope).
- Inline auto-correction of malformed inputs (reject instead).

## User Stories

1. As a developer, I call a parse function once and receive a typed object or standardized error.
2. As a security auditor, I confirm no endpoint bypasses schema validation.
3. As a frontend developer, I rely on consistent error code + field messages for form UX.

## Functional Scope

- Middleware / wrapper enforcing schema.safeParse for each endpoint.
- Streaming (SSE/WebSocket) handshake validation.
- Job consumer payload validation before processing.
- Shared error normalization mapping Zod issues to contract codes.

## Out of Scope

- Automatic request replay sanitization.
- Schema evolution fallback translation (handled elsewhere).

## Acceptance Criteria

- GIVEN an HTTP request with invalid body WHEN validation runs THEN response returns 400 with standardized error code list.
- GIVEN a streaming connection request missing required auth WHEN validated THEN connection is rejected before handler logic.
- GIVEN a job payload failing schema WHEN worker processes THEN job fails fast with logged validation error (no partial side effects).
- All criteria trace back to R-026.

## Metrics / KPIs

- Validation Bypass Incidents: 0.
- Mean Validation Overhead: ≤5% request time (sampled).
- Percentage of endpoints with registered validator: 100% (automated scan).

## Risks & Mitigations

- Risk: Performance overhead → Mitigation: Parse once and pass typed object; micro-benchmark critical schemas.
- Risk: Missed new endpoint registry → Mitigation: ESLint rule / code mod scanning for handlers missing validator import.
- Risk: Verbose error leaks internals → Mitigation: Map raw Zod messages to curated user-facing codes/messages.

## Dependencies

- Shared schema layer (R-025).
- Standardized error shape (R-028..R-030).

## Security / Privacy Considerations

- Early rejection reduces processing of malicious payloads.
- Sensitive values validated but never echoed back verbatim.

## Performance Considerations

- Cache compiled schema validators where feasible.

## Accessibility & UX Notes

- Consistent field error format improves screen reader narration of form errors.

## Operational Considerations

- Metrics instrumentation: validation_failures_total, validation_duration_ms histogram.
- Alert on sustained spike of validation failures (potential abuse or client bug).

## Open Questions

- OQ-R026-01: Introduce rate limiting synergy for repeated invalid requests?
- OQ-R026-02: Redact which fields in error details vs show full path list?

## Alternatives Considered

- Ad-hoc manual validation per endpoint: Rejected (inconsistent, error prone).
- JSON Schema runtime validator over Zod: Rejected for slower DX; revisit for polyglot.

## Definition of Done

- Middleware / wrappers implemented & enforced in CI.
- Metrics & logging in place for validation outcomes.
- All existing endpoints updated to use shared validation path.

## Appendix (Optional)

Example validation wrapper (pseudo):

```ts
export async function validatedRoute(s, schema, handler) {
  const parsed = schema.safeParse(await s.request.json());
  if (!parsed.success) return errorResponse(parsed.error);
  return handler(parsed.data);
}
```

---
Template compliance confirmed.
