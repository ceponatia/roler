# PRD: Normalization Transparency (R-061)

Requirement ID: R-061
Source: requirements.md Section 14 (Normalization & Canonical Data)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Guarantee user visibility of original submitted text alongside normalized atoms, enabling trust, auditability, and manual verification without obscuring raw input.

## Problem / Opportunity

Opaque transformation erodes user trust and complicates debugging of extraction errors. Transparent storage & UI display of original content ensures users can validate or contest derived atoms.

## Goals

- Persist original submission verbatim (no mutation) with metadata linking to atoms.
- UI toggle to show/hide normalization panel.
- Provide per-atom source span highlighting in original text.

## Non-Goals

- Full version history of successive edits (handled by versioning elsewhere).
- Automated explanation generation for each rule (future enhancement).

## User Stories

1. As a GM, I view the original paragraph and see highlights for extracted attributes.
2. As a player (when allowed), I can confirm non-restricted content accuracy.
3. As a developer, I inspect spans to debug incorrect extraction.

## Functional Scope

- Store raw submission text field separate from normalized atoms.
- Span mapping (start, end) for each atom referencing original text indices.
- UI overlay rendering highlighted segments.

## Out of Scope

- Rich diff of original vs modified text over time.
- Multi-language inline translation.

## Acceptance Criteria

- GIVEN stored submission WHEN fetched THEN original text returned byte-identical to input.
- GIVEN atom with sourceSpan WHEN UI renders THEN highlight matches original substring indices.
- GIVEN transparency toggle off WHEN user interacts THEN highlights hidden but atoms still accessible in structured list.
- All criteria trace back to R-061.

## Metrics / KPIs

- Original Input Availability Rate (should be 100%).
- Span Mapping Accuracy (audit sample) ≥99%.
- Toggle Usage Rate (engagement metric).

## Risks & Mitigations

- Risk: Encoding issues alter original text → Mitigation: UTF-8 enforced + checksum stored.
- Risk: Incorrect span indices after transformations → Mitigation: No mutation; spans based on original immutable string.
- Risk: UI clutter → Mitigation: Collapsible panel default collapsed for small screens.

## Dependencies

- Deterministic normalization (R-057) for spans.
- Frontend role-aware UI (R-068 to R-071).

## Security / Privacy Considerations

- Do not display restricted spans to unauthorized roles; spans referencing restricted atoms hidden.

## Performance Considerations

- Span highlighting complexity O(k) where k atoms; avoid re-parsing full text repeatedly (cache segmentation).

## Accessibility & UX Notes

- Highlights provide sufficient contrast; screen reader lists atoms with descriptions.

## Operational Considerations

- Optional telemetry on toggle usage to inform UX improvements.

## Open Questions

- OQ-R061-01: Provide export including both original and normalized forms?
- OQ-R061-02: Allow inline editing with live span update?

## Alternatives Considered

- Discard original text after extraction — Rejected (loss of auditability).
- Always show raw + atoms simultaneously (no toggle) — Rejected (UI noise).

## Definition of Done

- Storage & retrieval of original text implemented.
- Highlight rendering integrated & tested.
- Checksums validated in retrieval tests.

## Appendix (Optional)

Span mapping example:

```json
{ "path": "eyes.color", "span": [12, 21] }
```

---
Template compliance confirmed.
