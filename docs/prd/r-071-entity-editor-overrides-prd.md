# PRD: Entity Editor with Overrides (R-071)

Requirement ID: R-071
Source: requirements.md Section 16 (Frontend Requirements)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Implement an entity editor UI surfacing normalized attributes, original text (transparency), and controls for manual overrides or deletions, aligned with normalization pipeline.

## Problem / Opportunity

Without a structured editor, overrides require raw JSON edits, increasing error risk and lowering adoption of normalization corrections.

## Goals

- Display attribute list grouped by path namespace.
- Inline edit & remove actions with optimistic UI.
- Original text panel with highlight spans.

## Non-Goals

- Rich collaborative editing (single-user baseline).
- Bulk cross-entity override tools.

## User Stories

1. As a GM, I edit a mis-extracted attribute and see immediate updated value.
2. As a GM, I toggle to show original text with highlighted spans.
3. As a developer, I rely on schema types for form fields (no `any`).

## Functional Scope

- Attribute list component (pageless, sorted).
- Override mutation actions (PATCH endpoints).
- Highlight overlay referencing spans (R-061).

## Out of Scope

- Tag-based filtering UI (future).
- Diff comparison to canon version (R-060 separate view).

## Acceptance Criteria

- GIVEN attribute edit WHEN saved THEN UI reflects new value without full page reload.
- GIVEN removal WHEN confirmed THEN attribute disappears and retrieval refresh triggered.
- GIVEN highlight toggle WHEN off THEN highlight styling removed but list persists.
- All criteria trace back to R-071.

## Metrics / KPIs

- Override Latency p95 <200 ms.
- Edit Error Rate <1%.

## Risks & Mitigations

- Risk: Over-fetch after edits → Mitigation: Cache update via local store patch.
- Risk: Race condition multiple edits → Mitigation: Disable field while mutation in-flight.

## Dependencies

- Normalization transparency (R-061).
- Override corrections (R-062).

## Security / Privacy Considerations

- Restricted attributes only visible for GM role.

## Performance Considerations

- Avoid re-render entire list; keyed updates.

## Accessibility & UX Notes

- Keyboard navigation between attributes; edit controls reachable via tab order.

## Operational Considerations

- None.

## Open Questions

- OQ-R071-01: Provide undo stack for recent overrides?

## Alternatives Considered

- Raw JSON editor — Rejected (error-prone, poor UX).

## Definition of Done

- Editor components shipped.
- Tests for edit/remove flows.
- Docs updated.

## Appendix (Optional)

Attribute item sketch: `{ path, value, restricted, span }`.

---
Template compliance confirmed.
