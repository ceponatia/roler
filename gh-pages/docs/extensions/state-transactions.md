---
id: extensions-state-transactions
title: State Transactions
sidebar_label: State Transactions
description: Declaring and applying atomic attribute operations with conflict policies
---

Maps to: `packages/schemas/src/system/extensions/state-transaction.schema.ts`

Shape:

- op: `set` | `increment` | `append`
- payload: validated per op
- conflictPolicy: `first-wins` | `last-wins` | `weighted` | `resolver` (placeholder)

Notes:

- Advanced policies and runtime executor are not implemented yet.
