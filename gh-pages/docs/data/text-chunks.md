---
id: data-text-chunks
title: Text Chunks
sidebar_label: Text Chunks
description: Ownership and shape of retrievable text units
---

Maps to: `packages/schemas/src/text-chunk.schema.ts`

Fields:

- ownerType: `canon` | `instance`
- ownerId
- fieldPath

Guidance:

- Chunking strategy should balance recall and latency
- Ensure deterministic ordering when inputs are equal
