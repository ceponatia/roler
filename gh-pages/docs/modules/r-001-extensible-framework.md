---
id: r-001-extensible-framework
title: r-001 Extensible Framework
sidebar_label: r-001 Extensible Framework
description: Early extension system and schemas
---

This module defines the early extension system. The runtime executor is not implemented yet.

Key schemas:

- ExtensionManifest (hooks, chatHooks, budgets, limits, kill switch, scopes)
- ExtensionRegistrationConfig (allow/deny, ordering, thresholds, strict vs fail-open)
- StateTransaction (set/increment/append; conflictPolicy first-wins | last-wins | weighted | resolver placeholder)

Notes:

- No runtime ordering/concurrency/budget enforcement yet
- Advanced conflict resolution is not implemented
- Keep new schemas flat, `NameSchema` exports, `z.infer` types
