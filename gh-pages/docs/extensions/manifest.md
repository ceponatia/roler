---
id: extensions-manifest
title: Extension Manifest Schema
sidebar_label: Manifest
description: Identity, hooks, budgets, capabilities, and safety flags declared by an extension
---

Maps to: `packages/schemas/src/system/extensions/extension-manifest.schema.ts`

Key fields:

- id, name, version, coreApiRange
- hooks, chatHooks, priority
- hookBudgets (maxTokens, maxLatencyMs)
- capabilities, unsafeCapabilities
- dataClassScopes
- concurrencyLimit, killSwitchEnabled, stateTransactionSupport
- peerExtensions

Notes:

- Keep schemas flat. Export `NameSchema` and infer `Name` via `z.infer<typeof NameSchema>`.
- Runtime execution/orchestration is not implemented yet.
