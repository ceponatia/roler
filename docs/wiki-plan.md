# Roler Wiki Expansion Plan (Atomic, Code-Backed)

This plan lists concrete, atomic pages to add to the Docusaurus wiki based on what’s implemented today. It intentionally avoids any references to PRDs/requirements/spec IDs in file names, titles, and content. Prefer linking to code over specs.

Constraints:

- No requirement IDs (e.g., “R-001”, “R-002”) in filenames, titles, or page body.
- Atomic pages: one schema/aspect per page.
- Map each page to real code paths; call out “implemented vs planned” succinctly.
- Keep navigation descriptive (Extensions, Retrieval, Concepts, Data, Ops).

## 1) Orientation

- Overview (exists): tighten copy to link out to repo docs folder.
- Getting Started (exists): include brief "how to contribute docs" checklist.
- Status (exists): keep the Done/WIP list synced with code.
- Glossary (exists): expand with: Extension, Hook, Manifest, State Transaction, Candidate, AdaptiveK, Partial Return, Budget, Capability, Data Class Scope.
- FAQ (exists): add answers for deployment, local search (later), and where code lives in monorepo.

## 2) Concepts (expand)

- Architecture (exists): add diagram later; for now, note SPA→API (Zod)→JWT/Redis sessions.
- Data Model (exists): add canonical vs instance examples; mention `TextChunk` ownership (`canon`|`instance`).
- Validation & Errors (exists): show normalized error shape (from schemas) and boundary rules; mention Result vs throw policy at boundaries.
- Retrieval (exists): add “deterministic ordering” note and AdaptiveK summary; link to RAG package.
- Security & Access (new): document dataClassScopes and capability allowlist concepts from extensions manifest/loader.

## 3) Extensions (atomic pages)

Add/expand pages mapped to code:

- Manifest Schema: `packages/schemas/src/system/extensions/extension-manifest.schema.ts`
  - id/name/version/coreApiRange
  - capabilities, dataClassScopes, unsafeCapabilities
  - hooks vs chatHooks, priority
  - hookBudgets (maxTokens/maxLatencyMs)
  - concurrencyLimit, killSwitchEnabled, stateTransactionSupport
  - peers (peerExtensions)
- Registration Config: `packages/schemas/src/system/extensions/extension-registration-config.schema.ts`
  - extensions allowlist, orderOverrides
  - capabilityAllowlist
  - performance thresholds (5/7 warn/fail), failOpen, strictMode
- Loader & Discovery: `packages/extensions/src/index.ts`
  - discoverExtensions(rootDir) looks for `rolerExtension.entry`
  - loadExtensions: semver check (coreApiRange), capability allowlist, duplicate id, peer resolution, order (priority desc, id asc)
  - loadExtensionsFromConfig: allowlist + overrides; orderOverrides placement
  - Guards: `shouldEnableExtensions*` env gating
- State Transactions: `packages/schemas/src/system/extensions/state-transaction.schema.ts` (+ runtime notes)
  - op: set/increment/append; payload rules; conflictPolicy (first/last/weighted/resolver)
  - note: advanced policies and runtime executor are not implemented
- Reference Extensions: quick stubs
  - @roler-ext/pre-save-age-check
  - @roler-ext/relationship-score-normalizer
  - @roler-ext/scene-retrieval-tags
  - Where manifest export lives (`dist/extension.js`) and intended behavior (stub for now)

## 4) Retrieval (atomic pages)

Add/expand pages mapped to code:

- Orchestrator: `packages/rag/src/lib/orchestrator.ts`
  - request/response (validated by `@roler/schemas`)
  - query cache flow (get/observe/miss/store), signature fields
  - embedder call, retriever call, AdaptiveK, post-process
  - partial policy (softPartialDeadlineMs, minResults, reason=SOFT_TIMEOUT)
  - timings and metrics increments
- Adaptive K: `packages/rag/src/lib/adaptive.ts`
  - second-query criteria and timing, candidate merge and de-dup by chunkId
- Retriever Interface: `packages/rag/src/lib/retriever.ts`
  - RetrieveOpts/Result; pgvector adapter shape
- Post-processing & Scoring: `packages/rag/src/lib/postprocess.ts`, `scoring.ts`
  - half-life recency, diversity min percent, filter predicate
- Config: `packages/rag/src/lib/config.ts`
  - defaults: baseK, maxKBoost, softPartialDeadlineMs, partialReturnPolicy.minResults, diversity, recency
  - env and feature gates (`env.ts`, `feature-gated.ts`)
- Caching: `packages/rag/src/lib/query-result-cache.ts`, `lru.ts`
  - LRU sizes and behavior; cache key strategy (`makeQueryKey`)
- Metrics: `packages/rag/src/lib/metrics.ts`
  - histograms: latency_total_ms, latency_vector_ms, latency_post_ms, latency_cache_ms
  - counters: retrieval_total, retrieval_cache_hit/miss, retrieval_adaptive_used, retrieval_partial
- Errors & Deadlines: `packages/rag/src/lib/errors.ts`, `deadline.ts`
  - error types and soft/hard deadlines

## 4) Data & Storage


- Text Chunks (new): map to `packages/schemas/src/text-chunk.schema.ts` and game/canon schemas
  - ownerType/ownerId/fieldPath
  - chunking & embedding guidance
- Canonical vs Instance (expand Data Model)
  - tie to `canon-content.schema.ts`, `canon-release.schema.ts`, `game-instance.schema.ts`

## 5) Scripts & Ops

- Safe FS (new): document `scripts/safe-fs.mjs`
  - root confinement, hidden path filter, size caps; when to use it
- Testing & Coverage (exists): point to monorepo coverage and Vitest patterns

## 6) Contributing to the Wiki

- CONTENT RULES (reiterate): no PRDs/requirements/specs inside wiki; link to repo paths
- Page style: frontmatter, concise sections, code-backed references to files
- Sidebar: add entries explicitly in `sidebars.ts`

## Proposed Pages to Add (file list)

Under `packages/docs-site/website/docs/`:

- concepts/security-and-access.md
- extensions/manifest.md
- extensions/registration-config.md
- extensions/loader-and-discovery.md
- extensions/state-transactions.md
- extensions/reference-extensions.md
- retrieval/orchestrator.md
- retrieval/adaptive-k.md
- retrieval/retriever.md
- retrieval/postprocessing-and-scoring.md
- retrieval/config.md
- retrieval/caching.md
- retrieval/metrics.md
- retrieval/errors-and-deadlines.md
- data/text-chunks.md

Optionally later:

- diagrams/sequence-orchestrator.mmd (Mermaid) and include in orchestrator page
- howto/benchmarks.md to document running retrieval benchmarks

## Notes

- Where the code disagrees with PRDs/specs, prefer code as the source of truth and mark deltas.
- Keep “implemented vs planned” callouts on each module page to avoid overpromising.

Navigation updates:

- Remove the “Modules” section from the sidebar.
- Add “Extensions” and “Retrieval” sections with the atomic pages above.
