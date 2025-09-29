# PRD: Field-Aware Retrieval Order (R-042)

Requirement ID: R-042
Source: requirements.md Section 10 (Retrieval / RAG)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Implement retrieval ordering prioritizing instance-specific attribute vectors (AttrAtom) before falling back to canonical text chunks, improving contextual relevance for active sessions.

## Problem / Opportunity

Using only canonical chunks ignores in-session overrides or emergent state, reducing response fidelity. Field-aware ordering surfaces the most immediate contextual facts first.

## Goals

- Two-tier retrieval: instance attribute layer then canonical fallback.
- Configurable weighting / merge policy.
- Deterministic ordering for reproducibility.

## Non-Goals

- Adaptive learning-based re-ranking (future optimization).
- Multi-hop reasoning retrieval.

## User Stories

1. As a player, I receive responses reflecting latest in-session attribute changes.
2. As a GM, I know canonical backstory surfaces only when no fresher instance data exists.
3. As a developer, I can adjust weighting config without code modifications.

## Functional Scope

- Composite retrieval algorithm orchestrating layered queries.
- Merge & de-duplication logic.
- Weight configuration & validation.

## Out of Scope

- Automatic weighting tuning.
- Temporal decay scoring.

## Acceptance Criteria

- GIVEN entity with updated instance attribute WHEN retrieval executes THEN attribute fact appears ahead of canonical chunk referencing older value.
- GIVEN weighting adjustment WHEN config reloaded THEN new ordering reflected next query.
- GIVEN duplicate content across layers WHEN merged THEN only highest-priority occurrence returned.
- All criteria trace back to R-042.

## Metrics / KPIs

- Instance Attribute Hit Ratio.
- Duplicate Merge Count.
- Retrieval Ordering Consistency (hash of result ids stable across identical queries).

## Risks & Mitigations

- Risk: Overweighting stale attributes → Mitigation: Optional freshness parameter.
- Risk: Complexity increases latency → Mitigation: Parallel sub-queries + efficient merge.
- Risk: Non-determinism from asynchronous ordering → Mitigation: Stable sort with tiebreakers.

## Dependencies

- Retrieval interface (R-041).
- Normalization & attribute extraction (R-057..R-062).

## Security / Privacy Considerations

- Respect restricted flags when merging.

## Performance Considerations

- Measure added latency overhead target <10% vs single-tier.

## Accessibility & UX Notes

- Developer docs explain ordering rationale for debugging.

## Operational Considerations

- Config reload mechanism documented.

## Open Questions

- OQ-R042-01: Provide per-field weight overrides?
- OQ-R042-02: Cache merged result for identical recent queries?

## Alternatives Considered

- Single-tier canonical only: Rejected (loses session context).
- Full dynamic learning ranker: Rejected (premature complexity).

## Definition of Done

- Layered algorithm implemented & tested.
- Weight config documented.
- Merge dedupe test coverage.

## Appendix (Optional)

Weight config example:

```json
{ "attributeWeight": 1.0, "canonicalWeight": 0.6 }
```

---
Template compliance confirmed.
