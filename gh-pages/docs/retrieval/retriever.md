---
id: retrieval-retriever
title: Retriever Interface
sidebar_label: Retriever
description: Interface and adapter shape for vector search
---

Maps to: `packages/rag/src/lib/retriever.ts`

Notes:

- Inputs: embedding vector, filters, K
- Result: candidate rows with scores; clamp to [0,1] as needed
- Adapter: pgvector today; pluggable for other backends later
