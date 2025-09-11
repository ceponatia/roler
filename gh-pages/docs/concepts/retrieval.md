---
id: retrieval
title: Retrieval Strategy
sidebar_label: Retrieval
description: Instance-first retrieval with canonical fallback
---

- Instance-first retrieval: use attribute atoms to target context quickly.
- Fallback to canonical text chunks when instance context is insufficient.
- Current vector backend: pgvector. Qdrant support is planned; dual-read/outbox sync is not implemented.
