---
title: R-005 Pluggable Vector Store Technical Specification
Status: Accepted
last-updated: 2025-09-04
related-prd: ../prd/r-005-pluggable-vector-store-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Provide a backend-agnostic retrieval abstraction allowing runtime selection (config / env) between pgvector and alternative vector stores (initially Qdrant) with optional dual-read variance logging prior to cutover.

In-Scope:

- Retriever interface & adapter pattern.
- Backend factory (env flag) + configuration schema.
- Dual-read comparer capturing score & latency deltas.
- Score normalization layer (distance → similarity standard scale).
- Variance metrics & structured logs.

Out-of-Scope (this spec):

- Multi-backend consensus write.
- Auto fallback on mismatch.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Single retriever interface | `Retriever` Type + contract doc | Stable public surface |
| Config-based backend swap | Factory reading env + config object | One change + restart |
| Dual-read variance logging | Wrapper executing both adapters | Metrics + diff logs |
| Variance metrics accessible | Metrics registry + exporter | p95 vs p50 tracking |

## 3. High-Level Architecture

Components:

1. Retriever Interface: `retrieve(query, opts) -> Promise<RetrieveResult>`.
2. Adapters: PgVectorAdapter, QdrantAdapter (future others).
3. Factory: `createRetriever(config)` selects adapter.
4. DualReadWrapper: Executes primary + shadow; returns primary, records comparison.
5. Normalizer: Converts backend-specific distances to unified similarity score [0,1].
6. Metrics Layer: Latency histograms per backend, delta distribution, mismatch counters.
7. Config Schema: Zod for adapter-specific fields (hosts, auth, collection names).

## 4. Data & Schema Design (Zod-First)

Add `RetrieverConfigSchema` with discriminated union on backend kind. Include optional dualRead { enabled, sampleRate }.

## 5. Hook Interface Contracts

Pre/post retrieval hooks planned (future synergy); not implemented now.

## 6. Registration & Loading Flow

On startup parse config; instantiate primary adapter; if dualRead enabled, wrap with DualReadWrapper passing shadow adapter.

## 7. Versioning & Stability Model

Retriever interface stable; additive fields via optional params only.

## 8. Public API Surface (Initial)

- `createRetriever(config)`
- Types: Retriever, RetrieveQuery, RetrieveResult, RetrieverConfig.

## 9. Error Handling & Codes

Codes:

- RETR_BACKEND_UNAVAILABLE
- RETR_DUAL_VARIANCE_HIGH
- RETR_CONFIG_INVALID

## 10. Security & Capability Model

Credentials (API keys) injected via env; never logged. Variance logs redact query text if flagged sensitive.

## 11. Performance Considerations

Dual-read doubles query load; restrict behind sampleRate and limited window. Normalization O(n). Extra overhead accounted for within retrieval p95 target (R-002 alignment).

## 12. Observability & Metrics

Metrics: retr_backend_latency_ms{backend}, retr_dual_delta_score, retr_dual_delta_latency_ms, retr_dual_mismatch_total.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Shadow backend fail | Log warn; continue primary | Non-disruptive |
| High variance | Emit alert code RETR_DUAL_VARIANCE_HIGH | Risk visibility |
| Config invalid | Startup fail fast | Prevent undefined state |

## 14. Implementation Plan (Step-by-Step)

1. Define Zod config schema.
2. Implement interface & types.
3. Build PgVectorAdapter & QdrantAdapter.
4. Implement score normalization.
5. DualReadWrapper with comparison logger.
6. Metrics instrumentation.
7. Tests (unit + integration simulation).
8. Docs (retriever.md usage + swap runbook).

## 15. Testing Strategy

- Unit: normalization math, variance calc, config validator.
- Integration: swap backend, dual-read sample, failure tolerance.
- Performance: overhead measurement with dual-read on/off.

## 16. Documentation Plan

retriever.md, variance-monitoring.md, runbook.md.

## 17. Migration / Rollout

Enable dual-read shadow first; after acceptable variance window, toggle primary to new backend; disable shadow.

## 18. Assumptions

Both backends return comparable vector distance semantics convertible to similarity.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Score distribution drift | Irrelevant results | Normalization tuning + monitoring |
| Production cost spike | Resource strain | SampleRate gating |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Persist variance over time? | Store in time-series DB for trend. | Add optional exporter phase 2 |

## 21. Acceptance Criteria Traceability

Variance metrics test ↔ dual-read; config toggle test ↔ backend swap.

## 22. KPI Measurement Plan

Variance deltas histogram; mismatch alert thresholds.

## 23. Future Extensions (Not Implemented Now)

Hybrid retrieval (semantic + sparse), multi-region adapters.

## 24. Out-of-Scope Confirmations

No automatic fallback or consensus write.

## 25. Summary

Defines a pluggable vector retrieval layer ensuring backend flexibility with controlled dual-read evaluation and standardized scoring.

---
END OF DOCUMENT
