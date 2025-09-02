# PRD: Entity Versioning & Vectors (R-036)

Requirement ID: R-036
Source: requirements.md Section 9 (Data & Persistence)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Maintain canonical entities, version snapshots, in-game instance entities, and associated text/attribute vectors to support retrieval, lineage, and diff/merge operations.

## Problem / Opportunity

Lack of versioned canonical data hinders change tracking and controlled propagation to instances; missing vectors reduces contextual retrieval quality. Unified model enables reliable narrative evolution and retrieval performance.

## Goals

- Persist canonical entity baseline + immutable version snapshots.
- Link instance entities to a canon version for diff/merge.
- Store text/attribute embeddings for retrieval (RAG).

## Non-Goals

- Full CRDT real-time sync (future consideration).
- Semantic merge conflict resolution beyond detection.

## User Stories

1. As a GM, I view prior versions of a canonical entity.
2. As a player session, I reference instance state diverging from updated canon.
3. As a developer, I access vectors for retrieval through a typed repository.

## Functional Scope

- Tables: CanonObject, CanonVersion, GameEntity, TextChunk, AttrAtom.
- Version creation on canonical edits.
- Linking instance to specific version id.
- Embedding generation hook storing vectors.

## Out of Scope

- Automatic forward-merging of canon updates into instances.
- History pruning strategies.

## Acceptance Criteria

- GIVEN canon edit WHEN saved THEN new version snapshot persisted with diff reference.
- GIVEN instance entity linked to version WHEN canon advances THEN linkage remains until explicit rebase.
- GIVEN text attribute ingestion WHEN embedding generated THEN vector row present and queryable.
- All criteria trace back to R-036.

## Metrics / KPIs

- Version Snapshot Count Growth (tracked).
- Embedding Generation Success Rate ≥99%.
- Orphan Instance Links: 0.

## Risks & Mitigations

- Risk: Version table bloat → Mitigation: Retention policy guidelines (future tool).
- Risk: Embedding failures causing retrieval gaps → Mitigation: Retry + dead-letter queue.
- Risk: Diff performance degradation → Mitigation: Store structured delta metadata.

## Dependencies

- Relational datastore (R-012).
- Embedding model (R-043).

## Security / Privacy Considerations

- Restricted attributes flagged at storage for redaction (R-059/067).

## Performance Considerations

- Index version linkage and vector search columns.

## Accessibility & UX Notes

- UI design separate PRD; ensure API exposes version metadata.

## Operational Considerations

- Migration scripts creating required tables & indexes.
- Monitoring embedding queue backlog.

## Open Questions

- OQ-R036-01: Retention trimming threshold?
- OQ-R036-02: Provide diff JSON or patch operations list?

## Alternatives Considered

- Single mutable record only: Rejected (loss of history & lineage).
- Separate system for vectors: Rejected early (complexity) before scale threshold.

## Definition of Done

- Schema & migrations applied.
- Repositories & tests operational.
- Embedding hook integrated.

## Appendix (Optional)

Simplified table relationship sketch.

---
Template compliance confirmed.
