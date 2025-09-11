---
title: R-002 Low-Latency Retrieval Technical Specification
status: Accepted
last-updated: 2025-09-04
related-prd: ../prd/r-002-low-latency-retrieval-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Deliver a retrieval subsystem that supplies deterministic, relevant contextual slices to LLM prompts with p95 end-to-end latency ≤ 250 ms for typical corpus size (Target Persona: interactive narrative sessions). Must degrade gracefully under transient slowness by returning a partial ordered subset flagged as partial while preserving deterministic ordering for identical inputs.

In-Scope:

- Query planning & execution pipeline (attribute + vector + recency fusion) optimized for low latency.
- Hybrid result assembly (vector similarity + lightweight filters + recency prioritization).
- LRU / time-window caches (embedding reuse, query result reuse, hot entity contexts).
- Timeout & partial fallback policy (soft + hard deadlines).
- Deterministic ordering function (score tie-break & stable sort keys).
- Latency & quality metrics (p50/p95/p99, timeout rate, partial-return rate).
- Observability integration (structured spans/events, metrics export) and alerting thresholds.
- Configuration surfaces (tunable k, cache sizes, deadlines) validated via Zod.

Out-of-Scope (this spec):

- ANN specialized backend migration (handled by future requirements).
- Cross-region replication & geo-routing.
- Multi-vector modality support (future extension).

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| p95 ≤ 250 ms | Latency budget model + timing instrumentation + adaptive k | Budget allocation table section 11 |
| Deterministic ordering | Stable composite score + deterministic tie-break fields | (similarity desc, recency decay, id lexical) |
| Graceful timeout fallback | Two-phase deadline controller returning partial subset | PartialFlag + warning enum |
| Partial context flagged | Response envelope includes `partial: true` + reason | Contracts update |
| Real-time percentiles dashboard | Metrics histograms + exporter integration | p50/p95/p99 + timeouts |
| Cache for recent embeddings/results | In-memory LRU + window invalidation | Configurable sizes |
| Quick ingestion visibility | Write-through invalidation on entity update | Subscription invalidates cached keys |

## 3. High-Level Architecture

Components:

1. Retrieval Orchestrator: High-level function assembling final ordered context set; enforces deadlines.
2. Query Planner: Builds plan combining vector search (pgvector) + attribute filters + recency weighting.
3. Vector Retriever (existing interface): Executes similarity queries with parameterized k and optional field filtering.
4. Post-Processor: Applies score normalization, recency decay, de-duplication, filtering of restricted attributes, and deterministic sorting.
5. Cache Layer: Multi-tier in-memory segment:
   - Embedding Cache (key: text hash → embedding vector).
   - Query Result Cache (key: query signature → ordered chunk IDs + scores + stamp).
   - Entity Hot Context Cache (key: entityId → serialized context block).
6. Deadline Controller: Tracks elapsed time; triggers early return with partial result if soft deadline exceeded (soft < hard).
7. Metrics & Tracing Adapter: Wraps each stage with high-resolution timers; emits structured spans and counters.
8. Config Module: Zod-validated configuration (timeouts, k, cache sizes, decay constants, max partial fraction).
9. Quality Guards: Ensures minimum diversity (e.g., not all chunks from a single entity) under partial fallback.

## 4. Data & Schema Design (Zod-First)

New / Updated Schemas (in `@roler/schemas/rag` or `system/retrieval`):

- RetrievalConfigSchema
  - maxTotalDeadlineMs (number, default 250)
  - softPartialDeadlineMs (number, default 180)
  - baseK (number, default 32)
  - maxKBoost (number, default 16) (adaptive increase when earlier filters drop many results)
  - embeddingCacheSize (number, default 5_000)
  - queryResultCacheSize (number, default 2_000)
  - entityContextCacheSize (number, default 1_000)
  - recencyHalfLifeMinutes (number, default 240)
  - diversityMinEntityPercent (number, default 0.25)
  - partialReturnPolicy: { minResults: number (default 8); tag: string (enum) }
  - enableAdaptiveK (boolean, default true)

