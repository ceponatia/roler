# PRD: Canon Version Linkage (R-060)

Requirement ID: R-060
Source: requirements.md Section 14 (Normalization & Canonical Data)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Maintain explicit linkage between game entities (instances) and the canon version snapshot they derive from to enable accurate diff, merge, and provenance tracking across updates.

## Problem / Opportunity

Without stable version linkage, reconciling player session changes with updated canon content becomes error-prone, leading to lost edits or overwrite conflicts. Persistent version references allow deterministic merge strategies and impact analysis.

## Goals

- Each instance stores canonVersionId referencing immutable snapshot.
- Diff API produces structured changes (added/removed/modified atoms, text segments).
- Merge operation uses linkage to detect divergence before applying updates.

## Non-Goals

- Automatic conflict resolution beyond basic strategy (manual GM intervention for complex conflicts).
- Full CRDT or real-time multi-editor merging.

## User Stories

1. As a GM, I view changes my players made since canon version X.
2. As a developer, I invoke a merge API that reports conflicts instead of silently overwriting.
3. As an operator, I audit which instances are on outdated versions.

## Functional Scope

- Schema: canon_version table and foreign key from entity instances.
- Diff service comparing instance & referenced version.
- Merge function producing: merged entity, conflict list.

## Out of Scope

- Graphical diff UI (basic text/attribute diff only initially).
- Multi-branch version lineage (single linear canon chain baseline).

## Acceptance Criteria

- GIVEN entity instance linked to version V WHEN canon updates to V+1 THEN diff reports no changes until merge applied.
- GIVEN conflicting attribute modification WHEN merge attempted THEN conflict surfaced with paths listed.
- GIVEN missing linkage (null) WHEN entity loaded THEN system logs error and blocks merge operations.
- All criteria trace back to R-060.

## Metrics / KPIs

- Merge Success Rate (non-conflict) ≥70% baseline.
- Conflict Detection Accuracy (manual audit) = 100% (no missed conflicts).
- Diff Generation Latency p95 <100 ms for medium entities.

## Risks & Mitigations

- Risk: Orphaned instances after migration → Mitigation: Backfill job verifying linkage consistency.
- Risk: Large diff performance issues → Mitigation: Atom index keyed by path for O(n) comparison.
- Risk: Incorrect conflict resolution strategy → Mitigation: Conservative default + manual override workflow.

## Dependencies

- Canonical entities & versions (R-036).
- Logging & audit (R-063, R-035 for events).

## Security / Privacy Considerations

- Ensure restricted atoms (R-059) remain flagged through merge/diff; do not leak in diff output to players.

## Performance Considerations

- Pre-fetch related version snapshot to minimize round trips.

## Accessibility & UX Notes

- Diff output uses semantic grouping for screen readers (attributes vs text sections).

## Operational Considerations

- Periodic job detecting stale instances (versions behind latest by >N revisions).

## Open Questions

- OQ-R060-01: Provide partial merges (subset of attributes) in baseline?
- OQ-R060-02: Should diff output include embedded vector similarity hints?

## Alternatives Considered

- Inlining version data per instance — Rejected (storage duplication, inconsistency risk).
- No diff mechanism (overwrite only) — Rejected (data loss risk).

## Definition of Done

- Linkage schema enforced with FK.
- Diff & merge services implemented with tests.
- Stale instance detection metric.

## Appendix (Optional)

Conflict object example:

```json
{ "path": "eyes.color", "base": "blue", "instance": "green", "canon": "blue" }
```

---
Template compliance confirmed.
