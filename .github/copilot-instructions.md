# Instructions

## Project Overview

**Roler**: A TypeScript-based roleplaying game framework which uses an LLM for dynamic content generation.

**Stack**: SvelteKit (TypeScript) • Postgres + pgvector (primary datastore) • Redis (ephemeral cache & queues) • Ollama (Mistral Instruct 7B, nomic-embed-text) • Prisma ORM • Zod (contracts)
**Auth Flow**: SPA (SvelteKit) → API routes (+server.ts, validated w/ Zod) → Session token (JWT/Redis) → Role-scoped game/entity access (GM vs Player)

## General Instructions

- If there are instructions in comments in files, always obey them. Never change or go against them.
- If you are unsure about something, ask for clarification.
- Document your code and write clear commit messages.
- Keep your code DRY (Don't Repeat Yourself).
- Use meaningful variable and function names.

## TypeScript Instructions

- Follow guidelines set by eslint in `~/eslint.cjs`
- Follow formatting rules set by prettier in `~/prettierrc.cjs`
- Do not use `any` types. Prefer `unknown` + narrowing, or define a named type.
- Always declare return types on exported functions, public methods, and route handlers.
- Never use non-null assertions ( ! ). Narrow instead (type guards / `in` checks / predicates).
- Prefer type aliases & discriminated unions over enums/classes for domain models.
- No implicit `undefined`: model optionality must be explicit, and handle it.
- Validate all external inputs (HTTP, DB, env) wth Zod; use inferred types from schemas.
- Prefer `readonly` for object/array fields when mutation isn't required; use `as const` for literals.
- Exhaustive switches on union types with a `never` check.
- No ambient globals. Import types/functions explicitly.
- Use generics to preserve type information (e.g., API clients, repositories, cache wrappers).

### tsconfig Assumptions

- Assume `"strict": true`, `"noImplicitAny": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`, `"exactOptionalPropertyTypes": true`, `"noFallthroughCasesInSwitch": true`.
- Target ES2022+ modules; use ESM imports.

### Zod-first Boundaries

- For any request/response/DB boundary, create a Zod schema + type from z.infer.
- Parse data at the edge; inside the app, work with typed objects only.

### API & Function Design

- Prefer small pure functions with explicit inputs/outputs.
- No data bags (Record<string, unknown>) unless you also include a schema.
- For fallible ops, return a Result type over throwing.

### Collections & Mapping

- Don’t index into arrays/objects without checks. Use safe loops and guards.
- Use readonly arrays for data you don’t mutate: readonly Character[].

### Unknown Over Any

- If you must accept unknown input, narrow immediately.

### Async & Errors

- Don’t swallow errors. Return a Result or throw and catch at the boundary.
- Type the error shape you propagate ({ code: 'NotFound' | 'RateLimited'; message: string }).

### Avoid these anti-patterns

- any, non-null !, JSON.parse(...) as T, casting from unknown without validation, union types with overlapping shapes (no discriminator), mutable shared state.

## Architecture Patterns

### Backend (SvelteKit + Node 20)

- **Endpoints:** SvelteKit route handlers in apps/web/src/routes/api/**/+server.ts (one file per feature); examples include api/chat/+server.ts (RAG + SSE), api/canon/ingest/+server.ts, api/games/+server.ts, and api/games/[gameId]/clone/+server.ts.
- **Services:** (interfaces in packages): packages/contracts/ (Zod DTOs/types, single public surface), packages/ollama/ (thin chat/embeddings client), packages/rag/ (chunking, Retriever interface, PgRetriever/QdrantRetriever), packages/canon/ (validation/versioning/ingestion), packages/games/ (clone/patch/merge/re-embed); rule: import only from package roots (ESLint no-restricted-imports).
- **Validation & Errors:** Zod validators live in packages/contracts/** and are used at all boundaries (safeParse); one shared error shape in @contracts normalizes logs and HTTP mapping.
- **Jobs (BullMQ + Redis):** Deploy worker in apps/worker/ with queues ingest, reembed, sync-qdrant, apply-upstream; outbox table drives reliable Qdrant sync and enables dual-write cutovers.
- **Data (Prisma + Postgres + pgvector):** Prisma schema in packages/db/prisma/schema.prisma; core tables CanonObject, CanonVersion, Game, GameEntity, TextChunk(vector), AttrAtom(vector); JSONB for flexible state/overrides, GIN for filters, pgvector for similarity.
- **Retrieval (RAG):** Single Retriever interface with pluggable backends (pgvector now, Qdrant later) and field-aware retrieval (instance-first via AttrAtom → canonical fallback via TextChunk).
- **Streaming:** Server-Sent Events (SSE) from api/chat/+server.ts for token streams with optional retrieval/meta events.
- **Auth & Access:** Session cookie (JWT) + Redis session store with GM/Player guards in hooks/endpoints and per-game/instance authorization on all reads/writes.
- **Config & Ops:** apps/web/src/lib/config.ts reads ENV (DATABASE_URL, REDIS_URL, QDRANT_URL, OLLAMA_BASE_URL, ...); logging via Pino (requestId, gameId) with optional OpenTelemetry traces.
- **Testing:** Vitest for packages and API integration; Testcontainers for Postgres/Redis; seed fixtures for canon/entities.

### Frontend (SvelteKit + TypeScript)

- **Auth:** hooks.server.ts parses cookie/session and exposes locals.user for role-aware UI and route guards.
- **Data Fetching:** SSR via SvelteKit load/fetch; client mutations/cache via TanStack Query (or lightweight stores) scoped under src/lib/api/.
- **Forms:** Zod schemas from @contracts with SvelteKit actions using safeParse (optional sveltekit-superforms/felte resolvers).
- **Components:** Feature-based structure in apps/web/src/lib/features/** (components, stores, API co-located) with shared UI primitives in src/lib/ui/ (Tailwind + UI kit).
- **State & Realtime:** Svelte stores in src/lib/stores/ for chat (messages, assistant, streamChat() SSE) and retrieval context (last { fieldPath, text, ownerType }).
- **Routing & Pages:** routes/+page.svelte (main chat), routes/games/[gameId]/+page.svelte (session + entity inspector), and routes/entities/** (CRUD with normalization on submit).
- **Error & Loading:** +error.svelte and +layout.svelte provide toasts/spinners with optimistic updates on edits.
- **Styling:** TailwindCSS with utilities for stream container, context panel, and entity editor.

### Monorepo Conventions

- **Package Publishing & Module Format**

- Every package package.json MUST include "type": "module" and an "exports" map that points at built files under dist/. (Apps may also set "private": true.)
- Libraries default to ESM-only. Add a require entry only if there is a confirmed CJS consumer.
- tsconfig: "module": "NodeNext", "moduleResolution": "NodeNext", "target": "ES2022", "lib": ["ES2022"].
- Imports must include file extensions when importing local files (e.g., import { x } from "./foo.js").
- Bundled apps (e.g., SvelteKit in apps/web):
- tsconfig: "module": "ESNext", "moduleResolution": "Bundler".
- File extensions in imports are handled by the bundler.

- **Build & Tasks:** Turborepo pipelines (build → dist/**, lint per package, test depends on build) with affected-only CI.
- **Exports:** packages expose only dist via "exports"; deep imports are blocked by ESLint.
- **Contracts First:** endpoints and UIs import types/schemas exclusively from @contracts.

### Cross-Cutting Patterns

- **Vector Store Strategy (pgvector → Qdrant):** Start with pgvector while chunks <~5–10M and p95 ~150–250 ms is acceptable; plan Qdrant for 10M+ chunks and low-latency ANN + payload filtering; keep Postgres as source of truth, add outbox + sync worker, run dual reads behind a flag, flip after parity.
- **Normalization on Submit:** Deterministic regex rules with optional LLM fallback produce AttrAtom facts and canonical strings (e.g., eyes.color(blue)).
- **Pluggable Vector Store:** Env flag switches pgvector ↔ Qdrant through a single Retriever interface without app changes.
- **Outbox for Sync:** chunk_outbox ensures reliable mirroring to Qdrant and safe dual-read cutovers.
- **Security/Provenance:** AttrAtom.meta.restricted gates GM-only fields and prompt assembly; GameEntity.canonVersionId preserves lineage for diff/merge.
- **Errors & Logging:** One shared error shape in @contracts/errors unifies logs and responses across services.

### Testing (Per-Package Vitest & Coverage)

Each package has its own `vitest.config.ts` (no root config to avoid leakage). Coverage is enabled per package and emitted to `coverage/` inside that package with reporters `text` and `lcov` producing `coverage/lcov.info`.

Root CI runs each package in isolation (ensures per-package coverage output) using recursive scripts:

"test": "pnpm -r test"
"test:ci": "pnpm -r --workspace-concurrency=1 test:ci && pnpm coverage:merge"

Per-package `test:ci` adds `--coverage` to emit `coverage/lcov.info`.

Per-package scripts (example from `packages/schemas`):
"test": "vitest --run",
"test:watch": "vitest",
"test:ci": "vitest --run --reporter=dot"

After CI run, coverage reports are concatenated into `coverage/monorepo-lcov.info` via `scripts/merge-lcov.mjs` invoked by `pnpm coverage:merge`. Add new packages by creating a `vitest.config.ts` with coverage enabled and adding the standard test scripts.