- RetrievalRequestSchema
  - queryText (string)
  - gameId (ulid)
  - actorEntityId? (ulid)
  - limit? (number) (<= baseK + maxKBoost)
  - includeRestricted? (boolean) (only if permission context allows)

- RetrievalResponseSchema
  - items: readonly array of { chunkId: ulid; entityId: ulid; score: number; reasonBits: readonly string[] }
  - partial: boolean
  - partialReason?: 'SOFT_TIMEOUT' | 'HARD_TIMEOUT' | 'ADAPTIVE_LIMIT'
  - timings: { totalMs: number; vectorMs: number; postProcessMs: number; cacheMs: number }
  - stats: { kRequested: number; kUsed: number; candidateCount: number; filteredCount: number }

- Internal Score Model (no external schema): composite score = `wSim * sim + wRec * recency + wDiversity * diversityBoost` (weights configurable; default constants frozen in config module). Deterministic sort by (-compositeScore, -sim, updatedAt desc, chunkId asc).

All inputs validated at entry. No `any`; use branded ULIDs already defined.

## 5. Hook Interface Contracts

Augment existing Retrieval interface (non-breaking) by adding optional hook points (future interplay with R-001 extensions but minimal here):

- prePlan?(request, context) → may inject additional filter constraints.
- postVector?(request, rawResults[]) → may adjust provisional scores (bounded by multiplier clamp).
- preReturn?(request, finalItems[]) → may append metadata.

All hook arrays executed sequentially; failures logged and skipped (no extension abort logic defined here). Config flag can disable hooks for deterministic perf benchmarking.

## 6. Registration & Loading Flow

For this requirement core relies on existing package loading; no new external plugin discovery in scope. Hook integration from R-001 will reuse same orchestrator once available.

Flow:

1. Validate request via RetrievalRequestSchema.
2. Check query result cache; if hit and still valid (no invalidation stamp newer) return cached subset (respect deterministic limit ordering).
3. Embed query text (embedding cache lookup→compute→store) with early deadline check.
4. Vector similarity search (pgvector) with baseK (or adaptiveK if enabled) using prepared statement.
5. Fetch associated entity metadata (batched) applying permission filters.
6. Apply recency decay and diversity adjustments.
7. Sort deterministically; trim to requested limit (or config default).
8. If elapsed > soft deadline and not enough items (< partialReturnPolicy.minResults), return partial with partial flag; else continue.
9. Store result in query cache (with dependency list: involved entityIds & lastUpdated timestamps).
10. Return standardized response with timing & stats.

## 7. Versioning & Stability Model

Add new minor version to contracts exposing RetrievalResponseSchema fields. Changes additive only until next major. Deprecations flagged with JSDoc @deprecated and retained ≥1 minor.

## 8. Public API Surface (Initial)

Exports (from `@roler/rag`):

- `executeRetrieval(request: RetrievalRequest, config?: Partial<RetrievalConfig>): Promise<RetrievalResponse>`
- `warmEntityContext(entityId: Ulid): Promise<void>` (pre-populate cache)
- `invalidateEntityContext(entityId: Ulid): void`
- `getRetrievalMetricsSnapshot(): RetrievalMetrics` (typed struct of counters & percentiles)
- Types: RetrievalRequest, RetrievalResponse, RetrievalConfig.

No breaking changes to existing callers; new function may wrap legacy one internally.

## 9. Error Handling & Codes

Extend standardized error catalog with:

- RETR_TIMEOUT_SOFT
- RETR_TIMEOUT_HARD
- RETR_INVALID_REQUEST
- RETR_VECTOR_EXEC_ERROR
- RETR_CACHE_FAILURE
- RETR_INSUFFICIENT_RESULTS (debug severity; typically partial fallback)

Errors follow shared shape: { code, message, details?, requestId, latencyMs }.

