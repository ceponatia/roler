---
title: R-004 Boundary Safety Technical Specification
status: Draft
last-updated: 2025-09-23
related-prd: ../prd/r-004-boundary-safety-prd.md
revision: 0.2.0
---

## 1. Purpose & Scope

Implement 100% inbound validation across HTTP routes, background jobs, and internal queues; map validation failures to a standardized error shape with stable codes; enforce zero `any`/non-null assertions; and keep validation overhead p95 < 5 ms via schema cache and micro-benchmarks.

In-Scope:

- Zod schemas for every inbound shape (params, query, body, headers, job/queue payloads) in `@roler/schemas`.
- `validateRequest()` and `mapZodError()` helpers for structural parse and error mapping.
- CI scanner verifying every route file imports a schema.
- Enumerated validation error codes (VAL_*), defined in contracts.
- Type inference reuse from Zod schemas; no duplication.
- Pre-compilation/caching for performance.

Out-of-Scope (this spec):

- Logging/observability details (see R-029 Logging & Context PRD).
- Automated client SDK generation; runtime code-mod insertion.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| 100% inbound validated | Route scaffold rule + CI scanner | Fails build if missing |
| Standard error shape | Central mapper + Zod issue translation | Codes enumerated |
| Eliminate `any` & non-null | ESLint rules + tsconfig strict + audits | DS-002/DS-003 aligned |

## 3. High-Level Architecture

Components:

1. Schema Layer: Zod schemas in `@roler/schemas` (contracts-first).
2. Validation Utility: `validateRequest(event, schema)` performs parse and returns a typed object or mapped error.
3. Error Mapper: `mapZodError(zodError)` → standardized error payload with enumerated VAL_* codes.
4. Optional wrapper: Higher-order function to apply validation before handler logic.
5. CI Scanner: Script enumerates `routes/api/**/+server.ts` and ensures imports of schemas.
6. Micro-bench harness for validation latency.

## 4. Data & Schema Design (Zod-First)

Add / refine schemas for any uncovered routes (inventory script). Ensure discriminated unions for variant payloads. Branded ULIDs & ISO dates reused. All optionality explicit.

## 5. Hook Interface Contracts

Internal hooks (future) for pre-validation redaction or rate-limit tags; not exposed yet.

## 6. Registration & Loading Flow

Routes import schemas; wrapper attaches during module evaluation; no dynamic registry needed.

## 7. Versioning & Stability Model

Breaking changes to external request schemas require semver major bump; additive fields marked optional first.

## 8. Public API Surface (Initial)

- `validateRequest(event, schema): { data?: T; error?: StandardError }`.
- `mapZodError(zodError): StandardError`.
- Re-export inferred types (e.g., `CreateGameRequest`).

## 9. Error Handling & Codes

Enumerated codes live in the contracts package and include at minimum:

- VAL_SCHEMA_VIOLATION
- VAL_MISSING_FIELD
- VAL_TYPE_MISMATCH
- VAL_UNAUTHORIZED_FIELD

## 10. Security & Capability Model

Error payload shapes and any redactions must follow policy defined in R-029 Logging & Context PRD. Do not duplicate redaction rules here.

## 11. Performance Considerations

Schema cache keyed by schema reference; reuse compiled parse function; micro-benchmark to enforce <5 ms p95.

## 12. Observability & Metrics

Counters and histograms for validation can be added, but logging/observability policy is out of scope here; see R-029.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Missing schema import | CI fail | Ensures coverage |
| Validation timeout (rare) | Return generic standardized error | Resilience |

## 14. Implementation Plan (Step-by-Step)

1. Inventory endpoints & payload shapes.
2. Create / reconcile schemas.
3. Implement validation helper & mapper.
4. Add CI scanner script.
5. Add ESLint rule config (no non-null, no any).
6. Optional metrics (latency); logging policy deferred to R-029.
7. Add tests (positive, negative, redaction).
8. Benchmark parse latency.
9. Docs page (validation.md).

## 15. Testing Strategy

- Unit: schema edge cases, mapper translation.
- Integration: failing requests return standardized errors.
- CI scanner test fixture.

## 16. Documentation Plan

validation.md (overview, examples), error-codes update, contributing note.

## 17. Migration / Rollout

Add schemas incrementally behind failing CI gate; feature flag not required.

## 18. Assumptions

All routes reside under SvelteKit api path; background jobs already typed.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dev friction | Slower iteration | Scaffold generators |
| Performance regression | Latency | Precompile + bench |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Auto code-mod? | Defer; manual wrapper acceptable | Revisit |

## 21. Acceptance Criteria Traceability

Scanner test ↔ 100% coverage; negative tests ↔ standardized error; lint config ↔ zero any.

## 26. Traceability Matrix

- R-004 ↔ PRD Goals/Acceptance ↔ CI scanner, `validateRequest`, `mapZodError` ↔ tests (schema/negative/mapper)
- R-017, R-026–R-027 ↔ Schema layer & inference ↔ unit tests
- R-028 & R-030 ↔ Standardized error shape and codes ↔ mapper tests
- R-029 ↔ Logging & Context PRD only (link); no duplication
- DS-002/DS-003 ↔ ESLint/tsconfig strict rules ↔ lint CI gate

## 22. KPI Measurement Plan

Track validation_failure_total trend & incident correlation.

## 23. Future Extensions (Not Implemented Now)

Client SDK generation; schema diff visualizer.

## 24. Out-of-Scope Confirmations

No DSL, no automatic code-mod in this phase.

## 25. Summary

Establishes universal boundary safety through centralized Zod validation, standardized errors, and CI enforcement—reducing security risk and type drift with minimal latency impact.

---
END OF DOCUMENT
