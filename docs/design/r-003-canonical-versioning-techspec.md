---
title: R-003 Canonical Versioning Technical Specification
status: Completed
last-updated: 2025-09-04
related-prd: ../prd/r-003-canonical-versioning-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Introduce an immutable canonical versioning system for game entities enabling lineage tracking, structured diffs (attributes + text chunks), deterministic merge conflict detection, and safe rollback. The solution must be storage-efficient, performant (version creation p95 < 100 ms), and fully type-safe (Zod-first).

In-Scope:

- Data model for canonical versions and lineage.
- Diff generation API (attribute & text content) with stable ordering.
- Merge helper with deterministic conflict detection rules.
- Rollback operation (promote prior version as new head, never destructive delete).
- Integrity guarantees (checksum / hash, parent linkage validation).
- Optional compression / pruning hooks (design + placeholder instrumentation, not aggressive GC logic).

Out-of-Scope (this spec):

- Semantic (LLM) conflict auto-resolution.
- Rich branch visualization UI.
- Cross-game multi-repo style branching.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Immutable historical versions | Append-only `CanonVersion` records | No in-place mutation; logical rollback via new version |
| Efficient diff generation | Pre-normalized attribute ordering + chunk hash index | O(n) attribute diff; chunk-level structural diff |
| Deterministic conflict detection | Three-way merge algorithm with stable rules | Conflicts enumerated in consistent order |
| Lineage (parent reference) | parentIds (array) + lineageRootId | Typically 1 parent; >1 on merge commits |
| Revert capability | rollback API producing new head version | Preserves continuity |
| Version creation p95 <100ms | Budgeted pipeline & lightweight hashing | Bench harness/metrics |
| Structured diff output | Zod schema typed diff objects | Stable key ordering |

## 3. High-Level Architecture

Components:

1. Version Store (DB Layer): Persists immutable canonical versions (entities) and optional compression metadata.
2. Versioning Service: Orchestrates createVersion, getLineage, diff, mergePreview, rollback operations.
3. Diff Engine:
   - Attribute Diff: Key-wise comparison with typed change records.
   - Text Diff: Chunk-level (paragraph / logical segment) hashing + fallback line diff.
4. Merge Engine: Three-way merge using common ancestor (LCA) with deterministic conflict rules.
5. Integrity Validator: Ensures parent existence, sequence continuity, checksum correctness.
6. Indexing & Ordering Aids: Materialized metadata (sorted attribute key array, chunk hash list) stored per version to speed diff.
7. API Surface (Contracts): Zod schemas for requests/responses (diff, merge preview, rollback result).
8. Metrics & Observability: Timers for create, diff attribute pass, diff text pass, merge detection, rollback.
9. Pruning / Compression Hooks: Optional background job interface (deferred implementation) referencing size thresholds.

## 4. Data & Schema Design (Zod-First)

New / Updated Schemas (in `@roler/schemas/system/versioning`):

- CanonVersionSchema
  - id (ulid)
  - entityId (ulid)
  - lineageRootId (ulid) (first version’s id)
  - parentIds: readonly ulid[] (length ≥1 except initial; length >1 indicates merge)
  - seq (int, monotonically increasing per entity lineage branch head; snapshot for ordering)
  - authorUserId (ulid)
  - createdAt (iso datetime)
  - attributes: canonical attribute object (immutable snapshot)
  - textChunks: readonly array of { index: number; hash: string; text: string }
  - changeSummary?: string (author supplied or generated)
  - baseHash: string (hash of (entityId + parentIds[] + attributesHash + textHashConcat))
  - integrityChecksum: string (final cryptographic hash of serialized payload) (can equal baseHash or include meta)
  - meta?: readonly Record<string, unknown>

- VersionDiffRequestSchema
  - fromVersionId: ulid
  - toVersionId: ulid

- VersionDiffResponseSchema
  - entityId (ulid)
  - attributeChanges: readonly array of AttributeChange
  - textChanges: readonly array of TextChange
  - stats: { addedAttrs: number; removedAttrs: number; modifiedAttrs: number; textAdded: number; textRemoved: number; textModified: number }

- AttributeChange (discriminated union by kind)
  - { kind: 'added'; key: string; newValue: unknown }
  - { kind: 'removed'; key: string; oldValue: unknown }
  - { kind: 'modified'; key: string; oldValue: unknown; newValue: unknown }
  (Keys sorted lexicographically; stable output)

- TextChange (discriminated union)
  - { kind: 'added'; index: number; text: string }
  - { kind: 'removed'; index: number; text: string }
  - { kind: 'modified'; index: number; oldText: string; newText: string; diffHunks: readonly DiffHunk[] }

- DiffHunk
  - { op: 'eq' | 'ins' | 'del'; text: string }

- MergePreviewRequestSchema
  - leftVersionId (ulid)
  - rightVersionId (ulid)

- MergePreviewResponseSchema
  - baseVersionId (ulid)
  - mergedAttributes: Record<string, unknown>
  - mergedTextChunks: readonly array<{ index: number; text: string }>
  - conflicts: readonly array\<Conflict\>
  - conflictCount: number

