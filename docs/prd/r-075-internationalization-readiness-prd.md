# PRD: Internationalization Readiness (R-075)

Requirement ID: R-075
Source: requirements.md Section 16 (Frontend Requirements)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Prepare UI for future localization by externalizing user-visible strings, supporting locale switch (English baseline), and avoiding baked-in cultural assumptions.

## Problem / Opportunity

Hardcoded strings require extensive refactors for future language support. Early abstraction minimizes later cost and widens potential user base.

## Goals

- Central messages catalog with keys.
- Lightweight translation function `t(key, params)`.
- Locale detection via browser or explicit selector.

## Non-Goals

- Immediate multi-language content (English only now).
- Server-driven per-locale content negotiation (manual toggle acceptable).

## User Stories

1. As a developer, I add a new UI string by inserting a key in catalog.
2. As a product manager, I export catalog for translation pipeline.
3. As a user, I can switch locale (even if only en) confirming mechanism works.

## Functional Scope

- Key-value JSON catalog.
- Placeholder interpolation support.
- Build-time lint preventing raw string literals in UI directories (except allowed list).

## Out of Scope

- Pluralization rules (phase 2).
- Date/number localization (basic formatting only).

## Acceptance Criteria

- GIVEN new component with hardcoded string WHEN lint runs THEN violation triggered.
- GIVEN translation key missing WHEN rendered THEN fallback warning + key shown.
- GIVEN catalog export script WHEN run THEN generates JSON file sorted by key.
- All criteria trace back to R-075.

## Metrics / KPIs

- Hardcoded String Violations trending to 0.
- Catalog Coverage (% of UI strings externalized) ≥95%.

## Risks & Mitigations

- Risk: Overhead in early stage → Mitigation: Minimal wrapper, defer advanced i18n.
- Risk: Key collisions → Mitigation: Namespace conventions (feature.key).

## Dependencies

- Build pipeline (R-022).

## Security / Privacy Considerations

- Ensure restricted content not accidentally externalized for translation vendors.

## Performance Considerations

- Catalog in-memory object; negligible overhead.

## Accessibility & UX Notes

- Language attribute updated on html when locale switches.

## Operational Considerations

- Export script integrated into release checklist.

## Open Questions

- OQ-R075-01: Support runtime locale hot swap vs reload?

## Alternatives Considered

- Postponed i18n until feature parity — Rejected (retrofit cost higher).

## Definition of Done

- Catalog, helper, lint rule shipped.
- Coverage threshold metric tracked.
- Docs for adding keys.

## Appendix (Optional)

Catalog example: `{ "chat.send": "Send" }`.

---
Template compliance confirmed.
