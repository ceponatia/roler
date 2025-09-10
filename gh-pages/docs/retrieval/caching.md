---
id: retrieval-caching
title: Query Result Caching
sidebar_label: Caching
description: Cache design and key strategy for retrieval results
---

Maps to: `packages/rag/src/lib/query-result-cache.ts`, `packages/rag/src/lib/lru.ts`

Highlights:

- LRU sizes and eviction policy
- Cache key strategy (`makeQueryKey`) combining text + filters
- Observe-hit-miss-store flow and invalidation considerations