- Conflict (discriminated union)
  - { kind: 'attribute'; key: string; leftValue: unknown; rightValue: unknown; baseValue: unknown }
  - { kind: 'text'; index: number; leftText: string; rightText: string; baseText: string }

- RollbackRequestSchema { targetVersionId: ulid }
- RollbackResponseSchema { newHeadVersionId: ulid; previousHeadVersionId: ulid }

All external boundaries parse with Zod; types derived via `z.infer`. No any; ULIDs branded. Optional fields explicitly typed. Exhaustive discrimination enforced.

## 5. Hook Interface Contracts

Internal (future extension alignment with R-001):

- preVersionCreate?(candidateSnapshot) → may annotate changeSummary or meta (non-mutative aside from allowed keys).
- postVersionCreate?(versionRecord) → instrumentation / indexing side-effects.

Errors in hooks logged; version creation not blocked unless explicitly configured strict. Not exposed publicly in this requirement phase.

## 6. Registration & Loading Flow

Versioning service initialization loads necessary indices (e.g., prepared statements) and sets up background optional compression job scheduler stub (disabled by default). No dynamic plugin discovery in this requirement (plugin support deferred to future synergy with R-001).

## 7. Versioning & Stability Model

- CanonVersionSchema: Additive fields only until major bump; introducing required fields requires migration plan.
- Diff and Merge response shapes: Only additive new union variants with documented semantics.
- Sequence (`seq`) monotonic guarantee is stable contract; clients can rely on ordering (no gaps except intentional removals—since append only, no gaps expected).

## 8. Public API Surface (Initial)

Functions (exposed through `@roler/games` or dedicated `@roler/versioning` module):

- createVersion(entityId, authorUserId, changeSummary?, overrideAttributes?): Promise\<CanonVersion\>
- getVersion(versionId): Promise\<CanonVersion\>
- diffVersions(fromVersionId, toVersionId): Promise\<VersionDiffResponse\>
- mergePreview(leftVersionId, rightVersionId): Promise\<MergePreviewResponse\>
- rollbackToVersion(targetVersionId, authorUserId): Promise\<RollbackResponse\>
- getLineage(entityId, paging?): Promise<readonly CanonVersion[]>

All return types strictly typed; errors mapped to standardized shape.

## 9. Error Handling & Codes

New error codes (domain: versioning):

- VER_VERSION_NOT_FOUND
- VER_INVALID_PARENT_REFERENCE
- VER_LINEAGE_CYCLE_DETECTED
- VER_MERGE_NO_COMMON_ANCESTOR (edge case if data corruption)
- VER_CONFLICTS_EXCEED_LIMIT (safety guard)
- VER_ROLLBACK_TARGET_INVALID (not part of same lineage)
- VER_DIFF_ENTITY_MISMATCH

Each error logs: code, message, entityId?, versionIds[], correlationId, latencyMs.

## 10. Security & Capability Model

- Author metadata restricted to minimal identifiers (userId); no PII.
- Rollback operations permission-gated (GM / authorized roles only).
- Merge & diff do not reveal restricted attributes if caller lacks access (filtered out before diff; missing keys appear removed only if permitted; otherwise suppressed with redaction flag — additive future enhancement; initial scope assumes authorized internal caller).

## 11. Performance Considerations

Latency Budget (createVersion p95 ≤ 100 ms typical size):

| Stage | Target ms | Notes |
|-------|-----------|-------|
| Fetch current head | 10 | Indexed lookup (entityId, seq desc limit 1) |
| Serialize snapshot + normalize | 15 | Pre-normalized attribute ordering cached |
| Hashing (attributes + text chunks) | 10 | Incremental SHA-256 streaming |
| Insert version row + chunks | 35 | Single transaction, batched insert |
| Hook execution + metrics | 10 | Lightweight instrumentation |
| Buffer | 20 | Variability margin |

Diff Performance: Attribute diff O(n) with sorted key arrays; text diff chunk-level O(c) + per-modified-chunk line diff (Myers or patience diff) with cap (e.g., 5k chars) else fallback mark-as-modified.

## 12. Observability & Metrics

Metrics:

- version_create_latency_ms (histogram)
- version_diff_latency_ms
- version_merge_preview_latency_ms
- version_rollback_latency_ms
- version_conflicts_count (distribution)
- version_storage_bytes_total (gauge / derived periodically)
- version_text_chunks_avg_per_version
- version_compression_savings_ratio (future)

Events / Spans: `version.create`, `version.diff`, `version.mergePreview`, `version.rollback` carrying entityId, versionIds, conflictCount.

Alerts: create p95 > 100 ms sustained 10m; merge preview p95 > 250 ms.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Parent version missing | Abort create with VER_INVALID_PARENT_REFERENCE | Prevent orphan lineage |
| Cycle detected (corruption) | Reject operation; log critical VER_LINEAGE_CYCLE_DETECTED | Integrity safety |
| Excessive conflicts | Abort merge preview with VER_CONFLICTS_EXCEED_LIMIT | UX protection |
| Hash mismatch (tamper) | Mark version invalid; exclude from lineage results | Data integrity |
| DB latency spike | Partial slowdown; metrics trigger alert | Reactive ops |

