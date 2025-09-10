---
id: extensions-loader-and-discovery
title: Loader and Discovery
sidebar_label: Loader & Discovery
description: How extensions are discovered, validated, ordered, and enabled
---

Maps to: `packages/extensions/src/index.ts`

Highlights:

- discoverExtensions(rootDir) scans for `rolerExtension.entry` exports
- loadExtensions: semver check (coreApiRange), capability allowlist, duplicate id, peer resolution
- Ordering: priority (desc), then id (asc)
- loadExtensionsFromConfig: allowlist + orderOverrides
- Guards: `shouldEnableExtensions*` env gating

Not implemented yet:

- Runtime execution engine, budgets, concurrency enforcement
