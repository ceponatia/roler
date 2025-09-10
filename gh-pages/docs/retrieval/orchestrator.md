---
id: retrieval-orchestrator
title: Retrieval Orchestrator
sidebar_label: Orchestrator
description: End-to-end flow: cache → embed → retrieve → Adaptive K → post-process → metrics
---

Maps to: `packages/rag/src/lib/orchestrator.ts`

Flow:

- Validate request/response via `@roler/schemas`
- Query cache: get/observe/miss/store (keyed by query + filters)
- Embedder call → retriever call → Adaptive K (optional) → post-process
- Partial policy: `softPartialDeadlineMs`, `partialReturnPolicy.minResults`; reasons include `SOFT_TIMEOUT`, `HARD_TIMEOUT`, `ADAPTIVE_LIMIT`
- Metrics: latency histograms, counters for hits/misses/partials/adaptive queries
