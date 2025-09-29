# PRD: R-004 Boundary Safety (Validation + Standardized Errors)

Requirement ID: R-004
Source: requirements.md Section 2
Status: Accepted
Owner: PRODUCT
Last Updated: 2025-09-29

## Summary

Boundary safety via centralized validation and standardized error responses across all ingress points; no unsafe types. Performance target: validation overhead p95 < 5 ms per request.

## Problem / Opportunity

Unvalidated inputs and unsafe typing cause security incidents, runtime faults, and type drift. Centralized, contract-first validation prevents invalid states early and ensures consistent errors.

## Goals

- 100% inbound validation using shared schemas.
- Standardized error shape with stable, enumerated error codes (contracts).
- Zero `any` and zero non-null assertions; enforced by lint/tsconfig per DS-002/DS-003.

## Non-Goals

- Logging/observability policies and redaction rules (defer to R-029 and R-063–R-067).

## Functional Scope

- Zod validation for params, query, body, and headers for HTTP routes, plus background job and internal queue payloads.
- Central error mapper to standardized payload with enumerated codes (reference contracts package); do not restate logging.
- Type inference exported and reused (infer types from Zod schemas; avoid duplication).

## Out of Scope

- Client SDK generation; code-mods for auto-insertion; detailed logging/metrics.

## Acceptance Criteria

- Missing validation import on any boundary file → CI fails.
- Invalid input → standardized error shape with a stable error code.
- Repo-wide zero `any` and zero non-null assertions (lint and tsconfig gates).

## Performance

- Validation overhead p95 < 5 ms per request/job/queue message.

## Security / Privacy

- Error payloads/redactions follow R-029 Logging & Context PRD policy. See `docs/prd/r-029-contextual-error-logging-prd.md`.

## Operational Considerations

- CI check enumerating `routes/api/**/+server.ts` endpoints versus schema imports; fails on gaps.

## Traceability Matrix

- R-004 ↔ Goals/Acceptance ↔ Tech Spec: CI scanner, `validateRequest`, `mapZodError` ↔ tests (schema, negative, mapper)
- R-017, R-026–R-027 ↔ Functional Scope ↔ Tech Spec: schema layer & inference ↔ unit tests
- R-028 & R-030 ↔ Error shape ↔ Tech Spec: enumerated codes ↔ mapper tests
- R-029 ↔ Link only (Logging & Context PRD); no duplication here
- DS-002/DS-003 ↔ Acceptance ↔ ESLint/tsconfig rules ↔ lint CI gate
