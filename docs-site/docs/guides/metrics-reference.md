# Metrics Reference (R-002)

This reference documents the primary metrics emitted by the retrieval subsystem and how to use them.

## Histograms

- `retrieval_latency_ms_bucket` (and `_sum`, `_count`)
	- Unit: milliseconds
	- Meaning: end-to-end retrieval latency
	- Example: `histogram_quantile(0.95, sum by (le) (rate(retrieval_latency_ms_bucket[5m])))`
- `retrieval_vector_ms_bucket` (and `_sum`, `_count`)
	- Unit: milliseconds
	- Meaning: vector search time
- `retrieval_postprocess_ms_bucket` (and `_sum`, `_count`)
	- Unit: milliseconds
	- Meaning: post-processing and sorting time
- `retrieval_cache_ms_bucket` (and `_sum`, `_count`)
	- Unit: milliseconds
	- Meaning: cache stage time (lookups + serialization)
- `retrieval_results_count_bucket` (and `_sum`, `_count`)
	- Unit: items
	- Meaning: distribution of result counts before trimming

## Counters

- `retrieval_timeouts_total{type}`
	- Labels: `type` ∈ {`soft`, `hard`}
	- Meaning: number of timeouts by type
- `retrieval_partial_returns_total{reason}`
	- Labels: `reason` ∈ {`SOFT_TIMEOUT`,`HARD_TIMEOUT`,`ADAPTIVE_LIMIT`}
	- Meaning: number of partial responses by reason
- `retrieval_cache_hit_total{layer}` and `retrieval_cache_miss_total{layer}`
	- Labels: `layer` ∈ {`query`,`embedding`,`entity`}
	- Meaning: cache hits/misses by layer
- `retrieval_adaptive_queries_total`
	- Meaning: number of additional AdaptiveK queries executed

## SLO Alignment

- SLO: p95 latency ≤ 250 ms → monitor via `retrieval_latency_ms_bucket` quantiles.
- SLO: timeout rate ≤ 1% → `sum(rate(retrieval_timeouts_total[5m])) / sum(rate(retrieval_results_count_sum[5m]))`.
- Target: query cache hit ≥ 50% → `hits / (hits + misses)` over 15m.

## Example Panels / Queries

- p50/p95/p99 latency lines
	- `histogram_quantile(0.5, sum by (le) (rate(retrieval_latency_ms_bucket[5m])))`
	- `histogram_quantile(0.95, sum by (le) (rate(retrieval_latency_ms_bucket[5m])))`
	- `histogram_quantile(0.99, sum by (le) (rate(retrieval_latency_ms_bucket[5m])))`
- Timeout rate stacked by type
	- `sum by (type) (rate(retrieval_timeouts_total[5m]))`
- Cache hit ratio (query layer)
	- `sum(rate(retrieval_cache_hit_total{layer="query"}[15m])) / (sum(rate(retrieval_cache_hit_total{layer="query"}[15m])) + sum(rate(retrieval_cache_miss_total{layer="query"}[15m])))`

## Labeling Guidance

If operating in multi-tenant mode, add labels such as `gameId` and optionally `env` (prod/stage). Use Grafana variables to filter by these labels.
