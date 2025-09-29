# PRD: Flexible Structured Fields (R-037)

Requirement ID: R-037
Source: requirements.md Section 9 (Data & Persistence)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Support flexible structured fields (e.g., JSONB) enabling overrides and extensions while preserving query/index capability for critical attributes.

## Problem / Opportunity

Rigid schemas impede rapid iteration on narrative attributes; pure unindexed blobs harm retrieval and filtering. Hybrid design (structured core + flexible extensions) balances agility and performance.

## Goals

- Allow custom attribute additions without migration for every minor change.
- Index frequently queried paths.
- Provide normalization pipeline mapping free-form to structured atoms.

## Non-Goals

- Arbitrary deeply nested dynamic queries (keep curated index list).
- Automatic schema evolution inference.

## User Stories

1. As a GM, I add a new attribute without waiting for DB migration cycle.
2. As a developer, I query on a commonly used attribute with index support.
3. As a plugin author, I store extension data without colliding with core keys.

## Functional Scope

- JSONB (or equivalent) column for extension fields.
- GIN / path indexes on selected keys.
- Validation step ensuring reserved namespace not overridden.

## Out of Scope

- Full dynamic UI form generation (future enhancement).
- Automatic index creation for every new attribute.

## Acceptance Criteria

- GIVEN new extension attribute WHEN stored THEN base query performance unaffected.
- GIVEN indexed attribute query WHEN executed THEN p95 latency within target threshold.
- GIVEN reserved key collision attempt WHEN validation runs THEN write rejected.
- All criteria trace back to R-037.

## Metrics / KPIs

- Indexed Attribute Query p95 Latency.
- Extension Attribute Adoption Count.
- Reserved Key Collision Incidents: 0.

## Risks & Mitigations

- Risk: Query unpredictability → Mitigation: Document approved index keys.
- Risk: Unbounded data growth → Mitigation: Size limit per extension object.
- Risk: Namespace collisions → Mitigation: Prefix guidance for plugins.

## Dependencies

- Normalization (R-057) for structured atoms.
- Data model versioning (R-036).

## Security / Privacy Considerations

- Restrict sensitive keys; redact on export.

## Performance Considerations

- Monitor index bloat; periodic vacuum / reindex guidance.

## Accessibility & UX Notes

- Admin docs explain attribute naming conventions.

## Operational Considerations

- Tooling to list top extension keys for index evaluation.

## Open Questions

- OQ-R037-01: Maximum JSONB size per entity?
- OQ-R037-02: Automatic suggestion of new index triggers?

## Alternatives Considered

- Strict relational columns only: Rejected (slow iteration).
- Fully schemaless store: Rejected (hard queries & optimization).

## Definition of Done

- Flexible field column + indexes created.
- Validation & reserved namespace rules enforced.
- Docs updated with usage guidelines.

## Appendix (Optional)

Example extension object:

```json
{ "plugin.weather": { "climate": "humid" } }
```

---
Template compliance confirmed.
