# PRD: R-094 Validated Runtime Configuration

Requirement ID: R-094
Source: requirements.md Section 20
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

All runtime configuration is loaded from environment variables validated at startup (R-078, R-025) with immediate abort on invalid or missing critical settings, ensuring predictable deployments.

## Problem / Opportunity

Silent misconfiguration leads to latent runtime errors and security lapses; early fail-fast improves reliability and developer feedback.

## Goals

- Single schema (Zod) covers all required env vars.
- Startup fails with clear error message when invalid.
- Documentation auto-generated or synchronized.

## Non-Goals

- Dynamic live reloading of env variables.

## User Stories

1. As a developer, I see a descriptive error if a required variable is missing.
2. As an operator, I can view a sanitized diagnostics endpoint listing non-secret config values (R-097).
3. As a security reviewer, I confirm secrets never exposed via logs or endpoints.

## Functional Scope

- Env schema definition & parse.
- Typed config module consumed across app.
- Redaction rules for secrets.

## Out of Scope

- Secrets rotation automation.

## Acceptance Criteria

- GIVEN missing required variable WHEN app starts THEN process exits with error code & message.
- GIVEN invalid format (e.g., non-URL) WHEN parsed THEN validation error emitted.
- GIVEN diagnostics endpoint WHEN called THEN only non-secret settings returned.

## Metrics / KPIs

- Startup config validation failures (should trend to zero).

## Risks & Mitigations

- Risk: Drift between schema & docs → Mitigation: generate docs from schema build step.

## Dependencies

- R-025 (schema), R-097 (diagnostics endpoint), R-078.

## Security / Privacy Considerations

- Never log full secret values; only key names.

## Performance Considerations

- Single parse pass at startup; negligible runtime cost.

## Operational Considerations

- Include config hash in startup log for change tracking (no secret content).

## Open Questions

- OQ: Should optional vars have defaults or require explicit specification?

## Alternatives Considered

- Ad-hoc per-module env access — rejected (inconsistent validation).

## Definition of Done

- Schema implemented & enforced.
- Docs updated automatically.
- Tests cover missing/invalid cases.

---
