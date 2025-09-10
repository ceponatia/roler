---
id: architecture
title: Architecture
sidebar_label: Architecture
description: High-level system architecture and core stack
---

Roler’s core stack:

- SvelteKit (TypeScript)
- Postgres + pgvector
- Redis
- Ollama (local LLM + embeddings)
- Prisma
- Zod

Auth is SPA → API routes (Zod-validated) → JWT / Redis session.

Validation layers:

- Tier A: structural parse (Zod)
- Tier B: cross-field refinements
- Tier C: mutability/policy/safety (early; more later)

Retrieval strategy: instance-first via attribute atoms with fallback to canonical text chunks.
