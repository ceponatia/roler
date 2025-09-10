---
id: retrieval-config
title: Retrieval Config
sidebar_label: Config
description: Tunables and defaults controlling the retrieval pipeline
---

Maps to: `packages/rag/src/lib/config.ts`

Defaults (illustrative):

- baseK, maxKBoost, enableAdaptiveK
- softPartialDeadlineMs, maxTotalDeadlineMs
- partialReturnPolicy.minResults
- diversity and recency settings

Feature gates and env:

- See `env.ts` and `feature-gated.ts` for enabling/disabling orchestration
