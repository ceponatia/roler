---
id: data-model
title: Data Model
sidebar_label: Data Model
description: Canonical vs. instance entities and how pgvector fits
---

- Canonical entities capture durable knowledge and versioned text chunks.
- Instance entities represent runtime or per-instance facts, usually small and high-churn.
- pgvector stores embeddings for retrieval. Attribute atoms guide instance-first retrieval; we fall back to canonical chunks as needed.

All external boundaries use Zod schemas. Favor discriminated unions, inferred types internally, and explicit optionality.
