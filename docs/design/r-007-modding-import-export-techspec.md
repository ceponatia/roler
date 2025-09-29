---
title: R-007 Modding Import / Export Technical Specification
Status: Accepted
last-updated: 2025-09-04
related-prd: ../prd/r-007-modding-import-export-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Provide structured JSON export/import of canonical entities with version awareness, conflict detection, and migration adapter support enabling ecosystem content sharing.

In-Scope:

- Export API (single/batch) with schema version header + manifest.
- Import pipeline (stream parse → validate → optional diff preview → apply).
- Conflict strategies (ID collision, version mismatch, restricted field rejection).
- Migration adapter registry (version → transform function).

Out-of-Scope (this spec):

- Marketplace distribution.
- Digital signatures (future trust model).

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Export w/ metadata | ExportManifest + header | Contains schemaVersion |
| Validate imports | Import validator schemas | Aggregated error list |
| Apply without dup | ID collision resolution rules | New IDs or merge flag |
| Migration adapters | Adapter registry | Version stepping |

## 3. High-Level Architecture

Components:

1. Export Service (gathers versions + serializes stream).
2. Import Pipeline (streaming parser → validator → conflict resolver → applier).
3. Migration Adapter Registry.
4. Conflict Resolver (policies: abort, rename, merge new version).
5. CLI Tool (offline validate & apply preview).
6. Metrics & Logging (import duration, failures, adapter usage).

## 4. Data & Schema Design (Zod-First)

Schemas:

- ExportManifestSchema { schemaVersion, exportedAt, exporterVersion, entityCount }
- ExportEntityRecord { entityId, kind, latestVersionId, versions: CanonVersion[] }
- ImportResult { created: number; updated: number; conflicts: ConflictRecord[]; errors: ImportError[] }
- ConflictRecord { type: 'ID' | 'VERSION'; entityId; detail }
- ImportError { code; message; path[] }

## 5. Hook Interface Contracts

Optional preApply / postApply hooks (future) for plugin adaptation—deferred.

## 6. Registration & Loading Flow

Import: parse manifest → verify supported schemaVersion → run migration adapters sequentially until current → validate each entity/version → apply transactions.

## 7. Versioning & Stability Model

SchemaVersion increments on breaking change; adapters supply transforms from prior versions.

## 8. Public API Surface (Initial)

- exportEntities(entityIds[], options) -> AsyncIterable<Buffer | string>
- importStream(stream, options) -> Promise\<ImportResult\>
- registerMigrationAdapter(fromVersion, toVersion, fn)

## 9. Error Handling & Codes

Codes: IMP_INVALID_MANIFEST, IMP_SCHEMA_ERROR, IMP_CONFLICT_ID, IMP_CONFLICT_VERSION, IMP_UNSUPPORTED_VERSION.

## 10. Security & Capability Model

Strip or reject restricted GM-only fields; enforce permission checks before applying.

## 11. Performance Considerations

Streaming parser (chunked JSON or JSONL) to bound memory. Batch DB writes (group versions per entity). Target < 2s for 100 entities.

## 12. Observability & Metrics

Metrics: import_duration_ms, import_conflicts_total, import_errors_total{code}, export_duration_ms, migration_adapter_invocations_total.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Unsupported version | Abort with IMP_UNSUPPORTED_VERSION | Safety |
| Conflict ID | Record & apply policy | Control |
| Migration failure | Abort import | Consistency |

## 14. Implementation Plan (Step-by-Step)

1. Define schemas.
2. Implement export service streaming.
3. Implement import pipeline (parser + validator + conflict resolver).
4. Migration adapter registry + tests.
5. CLI tool (validate, dry-run apply, real apply).
6. Metrics instrumentation.
7. Error code mapping.
8. Documentation (modding-guide.md).

## 15. Testing Strategy

Unit (schemas, adapters), integration (round-trip export/import), performance (100 entity batch), conflict simulation (ID, version), security (restricted field rejection).

## 16. Documentation Plan

modding-guide.md, adapter-writing.md, cli-usage.md.

## 17. Migration / Rollout

Feature flag gating import apply (export always safe). Gradual enable.

## 18. Assumptions

Entity versions accessible via versioning service (R-003).

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Version drift | Import failures | Adapters + tests |
| Large file memory | OOM | Streaming parse |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Digital signatures? | Future; outside initial scope | Document deferral |

## 21. Acceptance Criteria Traceability

Round-trip test ↔ success; invalid manifest test ↔ IMP_INVALID_MANIFEST.

## 22. KPI Measurement Plan

Track import_duration_ms distributions & failure codes.

## 23. Future Extensions (Not Implemented Now)

Signed manifests, dependency graphs.

## 24. Out-of-Scope Confirmations

No marketplace UI, no signature verification.

## 25. Summary

Implements structured, version-aware import/export pipeline with migration adapters and streaming performance, enabling safe community content sharing.

---
END OF DOCUMENT
