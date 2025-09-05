---
title: R-004 Boundary Safety & Validation Technical Specification
status: Draft
last-updated: 2025-09-04
related-prd: ../prd/r-004-boundary-safety-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Centralize and enforce strict validation & standardized error handling for all ingress boundaries (HTTP routes, background job payloads, internal message queues) ensuring zero unsafe `any` usage and removal of non-null assertions while keeping p95 validation overhead <5 ms.

In-Scope:

- Zod schemas for every inbound shape (params, query, body, headers, queue payloads).
- Common `validate()` helper wrapping parse + error normalization.
- Lint / CI enforcement verifying each route file imports a schema.
- Standard error mapper => unified error shape.
- Type inference re-export from `@roler/schemas` avoiding duplication.
- Pre-compilation / caching of schemas for perf.

Out-of-Scope (this spec):

- Automated client SDK generation.
- Runtime code-mod insertion.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| 100% inbound validated | Route scaffold rule + CI scanner | Fails build if missing |
| Standard error shape | Central mapper + Zod issue translation | Codes enumerated |
| Eliminate `any` & non-null | ESLint rules + tsconfig strict + audits | DS-002/DS-003 aligned |

## 3. High-Level Architecture

Components:

1. Schema Layer: Zod schemas in `@roler/schemas` (contracts-first).
2. Validation Utility: `safeParseOrError(schema, data, context)` returns Result.
3. Error Normalizer: Maps ZodError → standardized error list with codes + redacted fields.
4. Route Decorator (functional): Higher-order wrapper applying validation pre-handler.
5. CI Scanner: Script enumerates `routes/api/**/+server.ts` ensures import of contracts.
6. Metrics Adapter: Counts validation passes/failures & latency.

## 4. Data & Schema Design (Zod-First)

Add / refine schemas for any uncovered routes (inventory script). Ensure discriminated unions for variant payloads. Branded ULIDs & ISO dates reused. All optionality explicit.

## 5. Hook Interface Contracts

Internal hooks (future) for pre-validation redaction or rate-limit tags; not exposed yet.

## 6. Registration & Loading Flow

Routes import schemas; wrapper attaches during module evaluation; no dynamic registry needed.

## 7. Versioning & Stability Model

Breaking changes to external request schemas require semver major bump; additive fields marked optional first.

## 8. Public API Surface (Initial)

- `validateRequest(event, schema)` (returns { data, error }).
- `mapZodError(zodError)`.
- Re-exported inferred types (e.g., `CreateGameRequest`).

## 9. Error Handling & Codes

Extend codes with:

- VAL_SCHEMA_VIOLATION
- VAL_MISSING_FIELD
- VAL_TYPE_MISMATCH
- VAL_UNAUTHORIZED_FIELD

## 10. Security & Capability Model

Redact sensitive fields in error details (list from configuration). Never echo raw secrets.

## 11. Performance Considerations

Schema cache keyed by schema reference; reuse compiled parse function; micro-benchmark to enforce <5 ms p95.

## 12. Observability & Metrics

Counters: validation_success_total, validation_failure_total{code}. Histogram: validation_latency_ms.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Missing schema import | CI fail | Ensures coverage |
| Validation timeout (rare) | Log + generic error | Resilience |

## 14. Implementation Plan (Step-by-Step)

1. Inventory endpoints & payload shapes.
2. Create / reconcile schemas.
3. Implement validation helper & mapper.
4. Add CI scanner script.
5. Add ESLint rule config (no non-null, no any).
6. Instrument metrics.
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
