# Retrieval Tuning Guide

This guide helps you tune the Low-Latency Retrieval system to meet the p95 ≤ 250 ms objective while preserving result quality.

## Key Levers

- Deadlines
   - `maxTotalDeadlineMs` (default 250): hard cap for end-to-end. Do not exceed SLO target.
   - `softPartialDeadlineMs` (default 180): soft budget to trigger partial fallback if needed.
- Candidate set size
   - `baseK` (default 32): initial vector K. Too low → recall loss; too high → latency.
   - `maxKBoost` (default 16): AdaptiveK headroom when filtering drops too many.
   - `enableAdaptiveK` (default true): allow one incremental vector query under budget.
- Recency & diversity
   - `recencyHalfLifeMinutes` (default 240): bigger favors recent content more.
   - `diversityMinEntityPercent` (default 0.25): ensures varied entities in results.
- Caches
   - `embeddingCacheSize` (default 5k)
   - `queryResultCacheSize` (default 2k)
   - `entityContextCacheSize` (default 1k)
- Partial return policy
   - `partialReturnPolicy.minResults` (default 8): minimum acceptable items before flagging partial.

## Practical Steps

1. Establish a baseline
   - Run the benchmark harness (`pnpm -w --filter @roler/rag bench`) with a mixed mode.
   - Note p50/p95/p99 and partial rate.
2. Budget the stages
   - Keep vector p95 around ≤110 ms; post-process ≤20 ms; cache lookups ≤5 ms.
   - If vector dominates, reduce `baseK` or enable AdaptiveK; optimize DB index.
3. Tune AdaptiveK
   - If `candidateCount` after filters &lt; `limit * 0.75` and time remains, allow a single boost up to `maxKBoost`.
   - Monitor `retrieval_adaptive_queries_total`; frequent spikes may mean baseK too low.
4. Balance recency vs relevance
   - Increase `recencyHalfLifeMinutes` for fresher results; decrease for stable canonical context.
   - Validate via snapshots: identical input → identical ordering.
5. Manage partials
   - Set `softPartialDeadlineMs` so typical queries finish without partials; aim partial rate &lt;1%.
   - If partials frequent, consider lowering `minResults` or adjusting deadlines.
6. Cache sizing
   - Target query result cache hit ratio ≥50%; embedding cache ≥70%.
   - Increase sizes only if memory allows and hit ratio is the limiting factor.

## Validation Checklist

- Deterministic order stable across runs with identical input.
- p95 ≤ 250 ms sustained in Grafana.
- Timeout rate ≤ 1%.
- Partial results rare and well-justified (SOFT/HARD/ADAPTIVE reasons).
- Diversity constraint respected (no single-entity domination).

## Troubleshooting

- High p95 but low p50 → tail issues: verify DB load, circuit any slow AdaptiveK, check GC pauses.
- Low cache hit ratio → verify invalidation churn; expand sizes; inspect key cardinality.
- Many partials → increase soft deadline or reduce `baseK`; ensure vector index analyzed.
