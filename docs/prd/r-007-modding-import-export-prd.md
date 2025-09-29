# PRD: R-007 Modding Import / Export

Requirement ID: R-007
Source: requirements.md Section 2
Status: Accepted
Owner: PRODUCT
Last Updated: 2025-09-29

## Summary

Provide import/export of canon objects as version-aware structured JSON enabling community sharing and reuse.

## Problem / Opportunity

Lack of structured interchange blocks ecosystem content distribution.

## Goals

- Export single or batch canon entities with schema version metadata
- Validate and apply imports with conflict detection
- Support evolution via migration adapters

## Non-Goals

- In-app content marketplace UI

## User Stories

1. As a GM, I export campaign lore to share with another table.
2. As a modder, I import a published module into my game.
3. As a developer, I validate imported files before persistence.

## Functional Scope

- Export API (single/batch) + schema version header
- Import pipeline: validate → (optional diff) → apply
- Conflict resolution strategies (ID collision, version mismatch)

## Out of Scope

- Automatic dependency resolution between modules

## Acceptance Criteria

- GIVEN invalid import THEN structured error list with codes returned.
- GIVEN successful import THEN expected versions created without duplication.
- Exported JSON validates against schema offline (CLI validation step).

## Metrics / KPIs

- Import failure rate (schema) < 5% after initial stabilization
- Average import processing time < 2s for 100 entities

## Risks & Mitigations

- Risk: Schema evolution mismatch → Mitigation: migration adapters per version.

## Dependencies

- Canonical versioning (R-003)
- Contracts-first schemas (R-024)

## Security / Privacy Considerations

- Reject imports containing restricted GM-only fields when not authorized.

## Performance Considerations

- Streaming parse for large batch import to limit memory.

## Operational Considerations

- CLI tool for offline validation.

## Open Questions

- Do we need digital signatures for trusted modules?

## Alternatives Considered

- Raw SQL dump approach (rejected: brittle & unsafe)

## Definition of Done

- Export/import pipeline implemented with tests, migration adapter example, docs updated.
