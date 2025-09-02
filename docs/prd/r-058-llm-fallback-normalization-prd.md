# PRD: LLM Fallback Normalization (R-058)

Requirement ID: R-058
Source: requirements.md Section 14 (Normalization & Canonical Data)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Introduce an optional, feature-flagged LLM fallback to propose additional attribute atoms when deterministic rules (R-057) produce low coverage or ambiguity, while clearly annotating AI-derived atoms for review.

## Problem / Opportunity

Some nuanced attributes (motivations, abstract traits) are hard to capture with strict patterns. A selectively invoked LLM can enhance recall without compromising determinism for core facts, provided outputs are flagged and reviewable.

## Goals

- Conditional invocation only when rule-based extraction yields below a configurable coverage threshold.
- Clear provenance marking: `source: "llm"` vs `"rule"`.
- Ability for GM to accept or discard proposed atoms before persistence.

## Non-Goals

- Blind automatic persistence of all LLM suggestions.
- Replacing deterministic pipeline (must remain primary).

## User Stories

1. As a GM, I optionally see suggested traits not captured by rules and can accept them.
2. As a developer, I can disable the fallback via feature flag without code changes.
3. As an operator, I track fallback invocation rate to evaluate cost/benefit.

## Functional Scope

- Coverage assessment (e.g., number of atoms vs heuristic expectation or configurable minimum).
- Fallback invocation with prompt containing original text + extracted atoms.
- Suggestion list returned with confidence scores (relative, opaque scale acceptable initially).

## Out of Scope

- Automatic multi-turn clarification dialogues.
- Real-time incremental fallback streaming.

## Acceptance Criteria

- GIVEN flag disabled WHEN low coverage detected THEN no LLM call occurs.
- GIVEN fallback invoked WHEN suggestions returned THEN each carries `source: "llm"` and review status default `pending`.
- GIVEN GM rejects a suggestion WHEN saved THEN rejected atom not persisted or re-proposed for same text hash.
- All criteria trace back to R-058.

## Metrics / KPIs

- Fallback Invocation Rate (% of submissions).
- Suggestion Acceptance Rate.
- Added Latency p95 (<400 ms target).
- Cost per Accepted Atom (if model cost tracked).

## Risks & Mitigations

- Risk: Hallucinated attributes → Mitigation: Require explicit acceptance, mark provenance.
- Risk: Latency inflation → Mitigation: Threshold gating & parallelization with post-processing.
- Risk: Cost overruns → Mitigation: Rate limits & monitoring of invocation rate.

## Dependencies

- Deterministic normalization (R-057).
- Embedding/LLM model availability (R-015, R-043).

## Security / Privacy Considerations

- Ensure restricted (GM-only) sections not sent to external models unless local inference (R-106) or redacted.

## Performance Considerations

- Async fallback request can complete after initial save; accepted suggestions applied via patch.

## Accessibility & UX Notes

- UI marks suggestions with badge (e.g., "Suggested") and clear accept/reject buttons.

## Operational Considerations

- Feature flag: NORMALIZATION_LLM_FALLBACK_ENABLED.
- Configurable coverage threshold & max suggestions.

## Open Questions

- OQ-R058-01: Minimum confidence threshold before displaying suggestions?
- OQ-R058-02: Persist negative feedback to refine future prompts?

## Alternatives Considered

- Always-on LLM extraction — Rejected (cost/latency, reduced trust).
- No fallback (rules only) — Rejected (insufficient coverage for abstract traits).

## Definition of Done

- Fallback path implemented with provenance marking.
- Flag & threshold configurable and documented.
- Metrics & tests (flag on/off, acceptance flow).

## Appendix (Optional)

Suggestion atom example:

```json
{ "path": "personality.trait", "value": "stoic", "source": "llm", "confidence": 0.72, "status": "pending" }
```

---
Template compliance confirmed.
