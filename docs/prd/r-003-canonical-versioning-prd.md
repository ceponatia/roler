# PRD: R-003 Canonical Versioning

Requirement ID: R-003
Source: requirements.md Section 2
Status: Draft
Owner: PRODUCT
Last Updated: YYYY-MM-DD

## Summary

Maintain canonical source-of-truth versions enabling lineage, structured diff, and controlled merge for game entities.

## Problem / Opportunity

Lack of version lineage prevents safe rollback, auditing, and collaborative editing.

## Goals

- Immutable historical versions
- Efficient diff generation (attributes + text chunks)
- Deterministic conflict detection

## Non-Goals

- Automated semantic conflict resolution

## User Stories

1. As a GM, I revert an entity to a prior version.
2. As a developer, I generate structured diffs for UI display.
3. As a player, I benefit from consistent lore evolution without data loss.

## Functional Scope

- Version schema (id, parentIds, author, timestamp)
- Diff API returning changed attributes & text segments
- Merge helper highlighting conflicts

## Out of Scope

- Multi-branch merge visualization UI

## Acceptance Criteria

- GIVEN a version save THEN lineage captures parent reference.
- GIVEN two divergent versions THEN merge tool flags conflicting fields.
- Diff API returns stable ordering for changes.

## Metrics / KPIs

- Version creation p95 < 100 ms
- Conflict detection accuracy (manual audit) = 100%

## Risks & Mitigations

- Risk: Storage bloat → Mitigation: optional archival compression / pruning policy.

## Dependencies

- Persistence layer (Prisma)

## Security / Privacy Considerations

- Author metadata limited to necessary identifiers.

## Performance Considerations

- Index on (entityId, createdAt) for retrieval.

## Operational Considerations

- Background job for optional pruning.

## Open Questions

- Do we need soft delete for versions?

## Alternatives Considered

- Single mutable record (rejected: loses audit trail)

## Definition of Done

- Schema + APIs implemented, diff/merge tests, rollback scenario validated.
