# PRD: Deterministic Prompt Assembly (R-044)

Requirement ID: R-044
Source: requirements.md Section 10 (Retrieval / RAG)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Assemble LLM prompts deterministically from retrieved context (ordered results + normalized attributes) to ensure reproducibility, cacheability, and debuggability of generation outputs.

## Problem / Opportunity

Non-deterministic prompt construction (unordered concatenation, inconsistent separators) leads to hard-to-reproduce outputs and evaluation noise. Determinism enables regression testing and fairness across backend changes.

## Goals

- Stable ordering & section delimiters.
- Clear provenance annotations per chunk/attribute.
- Hashable prompt representation for caching.

## Non-Goals

- Dynamic style adaptation / persona insertion (future extension).
- Model-specific fine-tuning tokens beyond delimiter design.

## User Stories

1. As a developer, I reproduce a prior response using identical prompt hash.
2. As an evaluator, I diff prompts across backend changes to detect variations.
3. As a maintainer, I adjust formatting rules centrally without touching callers.

## Functional Scope

- PromptAssembler module (input: ordered retrieval items + metadata → string template).
- Deterministic delimiters, section header rules.
- Prompt hash (e.g., SHA256) for caching & logging.

## Out of Scope

- Semantic chunk re-ranking.
- Inline tool invocation directives.

## Acceptance Criteria

- GIVEN identical retrieval result list WHEN assembled twice THEN output byte-identical.
- GIVEN formatting rule update WHEN version bumped THEN hash changes predictably.
- GIVEN restricted attribute WHEN encountered THEN excluded or redacted per policy.
- All criteria trace back to R-044.

## Metrics / KPIs

- Prompt Assembly Latency.
- Cache Hit Rate (if caching layer present).
- Hash Collision Incidents: 0.

## Risks & Mitigations

- Risk: Overly large prompts → Mitigation: Truncation policy with annotated omission count.
- Risk: Formatting rigidity reduces future flexibility → Mitigation: Versioned ruleset.
- Risk: Redaction omissions → Mitigation: Test suite with restricted fixtures.

## Dependencies

- Field-aware retrieval (R-042).
- Redaction rules (R-059/067/077).

## Security / Privacy Considerations

- Ensure restricted segments removed prior to final assembly.

## Performance Considerations

- String builder approach to minimize allocations.

## Accessibility & UX Notes

- Developer docs show annotated example prompt.

## Operational Considerations

- Log prompt hash + retrieval ids (not full content) for traceability.

## Open Questions

- OQ-R044-01: Include deterministic timestamp header or omit temporal data?
- OQ-R044-02: Provide JSON-form prompt variant for structured models?

## Alternatives Considered

- Ad-hoc concatenation: Rejected (non-reproducible).
- Overly dynamic templating engine now: Rejected (complexity > value).

## Definition of Done

- Assembler implemented & tested.
- Hash logged + docs updated.
- Redaction tests pass.

## Appendix (Optional)

Simplified assembly example:

```text
ATTRIBUTES:\n- eyes.color: blue\n\nCHUNKS:\n1. <chunk text>
```

---
Template compliance confirmed.
