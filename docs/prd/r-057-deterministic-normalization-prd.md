# PRD: Deterministic Normalization (R-057)

Requirement ID: R-057
Source: requirements.md Section 14 (Normalization & Canonical Data)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Implement a deterministic normalization pipeline that transforms free-form entity submissions into structured attribute atoms (e.g., `eyes.color(blue)`) using regex and rule-based extraction to enable consistent retrieval, diffing, and downstream reasoning.

## Problem / Opportunity

Unstructured player or GM text leads to inconsistent attribute storage, hurting retrieval quality and diff/merge semantics. A deterministic, testable normalization layer produces stable facts without relying on probabilistic models, improving trust and enabling efficient indexing.

## Goals

- Deterministic rule-driven extraction of attribute atoms from submissions.
- Idempotent normalization: repeated runs on identical input yield identical output ordering & atoms.
- Low-latency processing suitable for synchronous feedback (<50 ms p95 per submission at baseline size).

## Non-Goals

- LLM-based disambiguation (handled by optional fallback R-058).
- Semantic inference beyond explicit, pattern-captured statements.

## User Stories

1. As a GM, I see structured attributes auto-populate after submitting entity lore.
2. As a developer, I can add a new regex rule with tests without affecting unrelated rules.
3. As an operator, I monitor normalization latency & extraction coverage metrics.

## Functional Scope

- Rule registry (ordered application, priority & version tagging).
- Extraction engine producing atoms with: path, value, sourceSpan, ruleId.
- Deterministic ordering (stable sort by path then rule priority then sourceSpan).

## Out of Scope

- Conflict resolution between user overrides (R-062 handles overrides).
- Heuristic or fuzzy matching beyond defined rules.

## Acceptance Criteria

- GIVEN identical submission processed twice WHEN normalization runs THEN outputs are byte-identical JSON arrays.
- GIVEN a new rule added WHEN tests run THEN existing unrelated rule outputs unchanged (snapshot test stability).
- GIVEN malformed input (empty or whitespace) WHEN normalized THEN result is empty atom list (no errors).
- All criteria trace back to R-057.

## Metrics / KPIs

- Extraction Precision (manual sample) ≥90% baseline.
- Extraction Recall (manual sample) ≥85% baseline.
- Normalization Latency p95 <50 ms (baseline corpus size).
- Rule Failure Rate (exceptions) = 0.

## Risks & Mitigations

- Risk: Regex over-capture producing false positives → Mitigation: Unit tests + precision sampling.
- Risk: Rule ordering regressions → Mitigation: Priority metadata and regression snapshots.
- Risk: Performance degradation as rules grow → Mitigation: Precompiled patterns & short-circuit logic.

## Dependencies

- Data model for AttrAtom (R-036).
- Logging & observability (R-063 to R-067) for metrics.

## Security / Privacy Considerations

- Avoid capturing restricted secrets inadvertently; rules limited to whitelisted attribute namespaces.

## Performance Considerations

- Precompile regex patterns on module load.
- Avoid catastrophic backtracking (regex audit & safe patterns).

## Accessibility & UX Notes

- Provide immediate UI feedback (highlight extracted attributes) for transparency.

## Operational Considerations

- Feature flag not required (core baseline capability).
- Version each rule; expose registry introspection endpoint (read-only) for debugging.

## Open Questions

- OQ-R057-01: Should we canonicalize numeric units (e.g., "6 ft" → meters) at this layer or a later enrichment step?
- OQ-R057-02: Support locale-aware parsing (dates, numbers) initially?

## Alternatives Considered

- Pure LLM extraction from start — Rejected (non-deterministic, higher latency/cost).
- Manual only attribute entry — Rejected (higher friction, inconsistent coverage).

## Definition of Done

- Rule engine implemented with tests.
- Precision/recall sampling process documented.
- Latency metrics instrumented.

## Appendix (Optional)

Atom JSON shape example:

```json
{ "path": "eyes.color", "value": "blue", "sourceSpan": [12, 21], "ruleId": "color.v1" }
```

---
Template compliance confirmed.
