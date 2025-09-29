# PRD: Contextual Error Logging (R-029)

Requirement ID: R-029
Source: requirements.md Section 7 (Error Handling)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Augment all error logs with contextual metadata (requestId, gameId where relevant, user role) to improve traceability, triage speed, and forensic analysis while maintaining redaction guarantees. This PRD does not define validation mechanics; standardized error codes and shapes come from R-004 contracts.

## Problem / Opportunity

Sparse logs without context require costly correlation and delay incident response. Adding structured context enables direct grouping, faster RCA, and supports observability dashboards.

## Goals

- Ensure every error log entry includes standardized correlation fields.
- Provide helper to attach domain-specific context (entityId, jobId) uniformly.
- Maintain privacy by excluding restricted attributes (align with R-067, R-077).
- Cross-reference standardized error codes from R-004 (no redefining codes here).

## Non-Goals

- Full distributed tracing (handled in R-019).
- Logging successful events beyond scope (covered elsewhere).

## User Stories

1. As an operator, I filter errors by gameId to assess impact radius.
2. As a developer, I trace a failing request via requestId across logs.
3. As a security reviewer, I confirm restricted fields are always redacted or absent.

## Functional Scope

- Logger context middleware injecting base fields.
- Error logging utility merging domain meta safely.
- Redaction filter executing before serialization.
- Tests verifying presence/absence of expected fields.

## Out of Scope

- Anomaly detection based on error metadata.
- External log storage configuration specifics.

## Acceptance Criteria

- GIVEN an API error WHEN logged THEN entry contains requestId and (if available) gameId & userRole.
- GIVEN an error involving restricted attribute WHEN logged THEN attribute value is masked or omitted.
- GIVEN worker job failure WHEN logged THEN jobId & queue name fields included.
- All criteria trace back to R-029.

## Metrics / KPIs

- Error Logs Missing Context Fields: 0.
- Redaction Violations Detected in Tests: 0.
- Mean Time to Identify Impacted Game (MTTIIG): Reduced (baseline vs after rollout).

## Risks & Mitigations

- Risk: Over-logging increases cost → Mitigation: Level gating + sampling for repeated identical errors.
- Risk: Context injection performance cost → Mitigation: Lightweight context object & lazy evaluation.
- Risk: Inconsistent domain meta keys → Mitigation: Naming convention doc & utility enforcement.

## Dependencies

- Standardized error shape and codes (R-004, R-028, R-030).
- Structured logging & tracing infrastructure (R-019).

## Security / Privacy Considerations

- Redaction layer ensures restricted and PII fields removed/masked.
- Avoid logging secrets (env var blacklist test).

## Performance Considerations

- Measure overhead (<3% of request processing time) with sampling benchmarks.

## Accessibility & UX Notes

- Dev docs describing context fields aid onboarding (documentation accessibility).

## Operational Considerations

- Dashboards filtering by code + gameId + userRole.
- Alert on spikes correlated by gameId to flag localized incidents.

## Open Questions

- OQ-R029-01: Include sessionId or is that sensitive / ephemeral?
- OQ-R029-02: Standard set of domain meta keys beyond core (entityId, jobId)?

## Alternatives Considered

- Ad-hoc logging with manual context merges: Rejected (inconsistent coverage).
- Minimal logging without correlation IDs: Rejected (slow triage).

## Definition of Done

- Context middleware & utilities implemented.
- Redaction tests pass; sample log entries documented.
- CI check ensuring presence of context fields in error log unit tests.

## Appendix (Optional)

Example error log line (conceptual):

```json
{
  "level": "error",
  "msg": "entity.update.failed",
  "code": "DB_WRITE_FAILED",
  "requestId": "abc123",
  "gameId": "g789",
  "userRole": "GM",
  "entityId": "ent42"
}
```

---
Template compliance confirmed.