## 10. Security & Capability Model

- Restricted attributes filtered post-fetch unless caller authorized; filter occurs before scoring to prevent leakage via timing side-channels.
- No raw embeddings returned; only derived scores.
- Cache keys exclude sensitive data (no PII). Keys hashed with stable hash (e.g., SHA-256 truncated) if query text could contain sensitive player input.
- Access control context passed explicitly (no global mutable state) and validated.

## 11. Performance Considerations

Latency Budget (target ≤ 250 ms total p95):

| Stage | Target p95 ms | Notes |
|-------|---------------|-------|
| Caching (lookups/hash) | 5 | Memory only |
| Embedding (local model) | 40 | Assumes warm model; else warmup outside budget |
| Vector Query (pgvector) | 110 | Using ivfflat / appropriate index & ANALYZE schedule |
| Metadata Fetch & Filters | 30 | Batched select with composite index |
| Post-Process & Sort | 20 | In-memory operations |
| Buffer / Overhead | 45 | Network, variability |

Techniques:

- Prepared statements & connection pooling reuse.
- AdaptiveK: Start with baseK; if after filtering candidateCount < limit * 0.75 and time < soft deadline / 2, issue one incremental query for additional (maxKBoost) vectors.
- Score combination computed with precomputed constants (no dynamic allocation loops).
- Use monotonic clock for timing (process.hrtime.bigint / performance.now).
- Avoid JSON serialization until final response; operate on structured objects.

## 12. Observability & Metrics

Metrics (histograms & counters):

- retrieval_latency_ms (histogram)
- retrieval_vector_ms, retrieval_embedding_ms, retrieval_postprocess_ms
- retrieval_timeouts_total{type}
- retrieval_partial_returns_total{reason}
- retrieval_cache_hit_total{layer}
- retrieval_cache_miss_total{layer}
- retrieval_adaptive_queries_total
- retrieval_results_count (distribution)

Tracing: Span per stage with attributes (kRequested, kUsed, candidateCount, partialFlag). Correlate with requestId.

Dashboards: p50/p95/p99 lines, timeout rate (<1%), cache hit ratio, adaptive query frequency.

Alerts: p95 > 250 ms for 5m; timeout rate >1% for 5m; cache hit ratio <50% sustained 15m (tuning needed).

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Embedding timeout | Fallback: compute once more within budget or partial return | Preserves responsiveness |
| Vector query exceeds soft deadline | Return partial results gathered so far | Graceful UX |
| Hard deadline exceeded | Abort stage, return partial with HARD flag | Bounded tail |
| Cache corruption | Evict entry; proceed uncached | Safety |
| Adaptive second query slow | Skip second query next 5 minutes (circuit) | Prevent cascading latency |
| Insufficient diversity | Boost underrepresented entities (score multiplier) | Context quality |

## 14. Implementation Plan (Step-by-Step)

1. Define schemas (RetrievalConfig, Request, Response) + tests (validation + negative cases).
2. Implement config module with defaults & merge logic.
3. Introduce composite scoring + deterministic sorting helper with tests.
4. Embed cache (LRU) + unit tests (eviction, hit ratio tracking).
5. Query result cache & invalidation strategy (entity update hook publishes invalidation event).
6. Deadline controller utility (soft/hard) with simulation tests.
7. Vector retrieval integration refactor to return raw candidate list + timings.
8. Post-processor (recency decay, diversity enforcement, filtering) with deterministic snapshot tests.
9. AdaptiveK logic & tests (simulate drop & time budget usage).
10. Response assembly + partial fallback flagging.
11. Metrics instrumentation layer (counters + histograms) & integration tests (mocks).
12. Error codes additions to contracts + mapping tests.
13. End-to-end integration test (seed small corpus; measure path correctness & ordering).
14. Benchmark harness script (N iterative retrievals, report distribution) gating p95.
15. Dashboard & alert definitions (config templates).
16. Documentation authoring (developer guide + tuning tips).
17. Rollout behind feature flag (`LOW_LATENCY_RETRIEVAL=true`).
18. Post-launch tuning (analyze metrics, adjust half-life & adaptive thresholds).

