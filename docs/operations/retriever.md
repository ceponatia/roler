# Retriever Operations Guide

last-updated: 2025-09-30
status: Accepted
requirements: R-005, R-002

This guide explains how to configure, deploy, and operate the retrieval subsystem that powers low-latency queries and pluggable vector backends.

## 1. Audience and Scope

- **Operators** responsible for configuring and deploying the retrieval worker(s).
- **SREs** monitoring retrieval health, latency, and backend availability.
- **On-call engineers** executing incident response and rollbacks when retrieval health degrades.

The guide covers runtime configuration, environment management, rollout sequencing, and steady-state maintenance for the retrieval layer implemented in `@roler/rag`.

## 2. System Overview

The retrieval orchestration stack consists of:

- **Orchestrator** (`createRetrievalOrchestrator`) that enforces deadlines (R-002) and integrates caching.
- **Retriever factory** (`createRetriever`) that selects adapters based on `RetrieverConfigSchema` (R-005 AC #1, #5).
- **Adapters** for `pgvector` and `qdrant`, each exposing a `retrieve` method plus latency metrics.
- **Dual-read wrapper** optionally sampling a shadow backend, recording variance metrics, and emitting `RETR_DUAL_VARIANCE_HIGH` alerts.

## 3. Configuration Management

### 3.1 Primary Settings

Populate the following environment variables or configuration fields before boot:

| Field | Description | Example |
|-------|-------------|---------|
| `RETRIEVER_PRIMARY_KIND` | Backend kind (`pgvector` \| `qdrant`). | `pgvector` |
| `RETRIEVER_PRIMARY_CONFIG` | JSON blob matching `RetrieverAdapterConfig`. | `{ "kind": "pgvector", "connectionString": "postgres://..." }` |
| `RETRIEVER_NORMALIZATION` | Optional override for target range/strategy. | `{ "strategy": "auto", "targetRange": [0, 1] }` |

All configuration is validated against `RetrieverConfigSchema` during startup. Invalid payloads fail fast with `RETR_CONFIG_INVALID` events as per AC #5.

### 3.2 PgVector Adapter Inputs

- `connectionString`: Postgres DSN with `pgvector` extension installed.
- Optional overrides: `schema`, `table`, `embeddingColumn`, `metadataColumns`, `namespaceField`.
- Ensure database roles have read access; writes are managed by upstream ingest jobs.

### 3.3 Qdrant Adapter Inputs

- `url`: Base URL of the Qdrant cluster (https or http).
- `apiKey`: Optional header for authentication.
- `collection`: Target vector collection name.
- `timeoutMs`: Shadow/primary query timeout (default 5000).
- `consistency`: `eventual` (default) or `strong`.
- `namespaceField`: Metadata field used for namespace filtering.

### 3.4 Dual-Read Configuration

Set `dualRead.enabled` to `true` to activate shadow sampling. Additional fields:

- `sampleRate`: Fraction (0-1) of requests that execute the shadow retriever (default 0). Start with <=0.1 in production.
- `shadow`: Adapter config for the shadow backend. Must target a different vector store than primary during migration.

Configuration example:

```json
{
  "primary": {
    "kind": "pgvector",
    "connectionString": "postgres://retriever:***@vector-db/retrieval"
  },
  "dualRead": {
    "enabled": true,
    "sampleRate": 0.05,
    "shadow": {
      "kind": "qdrant",
      "url": "https://qdrant.internal:6333",
      "collection": "chunks",
      "timeoutMs": 3000
    }
  },
  "normalization": {
    "strategy": "auto",
    "targetRange": [0, 1]
  }
}
```

## 4. Deployment Workflow

1. **Bake configuration** into service manifests or environment files.
2. **Validate** locally via `pnpm -C packages/rag test` to ensure schema and adapter integrations remain compliant.
3. **Deploy** retrieval services with the new environment values. On boot, the factory logs the primary and shadow adapter kinds.
4. **Observe** metrics exported via `getRetrievalMetricSeries()` to confirm baseline counts (`retr_backend_latency_ms`, `retr_dual_samples_total`).

## 5. Operational Runbook

### 5.1 Health Checks

- Monitor `retrieval_total` counter for expected throughput.
- Ensure `retrieval_cache_hit` level aligns with hit rate targets.
- Track `retr_latency_total_ms` p95 for adherence to R-002 acceptance criteria.

### 5.2 Alarms

Configure alerting on:

- `retr_dual_variance_high` structured events (R-005 AC #4).
- Sudden increase in `retr_dual_shadow_errors_total` (indicates failing shadow backend).
- Latency histogram denominator dropping (suggests adapter outages).

### 5.3 Capacity Management

- Pgvector: scale Postgres read replicas and ensure `effective_cache_size` tuned.
- Qdrant: scale node shards/replicas; review disk-backed segment compaction.
- Sample rate adjustments may be necessary during migrations to avoid doubling load.

### 5.4 Rollback Strategy

- Toggle `dualRead.enabled` to false to halt shadow load while retaining the primary backend.
- Switch `primary.kind` back to the previous adapter config and redeploy. The factory enforces fast startup failure if the adapter registry lacks the requested kind, preventing partial rollbacks.

## 6. Troubleshooting

| Symptom | Likely Cause | Remediation |
|---------|--------------|-------------|
| Startup fails with `RETR_CONFIG_INVALID`. | Malformed JSON or missing adapter field. | Validate payload against `RetrieverConfigSchema`; reapply with required keys. |
| Elevated `retr_dual_shadow_errors_total`. | Shadow backend unreachable or misconfigured. | Check network, credentials, and Qdrant health; consider disabling dual read temporarily. |
| High variance alerts (`RETR_DUAL_VARIANCE_HIGH`). | Score or latency divergence, or shadow failure. | Investigate variance events, review normalization strategy, adjust sample rate. |
| Cache hit rate collapse. | Underlying store latency causing deadlines. | Inspect `retr_latency_vector_ms`, increase deadlines or optimize backend. |

## 7. Change Management Checklist

- [ ] Update retriever configuration documents stored in Git.
- [ ] Communicate rollout plan to on-call rotation.
- [ ] Verify metrics dashboards and alerts reflect new adapter or shadow.
- [ ] Document migration window in incident response log.

## 8. References

- Requirement **R-002** Low-Latency Retrieval PRD.
- Requirement **R-005** Pluggable Vector Store Tech Spec & PRD.
- `packages/rag/src/lib/retriever/factory.ts` for adapter binding.
- `packages/schemas/src/rag/retriever-config.ts` for Zod schema definitions.
