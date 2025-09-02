# PRD: Property & Fuzz Normalization Tests (R-087)

Requirement ID: R-087
Source: requirements.md Section 18 (Testing Strategy)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Implement property-based and fuzz tests targeting normalization pipeline robustness against malformed, adversarial, or edge-case input, ensuring no crashes and bounded performance.

## Problem / Opportunity

Rule-based extraction vulnerable to catastrophic regex or unhandled inputs; fuzzing uncovers vulnerabilities pre-production.

## Goals

- Random input generator (length, unicode categories).
- Assertions: no exceptions, latency under threshold, output invariants hold.
- Corpus of minimized failing cases (if discovered) for regression retention.

## Non-Goals

- Full security fuzzing of all endpoints (scope limited to normalization functions initially).

## User Stories

1. As a developer, I catch regex catastrophic backtracking before release.
2. As a security reviewer, I confirm no panic or crash with malformed inputs.
3. As a maintainer, I store minimal failing seeds for deterministic replay.

## Functional Scope

- Fuzz harness using property-based testing library.
- Input shrinker storing minimal failing case.
- Latency timing wrapper.

## Out of Scope

- Fuzzing of streaming layer.

## Acceptance Criteria

- GIVEN random inputs (N≥1000) WHEN normalization runs THEN zero uncaught exceptions.
- GIVEN discovered failing input WHEN minimized THEN persisted in regression corpus.
- GIVEN long input (length ≥10k chars) WHEN processed THEN latency <200 ms.
- All criteria trace back to R-087.

## Metrics / KPIs

- Fuzz Iterations per Second.
- Crash Count (target 0).

## Risks & Mitigations

- Risk: Test flakiness due to randomness → Mitigation: Seed logged & deterministic per CI run.
- Risk: Long fuzz duration → Mitigation: Time budget with iteration cap.

## Dependencies

- Deterministic normalization (R-057).

## Security / Privacy Considerations

- Ensure generated strings do not inadvertently include sensitive tokens (random only).

## Performance Considerations

- Profiling to identify hot regex patterns.

## Accessibility & UX Notes

- N/A.

## Operational Considerations

- Nightly extended fuzz run separate from PR quick run.

## Open Questions

- OQ-R087-01: Expand fuzz scope to retrieval query parsing later?

## Alternatives Considered

- Manual edge case crafting only — Rejected (limited coverage).

## Definition of Done

- Fuzz harness & seeds committed.
- Latency assertions enforced.
- Documentation of harness usage.

## Appendix (Optional)

Seed record sketch: `{ seed, inputSummary, minimizedCase }`.

---
Template compliance confirmed.
