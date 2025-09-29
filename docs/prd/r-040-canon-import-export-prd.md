# PRD: Canon Import & Export (R-040)

Requirement ID: R-040
Source: requirements.md Section 9 (Data & Persistence)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Enable import/export of canon objects and versions as structured JSON (with schema version) facilitating modding, backups, and external editing workflows.

## Problem / Opportunity

Lack of standardized export blocks community sharing and offline editing. Structured versioned artifacts allow safe interchange and future migration scripting.

## Goals

- Provide export endpoint streaming JSON with schema version header.
- Support import with validation & optional dry run diff.
- Preserve version lineage on import.

## Non-Goals

- Binary or compressed proprietary formats initially.
- Partial/incremental patch imports (full objects first).

## User Stories

1. As a GM, I export a canon object for community sharing.
2. As a designer, I import updated canon maintaining version history.
3. As a maintainer, I reject invalid import with clear error codes.

## Functional Scope

- Export serializer (canon object + versions + metadata + atoms).
- Import validator (schema + referential integrity checks).
- Dry run mode returning diff summary.

## Out of Scope

- UI diff visualization (future enhancement).
- Automatic merge conflict resolution.

## Acceptance Criteria

- GIVEN valid canon export request WHEN processed THEN streamed JSON includes schemaVersion and versions array.
- GIVEN import with missing required field WHEN validated THEN process aborts with validation error list.
- GIVEN dry run import WHEN executed THEN no DB mutations occur and diff summary returned.
- All criteria trace back to R-040.

## Metrics / KPIs

- Successful Import Rate.
- Dry Run Usage Ratio.
- Import Validation Failure Rate (monitor for schema clarity issues).

## Risks & Mitigations

- Risk: Large payload memory usage → Mitigation: Stream export & chunked import parsing.
- Risk: Schema evolution incompatibility → Mitigation: Versioned schema + migration adapter placeholder.
- Risk: Injection via import → Mitigation: Strict schema + sanitization.

## Dependencies

- Versioning (R-036).
- Shared schemas (R-025).

## Security / Privacy Considerations

- Exclude restricted GM-only attributes unless explicitly flagged.

## Performance Considerations

- Stream exports to avoid buffering large objects.

## Accessibility & UX Notes

- CLI and UI documentation with clear steps.

## Operational Considerations

- Audit log for import actions.
- Feature flag: CANON_IMPORT_ENABLED.

## Open Questions

- OQ-R040-01: Provide signed export artifacts?
- OQ-R040-02: Support partial import (subset of versions)?

## Alternatives Considered

- Ad-hoc database dumps: Rejected (not portable / version-aware).
- Proprietary binary format: Rejected (barrier to community tooling).

## Definition of Done

- Export & import endpoints implemented.
- Validation + dry run tested.
- Docs include schema reference.

## Appendix (Optional)

Export envelope example:

```json
{ "schemaVersion": 1, "canon": { "id": "c1" }, "versions": [] }
```

---
Template compliance confirmed.
