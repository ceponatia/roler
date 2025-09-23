# Instructions


## Core Stack

SvelteKit (TypeScript) • Postgres + pgvector • Redis • Ollama (local LLM + embeddings) • Prisma • Zod.
Auth: SPA → API routes (Zod-validated) → JWT/Redis session (GM vs Player roles).

## Fundamental Rules

- The gh-pages package is an isolated project, do not add it to the root package.json, tsconfig.json, pnpm workspace, or CI workflows.
- When making updates or changes to `docs/design/` or `docs/prd/`, update the `last-updated` field and `status` (Draft, In-Progress, Completed, Accepted, Approved).
- Follow the coding conventions in `docs/coding-conventions.md`.
- Follow the design specs and PRDs in `docs/design/` and `docs/prd/`. Stay in-scope without recommending out-of-scope features.
- Add new packages under `packages/` with their own `package.json`, `tsconfig.json`, and `vitest.config.ts`.
- Export all public symbols through the package root only (no deep imports).
- Update root `tsconfig.json` paths when adding new packages.
- Add new scripts under `scripts/` with `.mjs` extension.
- Use ESM only; no CommonJS unless required for compatibility.
- Add tests and ensure coverage for new code in packages.
- Obey in-file comments; ask if uncertain.
- No `any`, no non-null `!`, no unchecked casting.
- Zod at every external boundary (HTTP, DB raw, env). Use inferred types internally.
- Always declare return types on exported symbols.
- Prefer type aliases + discriminated unions. Exhaustive switches with `never`.
- No implicit `undefined`; optionality explicit and handled.
- Pure, small functions; avoid data bags without schemas.
- There should be one blank line in between import groups in .ts, .tsx files and no blank lines within groups. Groups are: 1) built-in modules, 2) external modules, 3) internal modules (absolute imports), 4) relative imports.

## TypeScript / Config Assumptions

Strict mode on; module target ES2022. ESM only. Imports from package roots, never deep `src/` paths (enforced by ESLint). Include extensions in relative imports when outside bundler context.

## Collections & Errors

Guard all indexing. Return Result or throw only at boundary handlers. Error shape (normalized) lives in contracts package (shared code).

## Validation Layers

Tier A: structural parse. Tier B: cross-field refinements. Tier C: mutability/policy/safety (partially pending for extensions + advanced policies).

## Schemas Package (@roler/schemas)

Contains primitives, enums, canonical + instance entities, LLM tool I/O, RAG, API contracts, system (user/session/permission/events), and early extension schemas:

- ExtensionManifest
- ExtensionRegistrationConfig
- StateTransaction

Keep new schemas flat (no cycles). Each exported schema: `NameSchema`; type: `Name = z.infer<typeof NameSchema>`.

## Extension System (Early Stage)

Manifest fields: hooks, chatHooks, budgets, concurrencyLimit, killSwitchEnabled, dataClassScopes, stateTransactionSupport.
Registration config: allow/deny, ordering overrides, performance thresholds (overhead warn/fail), strict vs fail-open.
StateTransaction: operations (set|increment|append) + conflictPolicy (first-wins|last-wins|weighted|resolver placeholder).
Runtime executor NOT implemented—do not assume hook invocation engine exists yet.

## Retrieval (RAG)

Retriever abstraction (pgvector now; Qdrant later). Strategy: instance-first via attribute atoms → canonical text chunk fallback.

## Scripts & Security

Use `scripts/safe-fs.mjs` for any dynamic repo traversal (root confinement, hidden path filtering, size caps). Coverage merging: `scripts/merge-lcov.mjs` outputs `coverage/monorepo-lcov.info`.

## Testing & Coverage

Per-package Vitest config emits `coverage/lcov.info`. Root command `pnpm test:ci` runs sequentially then `pnpm coverage:merge`. Workflow `.github/workflows/coverage-codacy.yml` uploads merged LCOV (Codacy token secret). Add new package: create `vitest.config.ts`, test scripts, ensure coverage.

## Monorepo Conventions

- Packages: `type: module`, exports map to built `dist/` only.
- No deep imports into `src/**` of another package.
- Use `readonly` where immutability intended; `as const` for literal tuples/objects.

## Performance & Budgets (Extensions Planned)

Target overhead <5% p95 per chat turn. Warn 5–7%, fail >7%. Enforce later in runtime layer.

## Pending / Do Not Implement Yet

- Extension runtime (ordering, concurrency enforcement, budget metering)
- Qdrant dual-read + outbox sync logic
- Advanced conflict resolution (weighted/resolver) logic

## Quick Checklist (When Adding Code)

1. Schema + tests (positive + at least one negative) if public input.
2. No `any`; narrow `unknown`.
3. Export through package root only.
4. Update docs only if external contract changes.
5. Add to coverage if new package.

## Reference Paths

Schemas: `packages/schemas/src/**`
Safe FS: `scripts/safe-fs.mjs`
Coverage Merge: `scripts/merge-lcov.mjs`
Workflows: `.github/workflows/*.yml`
Design Specs: `docs/design/`
PRDs: `docs/prd/`
