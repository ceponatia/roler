---
id: validation-and-errors
title: Validation & Errors
sidebar_label: Validation & Errors
description: Zod at the boundaries and normalized error shapes
---

We use Zod at every external boundary (HTTP, DB raw, env). Internally, prefer inferred types and exhaustive switches over `never` to guard variants.

- No `any`, no non-null `!`, no unchecked casting.
- All indexing guarded; return Result or throw only at boundary handlers.
- Error shape is normalized in a shared contracts layer.
