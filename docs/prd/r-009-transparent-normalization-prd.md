# PRD: R-009 Transparent Normalization

Requirement ID: R-009
Source: requirements.md Section 2
Status: Draft
Owner: PRODUCT
Last Updated: YYYY-MM-DD

## Summary

Provide normalization pipeline with user visibility, provenance, and manual override capability.

## Problem / Opportunity

Opaque normalization erodes trust; users need transparency and control over derived facts.

## Goals

- Deterministic normalization (regex rules first)
- Optional LLM fallback (flagged) with provenance logging
- Manual override + audit trail

## Non-Goals

- Automatic conflict resolution between concurrent overrides

## User Stories

1. As a GM, I see original and normalized values side-by-side.
2. As a player, my original text is preserved.
3. As a GM, I revert or edit a normalized fact and lock it from reprocessing.

## Functional Scope

- Store raw input + normalized atoms
- UI diff/compare view (original vs normalized)
- Override mechanism with audit metadata (who/when/method)

## Out of Scope

- Multi-user simultaneous edit coordination

## Acceptance Criteria

- GIVEN normalization step THEN log records rule source (regex | LLM).
- GIVEN override applied THEN subsequent re-normalization skips overridden atom.
- Audit trail lists change history with actor + timestamp.

## Metrics / KPIs

- Override success rate (no rollback) > 95%
- Incidents of unintended overwrite = 0

## Risks & Mitigations

- Risk: Override conflicts with schema update → Mitigation: re-validation on load + warning.

## Dependencies

- Normalization rules engine (R-057..R-062 contextually later)

## Security / Privacy Considerations

- Restricted metadata never shown to unauthorized roles.

## Performance Considerations

- Normalization pipeline adds <10% latency to submission processing.

## Operational Considerations

- Feature flag controlling LLM fallback activation.

## Open Questions

- Do we need partial rollback of subsets of atoms?

## Alternatives Considered

- Hidden normalization (rejected: lacks transparency)

## Definition of Done

- Pipeline implemented, override UI shipped, audit logs validated via tests.
