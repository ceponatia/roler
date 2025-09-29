# PRD: Field-Level Retrieval Filtering (R-045)

Requirement ID: R-045
Source: requirements.md Section 10 (Retrieval / RAG)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Support field-level filtering and scoping in retrieval queries (e.g., restrict by attribute path, owner type, or canonical vs instance) enabling precise context assembly and reduced noise.

## Problem / Opportunity

Broad retrieval surfaces irrelevant chunks increasing token usage and reducing answer quality. Field-aware filters refine context and create deterministic, explainable prompt content.

## Goals

- Filter syntax / API (paths, ownerType, restricted include? flag).
- Backend capability negotiation for filter support.
- Safe combination logic (AND across dimensions).

## Non-Goals

- Complex boolean expression language beyond simple conjunction.
- Geo / temporal advanced filters.

## User Stories

1. As a developer, I request only attribute atoms for appearance.* paths.
2. As a GM, I exclude instance-specific overrides to view pure canonical retrieval.
3. As a maintainer, I detect unsupported filters and get clear error messaging.

## Functional Scope

- Filter object schema & validation.
- Retriever implementation applying filters pre-score.
- Error handling for unsupported filter dimension.

## Out of Scope

- Post-retrieval client-side filtering (server handles authoritative filtering).
- Query language parsing (use structured object not free-form string).

## Acceptance Criteria

- GIVEN filter specifying attributePath prefix WHEN retrieval executes THEN only matching atoms returned.
- GIVEN backend lacking filter capability WHEN filter used THEN error with capability message.
- GIVEN canonicalOnly flag WHEN true THEN no instance attribute results included.
- All criteria trace back to R-045.

## Metrics / KPIs

- Filtered Query Latency vs Unfiltered.
- Token Reduction Percentage (filtered vs baseline).
- Unsupported Filter Usage Rate.

## Risks & Mitigations

- Risk: Over-filtering yields incomplete context → Mitigation: Warning logs for empty results.
- Risk: Backend inconsistency → Mitigation: Capability flags and tests per backend.
- Risk: Performance penalty from path filtering → Mitigation: Path index / precomputed attribute groupings.

## Dependencies

- Retrieval interface (R-041).
- Field-aware ordering (R-042).

## Security / Privacy Considerations

- Ensure restricted fields filter remains enforced regardless of user-provided filter.

## Performance Considerations

- Evaluate added latency overhead target <15% vs unfiltered query.

## Accessibility & UX Notes

- Developer docs include filter object examples.

## Operational Considerations

- Metrics dashboard segmenting filtered vs unfiltered latency.

## Open Questions

- OQ-R045-01: Support OR semantics later?
- OQ-R045-02: Provide filter template presets?

## Alternatives Considered

- Return everything then client filter: Rejected (wasteful & inconsistent).
- Free-form query DSL now: Rejected (complexity + validation risk).

## Definition of Done

- Filter schema & enforcement implemented.
- Capability errors tested.
- Docs with examples published.

## Appendix (Optional)

Filter object example:

```json
{ "attributePathPrefix": "appearance.", "canonicalOnly": false }
```

---
Template compliance confirmed.