## 14. Implementation Plan (Step-by-Step)

1. Define Zod schemas (CanonVersionSchema, diff/merge/rollback request & response) + unit tests.
2. DB Schema Migration (Prisma): add table `CanonVersion` (columns matching schema) + `CanonTextChunk` referencing version (if not already), indexes (entityId+seq desc, entityId+createdAt).
3. Add hashing utilities (stream-based) producing baseHash & integrityChecksum.
4. Implement createVersion with parent lookup, seq increment (seq = previous seq +1), validation, and transactional insert.
5. Implement diff engine (attribute pass, text chunk pass, per-modified line/hunk diff) with stable ordering.
6. Implement three-way merge: compute LCA (lowest common ancestor) via upward traversal limited by depth guard; generate merged snapshot and conflict list.
7. Implement rollback: verify lineage membership; call createVersion using target’s attribute/text sets (new version referencing previous head as parent).
8. Introduce error codes & mapping in contracts layer.
9. Integrate metrics timers + counters.
10. Add caching of sorted attribute keys & chunk hash arrays inside version record (optional denormalized columns) for diff acceleration.
11. Add integration tests (seed lineage, simulate bifurcation, merge preview, rollback).
12. Add performance benchmark harness (create 100 versions, measure p95; diff large versions) gating p95.
13. Documentation authoring (versioning.md: model, diff semantics, conflict rules, rollback flow).
14. Feature flag enable in staging; collect metrics & tune.
15. Production rollout + monitoring; schedule follow-up for compression strategy.

## 15. Testing Strategy

Test Layers:

- Unit: schema validation, hashing determinism, diff classification, conflict detection rules.
- Property-based: diff symmetry (diff A→B vs reverse classification), idempotent merge when no changes.
- Integration: multi-branch lineage creation, merge preview correctness, rollback continuity.
- Performance: micro-benchmark createVersion & diff large attribute sets; assertion p95 under target.
- Resilience: Corrupted parent id injection test (simulated) => error handling.
- Security: Access guard tests ensuring unauthorized rollback blocked.

Coverage Goal: ≥95% new logic lines.

## 16. Documentation Plan

Artifacts:

- versioning.md (data model, sequence semantics, rollback procedure).
- diff-format.md (attribute & text diff JSON schema examples).
- merge-conflicts.md (detection rules, resolution guidance).
- operations-playbook.md (monitoring, alerts, incident steps for integrity issues).

## 17. Migration / Rollout

Phases:

1. Migration deploy (tables / indexes) behind feature flag OFF.
2. Shadow write (optional) storing versions while old path still live.
3. Enable read + diff APIs (non-critical paths) for internal QA.
4. Enable version creation for all entity changes (flag ON) — monitor latency.
5. Activate rollback & merge endpoints for GM tools.
6. Evaluate metrics; optimize hot spots.
7. Public documentation release.

Rollback Plan: Disable feature flag; stop creating new versions (existing data retained).

## 18. Assumptions

- Typical entity attribute count ≤ 200 keys; text chunk count ≤ 150.
- Large text segments pre-chunked upstream (normalization stage) for reuse.
- Single parent lineage is norm; merges comparatively infrequent.
- DB provides sufficient IOPS; connection pooling configured.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Storage growth | Increased costs | Compression hook + pruning policy (age + unused branches) |
| Large diff cost | Latency spikes | Chunk hashes + early exit heuristics (skip unchanged) |
| Merge complexity escalation | Slower previews | Limit parentIds >2; linearize rarely-used branches |
| Data corruption (orphan/cycle) | Integrity loss | Integrity validator + periodic audit job |
| Hash collision (improbable) | Integrity false negative | SHA-256 + combined structured serialization |
| Unauthorized rollback | Data integrity risk | Role checks + audit logging |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Soft delete versions needed? | Not initially; append-only + pruning satisfies | Revisit post storage review |
| Multi-parent merges allowed? | Yes for explicit merge commits only | Document constraints |
| Keep full text in all versions? | Yes (optimize later via shared chunk table & refcounts) | Add future ticket |

## 21. Acceptance Criteria Traceability

Mapped: version creation test → lineage parent check; merge divergence test → conflict enumeration; diff ordering test → stable output; rollback test → new head version created; latency benchmark → p95 assertion.

## 22. KPI Measurement Plan

- Daily job aggregates version_create_latency_ms p95.
- Weekly storage usage growth rate (bytes per 1k versions).
- Conflict frequency distribution (monitor collaboration friction).

## 23. Future Extensions (Not Implemented Now)

- Deduplicated chunk storage with content-addressable IDs.
- Semantic merge suggestions leveraging embeddings / LLM.
- Branch labeling & tagging.
- Garbage collection of abandoned branches after retention period.

## 24. Out-of-Scope Confirmations

- No semantic auto-merge.
- No soft delete UI.
- No real-time branching visualization.

## 25. Summary

Defines an append-only canonical versioning foundation with deterministic diff & merge primitives, robust integrity safeguards, and performance-conscious design meeting p95 latency goals while enabling future semantic enhancements.