## 15. Testing Strategy

Test Layers:

- Unit: schema validation, scoring math (recency decay formula), adaptiveK branching, cache eviction.
- Property-based: Deterministic ordering given same input & stable dataset.
- Integration: Full pipeline with mocked DB returning deterministic vectors.
- Performance: Benchmark harness verifying latency envelopes (use synthetic timers where feasible for embedding stub).
- Resilience: Simulate slow vector query, forced cache misses, controlled timeouts.
- Security: Restricted attribute filtering retains no blocked items.

Coverage Target: ≥95% new logic lines; deterministic sort verified via snapshot of ordered IDs.

## 16. Documentation Plan

Artifacts:

- Retrieval Tuning Guide (timeouts, adaptiveK, recency half-life).
- Metrics Reference (definitions & SLO alignment).
- Partial Fallback Semantics (client handling guidelines).
- FAQ (Why partial? How to interpret diversity boosts?).

## 17. Migration / Rollout

Phases:

1. Implement behind disabled flag.
2. Internal load test with synthetic dataset; calibrate config.
3. Canary enable for small % of sessions; compare latency metrics A/B.
4. Gradual ramp to 100%; monitor alerts.
5. Remove legacy path after stable week below target.

Rollback: Flip feature flag off; legacy retrieval path still available.

## 18. Assumptions

- Local embedding model warm & resident in memory (cold start separate path).
- Typical corpus size within pgvector index sweet spot (<10M chunks initially).
- Node 20 environment with high-resolution timers.
- DB connection pool sized adequately; retrieval uses at most 2 concurrent queries per request.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Latency regression under load | SLA breach | Benchmark + adaptiveK throttle; alerts |
| Cache stampede on invalidation | Spikes | Jittered revalidation; single-flight lock |
| Over-aggressive partial returns | Context loss | Tune soft deadline; telemetry review |
| Diversity boosting masks relevance | Lower precision | Cap diversity weight; monitor quality metrics |
| AdaptiveK over-queries | DB load | Query budget guard & circuit if hit ratio low |
| Stale cached results after updates | Incorrect context | Invalidation events + version stamps |
| Recency decay misconfigured | Non-deterministic feel | Config validation ranges + tests |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Cache invalidation granularity? | Entity-level + global version epoch; chunk-level deemed unnecessary initially. | Implement entity + epoch stamp, revisit. |
| Diversity enforcement threshold dynamic? | Start static (config); evaluate adaptive later. | Add telemetry to decide. |
| Multi-tenant tuning? | Allow overrides per gameId via config map. | Extend config schema phase 2. |

## 21. Acceptance Criteria Traceability

Matrix linking tests: performance benchmark → p95 assertion; timeout simulation test → partial flag; ordering property test → deterministic ordering; metrics export test → percentile presence; cache tests → hit ratio measurement.

## 22. KPI Measurement Plan

- Daily job extracts p95 from metrics store; alert if > target.
- Timeout rate panel; engineering review weekly if >0.5%.
- Cache hit ratio tracked (embedding >70%, query result >50%).

## 23. Future Extensions (Not Implemented Now)

- ANN backend integration (Qdrant / HNSW) with hybrid re-ranking.
- Multi-modal retrieval (image / structured attributes embedding fusion).
- Learned re-ranker (cross-encoder) in second-stage (budget permitting).
- Per-user personalized decay model.

## 24. Out-of-Scope Confirmations

- No remote replication, no ANN migration, no multi-region caching in this release.
- No second-stage re-ranking model (kept for future).

## 25. Summary

This design establishes a low-latency, deterministic retrieval pipeline with adaptive controls, structured observability, and graceful degradation strategies meeting the ≤250 ms p95 objective while preserving context quality and security constraints.

---
END OF DOCUMENT
