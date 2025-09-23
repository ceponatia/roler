# Copilot Prompt: Refactor R-004 PRD & Tech Spec (with clear separation from R-029)

You are refactoring two docs:

- `r-004-boundary-safety-prd.md`
- `r-004-boundary-safety-techspec.md`

## Objective

1. Make **R-004** strictly about:

- 100% **inbound validation** on *all boundaries- (HTTP routes, background jobs, internal queues).
- **Type-safe** code (no `any`, no non-null assertions) with lint/tsconfig enforcement.
- **Standardized error shape** with stable, enumerated error codes.

2.Ensure **R-029** ("Errors logged with contextual metadata") remains a **separate PRD/requirement** (do not fold it into R-004). Where R-004 mentions logging/redaction, keep it minimal and point to R-029 instead.

3.Keep alignment with the baseline requirements:

- R-004 (boundary safety), R-017 (centralized validation), R-026–R-027 (validate before logic; reuse inferred types), R-028–R-030 (error shape, contextual logging, error codes), DS-002/DS-003 (no `any`, no non-null).

## What to change

### PRD (`r-004-boundary-safety-prd.md`)

Refactor to this exact outline and scope:

- Summary: Boundary safety via centralized validation + standardized error responses; no unsafe types. (Keep perf target: validation p95 < 5 ms).
- Problem/Opportunity: Keep minimal.
- Goals (only):

  - 100% inbound validation using shared schemas.
  - Standardized error shape (contracts).
  - Zero `any` / non-null assertions (lint enforced).
- Non-Goals: Logging/observability details (defer to R-029 & R-063–R-067).
- Functional Scope:

  - Zod validation for **params/query/body/headers + job/queue payloads**.
  - Central error mapper → standardized payload + enumerated codes (reference contract; don’t restate logging).
  - Type inference exported (reuse inferred types).
- Out of Scope: Client SDK generation; code-mods; detailed logging/metrics.
- Acceptance Criteria (tighten wording):

  - Missing validation import → **CI fails**.
  - Invalid input → standardized error shape with stable code.
  - Repo-wide zero `any` / non-null (lint & tsconfig).
- Performance: Validation overhead **p95 < 5 ms** per request.
- Security/Privacy: Only say “error payloads/redactions follow R-029 policy.” (Don’t duplicate R-029 rules.)
- Operational Considerations: CI check enumerating endpoints vs schema imports.

### Tech Spec (`r-004-boundary-safety-techspec.md`)

Keep this the **implementation** of R-004 only. Tighten to:

- Purpose & Scope: 100% validation across **HTTP + jobs + queues**; standard error mapping; zero `any`/non-null; **p95 < 5 ms** (keep schema cache + micro-benchmarks).
- Design:

  - Zod schemas in `@roler/schemas`
  - `validateRequest()` + `mapZodError()` helpers
  - CI scanner verifying every route file imports a schema
  - ESLint/tsconfig strict rules for DS-002/DS-003
  - Enumerated error codes (VAL\_\*) in contracts (no logging policy here—point to R-029).
- Out of Scope: Anything about logging pipelines/observability dashboards—those belong to R-029 and R-063–R-067.
- Performance & Testing: Keep cache, micro-benchmarks, and tests (positive/negative/redaction). Redaction tests should assert the **shape**, but the **policy** lives in R-029.
- Acceptance Criteria Traceability: Scanner coverage ↔ 100% validation; negative tests ↔ standardized errors; lint config ↔ zero `any`/non-null.

### R-029 PRD (separate doc, if not present)

- Goal: “All error events are logged with **contextual metadata** (requestId, gameId, user role), with **redaction** and **stable error codes**.” Cross-reference error codes from R-004.
- Scope: Logging fields, correlation IDs, privacy/redaction policy, sampling, sinks; **no validation mechanics** here.
- Acceptance Criteria:

  - Every error log includes context fields
  - PII/GM-only fields are redacted per policy
  - Logs link to standardized error codes (from R-004 contracts)

## Deliverables

- Updated `r-004-boundary-safety-prd.md` (scoped as above).

- Updated `r-004-boundary-safety-techspec.md` (implementation only).
- (If needed) New/Updated `r-029-logging-prd.md`.
- A Traceability Matrix (append to both docs) mapping requirement → PRD section → Tech Spec section → tests/CI:

  - R-004 ↔ PRD Goals/Acceptance ↔ TechSpec CI scanner, `validateRequest`, `mapZodError` ↔ tests (schema/negative/mapper)
  - R-017, R-026–R-027 ↔ PRD Functional Scope ↔ TechSpec schema layer & inference ↔ unit tests
  - R-028 & R-030 ↔ PRD error shape ↔ TechSpec enumerated codes ↔ mapper tests
  - R-029 ↔ R-029 PRD only (link from R-004, don’t duplicate)
  - DS-002/DS-003 ↔ PRD Acceptance ↔ ESLint/tsconfig rules ↔ lint CI gate

## Editing constraints & style

- Preserve front-matter (`status`, `last-updated`, `revision`), use semantic doc versions.
- Keep perf budget p95 < 5 ms in both docs (PRD target; Tech Spec method).
- Replace any logging/observability detail in R-004 docs with a link like: “See R-029 Logging & Context PRD for policy.”
- Ensure all references to “contracts-first” remain intact (R-024).

## Post-refactor checks (have Copilot update/add)

- CI Gate: script that fails if any `routes/api/**/+server.ts` lacks a schema import.
- Lint: enforce DS-002/DS-003; fail on `any` / non-null.
- Tests: Unit (schema edges & mapper), Integration (invalid payload → standardized error), Scanner fixture.
- Traceability Matrix appended to both docs (R-IDs → sections → tests/CI).

Make the changes now and show me the diffs for each file.
