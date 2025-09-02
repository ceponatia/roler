# PRD: Restricted Field Exclusion in Prompts (R-077)

Requirement ID: R-077
Source: requirements.md Section 17 (Security & Access Controls)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Automatically exclude GM-restricted fields from player prompt assembly ensuring narrative secrets remain confidential while preserving GM full context.

## Problem / Opportunity

Manual filtering is error-prone; a centralized exclusion layer guarantees consistent privacy enforcement and reduces accidental leakage risk.

## Goals

- Central prompt assembly filter respecting `restricted` flag.
- Separate GM vs Player context generation paths.
- Test matrix verifying exclusion across attribute types.

## Non-Goals

- Encryption of restricted data in transit (TLS assumed sufficient).
- Fine-grained per-player exceptions.

## User Stories

1. As a Player, I never receive secret plot attributes in AI responses.
2. As a GM, I retain full context for high-fidelity generation.
3. As a security auditor, I review tests demonstrating exclusion coverage.

## Functional Scope

- Filter function integrated before embedding & retrieval assembly.
- Logging redaction synergy (R-065, R-067) validates path parity.
- Metrics counting filtered atoms per request.

## Out of Scope

- Dynamic reveal mechanics (manual GM reveal only initial baseline).

## Acceptance Criteria

- GIVEN player prompt assembly WHEN restricted atoms present THEN they are omitted.
- GIVEN GM assembly WHEN restricted atoms present THEN they are included.
- GIVEN mismatch test (player path leakage) WHEN run THEN test fails.
- All criteria trace back to R-077.

## Metrics / KPIs

- Leakage Incidents (target 0).
- Filtered Atom Count (monitor anomalies).

## Risks & Mitigations

- Risk: Divergent filtering logic per call site → Mitigation: Single assembly entrypoint.
- Risk: Performance overhead → Mitigation: O(n) filter over small list acceptable.

## Dependencies

- Restricted tagging (R-059).
- Prompt assembly (R-044).

## Security / Privacy Considerations

- Validate no restricted content leaves system for player context.

## Performance Considerations

- Minimal; simple predicate filtering.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- Alert if leakage incident metric >0.

## Open Questions

- OQ-R077-01: Provide GM override to include specific restricted atom for player reveal inline?

## Alternatives Considered

- Ad-hoc filtering — Rejected (inconsistent).

## Definition of Done

- Filter implemented & tested.
- Metrics instrumented.
- Docs updated.

## Appendix (Optional)

Filtered atom log snippet: `{ "filtered": 3 }`.

---
Template compliance confirmed.
