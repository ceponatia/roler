# Dual-Read Variance Monitoring

last-updated: 2025-09-30
status: Accepted
requirements: R-005

This document defines the observability model, alert thresholds, and daily procedures for monitoring the dual-read variance program introduced in Requirement R-005.

## 1. Objectives

- Detect divergence between the primary and shadow retrievers before full cutover.
- Provide actionable telemetry for SREs and feature owners.
- Ensure variance events (`RETR_DUAL_VARIANCE_HIGH`) are triaged with consistent workflows.

## 2. Telemetry Sources

| Source | Description | Location |
|--------|-------------|----------|
| **Metrics** | `getRetrievalMetricSeries()` exports Prometheus-style datapoints. | `packages/rag/src/lib/metrics.ts` |
| **Structured Events** | Dual-read wrapper emits comparison, shadow-error, and variance-high events. | `packages/rag/src/lib/retriever/dual-read.ts` |
| **Logs** | Application logger records variance payloads tagged with variance causes. | Retrieval service logs |

## 3. Key Metrics and Thresholds

### 3.1 Latency Histograms

- `retr_dual_delta_latency_ms{quantile="p95"}`
  - **Target:** < 80ms (AC threshold).
  - **Alert:** Warning at 60ms for 15m; Critical at >=80ms for 5m.

### 3.2 Score Delta Histograms

- `retr_dual_delta_score{quantile="p95"}`
  - **Target:** < 0.2 (AC threshold).
  - **Alert:** Warning at 0.15; Critical at >=0.2.

### 3.3 Sample Counters

- `retr_dual_samples_total`
  - Ensure growth aligns with sample rate × request volume.
- `retr_dual_mismatch_total`
  - Sudden spikes may indicate normalization regression.
- `retr_dual_shadow_errors_total`
  - Should remain near zero; alert if >0 for two consecutive 5m windows.

### 3.4 Backend Latency

- `retr_backend_latency_ms{backend="*", quantile="p95"}`
  - Collect per-adapter dashboards to catch backend-specific regressions.

## 4. Dashboards

Recommended dashboard widgets:

1. **Variance Overview Panel** combining score and latency deltas with burn rate indicators.
2. **Shadow Health Panel** charting `retr_dual_shadow_errors_total` and structured error logs.
3. **Backend Latency Comparison** mirrored charts for primary and shadow histograms.
4. **Sample Rate Audit** verifying expected versus actual shadow invocations.

## 5. Alert Playbooks

### 5.1 High Score Delta Alert

1. Confirm if normalization strategy recently changed (consult deployment notes).
2. Inspect top variance events for common entity IDs or namespaces.
3. If limited to specific datasets, coordinate with data curation team.
4. Consider decreasing sample rate while investigating to reduce load.

### 5.2 High Latency Delta Alert

1. Compare `retr_backend_latency_ms` between primary and shadow backends.
2. If the shadow backend is slower, escalate to infrastructure owners.
3. If the primary slows down, ensure deadlines not exceeded; adjust `softPartialDeadlineMs` if necessary.

### 5.3 Shadow Error Alert

1. Capture recent structured `shadow-error` events for stack traces.
2. Validate credentials, network routing, and certificate rotation.
3. Decide whether to disable dual read temporarily (see Swap Runbook rollback section).

## 6. Daily Checks

- Review overnight variance dashboards during stand-up.
- Track number of `variance-high` events per namespace.
- Ensure alerting destinations (PagerDuty/Slack) received expected test pings weekly.

## 7. Incident Documentation

For each incident:

1. Record timestamp, scope, and impacted requests.
2. Link MoM to variance metrics screenshots.
3. Document remediation steps and resulting configuration tweaks.
4. File follow-up tasks when threshold recalibrations are required.

## 8. Tooling Integrations

- **Prometheus / Thanos:** scrape metrics via the retrieval service `/metrics` endpoint.
- **Grafana:** dashboards templated with backend kind variable.
- **Log aggregation:** ensure `variance-high` events are parsed into structured fields (`code`, `causes`, `comparison.scoreDelta`).

## 9. References

- Requirement **R-005** (Pluggable Vector Store Tech Spec).
- `docs/operations/retriever.md` for base configuration procedures.
- `docs/operations/dual-read-swap-runbook.md` for rollout/rollback steps.
