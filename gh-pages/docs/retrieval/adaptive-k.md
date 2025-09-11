---
id: retrieval-adaptive-k
title: Adaptive K
sidebar_label: Adaptive K
description: Conditional second vector query when filters reduce candidates and time permits
---

Maps to: `packages/rag/src/lib/adaptive.ts`

Rules of thumb:

- Trigger when candidateCount < `limit * 0.75` and time < half of soft partial deadline
- Merge and de-duplicate by chunkId
- Aggregate timings; respect overall deadline budgets
