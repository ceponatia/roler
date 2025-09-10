---
id: r-002-low-latency-retrieval
title: r-002 Low-Latency Retrieval
sidebar_label: r-002 Low-Latency Retrieval
description: Instance-first retrieval with canonical fallback and pgvector
---

Strategy:

- Prefer instance context via attribute atoms
- Fall back to canonical text chunks when needed
- Embeddings via pgvector for similarity

Performance targets (extensions planned):

- Target overhead &lt;5% p95 per chat turn
- Warn 5–7%, fail &gt;7% (to be enforced later in runtime layer)

Not yet implemented:

- Qdrant dual-read and outbox sync
- Budget metering and enforcement
