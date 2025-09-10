# Retrieval Observability Templates

This folder contains ready-to-import templates for monitoring the low-latency retrieval system.

Contents:

- `retrieval-grafana-dashboard.json`: Grafana dashboard with key latency and quality panels.
- `retrieval-prometheus-alerts.yml`: Prometheus alerting rules matching the SLOs.

## Metrics Reference (names)

The dashboard assumes Prometheus metrics exported with these names:


- Histograms
	- `retrieval_latency_ms_bucket` (and _sum/_count)
	- `retrieval_vector_ms_bucket` (and _sum/_count)
	- `retrieval_postprocess_ms_bucket` (and _sum/_count)
	- `retrieval_cache_ms_bucket` (and _sum/_count)
		- `retrieval_results_count_bucket` (and _sum/_count)

- Counters
	- `retrieval_timeouts_total\{type\}` where type in \{soft, hard\}
	- `retrieval_partial_returns_total\{reason\}` where reason in \{SOFT_TIMEOUT,HARD_TIMEOUT,ADAPTIVE_LIMIT\}
	- `retrieval_cache_hit_total\{layer\}` with layer in \{query,embedding,entity\}
	- `retrieval_cache_miss_total\{layer\}` with same layers
		- `retrieval_adaptive_queries_total`

If your exporter uses different metric names, adjust the JSON/YAML accordingly.

## Importing the Dashboard

1. In Grafana, go to Dashboards → Import.
2. Upload `retrieval-grafana-dashboard.json` and select your Prometheus datasource.
3. Save the dashboard. Default time range is 6h; adjust as needed.

## Applying Alerts

1. Place `retrieval-prometheus-alerts.yml` in your Prometheus rule files directory.
2. Add it to the Prometheus config under `rule_files:` and reload Prometheus.
3. Recommended routing:
	- `RetrievalP95LatencyHigh`: severity `page`.
	- `RetrievalTimeoutRateHigh`: severity `page`.
	- `RetrievalQueryCacheHitLow`: severity `ticket`.

## SLOs and Thresholds

- p95 latency ≤ 250 ms (alert after 5m above).
- Timeout rate ≤ 1% (5m window).
- Query cache hit ratio ≥ 50% (15m window).

These align with the retrieval SLOs described in this wiki.

## Notes

- Stage timing averages panel uses Prometheus `_sum/_count` for EMA-like averages; switch to histograms if you expose buckets for those stages.
- For multi-tenant views, add a `gameId` label to your metrics and add a Grafana variable to filter by it.
