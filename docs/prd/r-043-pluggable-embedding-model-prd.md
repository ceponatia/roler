# PRD: Pluggable Embedding Model (R-043)

Requirement ID: R-043
Source: requirements.md Section 10 (Retrieval / RAG)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide an abstraction layer for embedding generation allowing local default models with optional external provider substitution while maintaining consistent vector dimensionality contracts.

## Problem / Opportunity

Hard dependency on a single model blocks quality upgrades or privacy-first deployment choices. Pluggable embedding providers enable experimentation and compliance flexibility.

## Goals

- EmbeddingProvider interface (embedBatch(text[])).
- Config-driven provider selection + dimension validation.
- Caching/warmup to minimize latency.

## Non-Goals

- Automatic multi-model ensemble blending.
- On-the-fly vector dimensionality conversion.

## User Stories

1. As an operator, I switch embedding provider without code changes.
2. As a developer, I rely on stable embedding dimension enforced at startup.
3. As a privacy-focused GM, I run local embeddings only.

## Functional Scope

- Provider registry & interface.
- Dimension consistency check.
- Metrics: embedding latency, batch size efficiency.

## Out of Scope

- Model quality evaluation harness.
- Vector quantization pipeline.

## Acceptance Criteria

- GIVEN provider switch WHEN service restarts THEN dimension check passes or aborts with error.
- GIVEN batch embed request WHEN processed THEN latency recorded and result lengths match input.
- GIVEN invalid provider id WHEN startup THEN process exits with clear message.
- All criteria trace back to R-043.

## Metrics / KPIs

- Embedding p95 Latency.
- Batch Utilization Ratio.
- Provider Switch Success Time.

## Risks & Mitigations

- Risk: Dimension mismatch → Mitigation: Hard check + migration doc.
- Risk: Latency regression with hosted provider → Mitigation: Metrics & fallback local option.
- Risk: Memory pressure from warmup → Mitigation: Configurable pool size.

## Dependencies

- Retrieval interface (R-041).
- Local LLM support (R-015) environment.

## Security / Privacy Considerations

- Ensure restricted text not sent externally without opt-in.

## Performance Considerations

- Batch sizing heuristics documented.

## Accessibility & UX Notes

- Diagnostics endpoint lists provider & dimension.

## Operational Considerations

- Feature flag: EMBEDDING_PROVIDER.

## Open Questions

- OQ-R043-01: Standardize on cosine or allow provider-specific distance?
- OQ-R043-02: Include model version in retrieval metadata?

## Alternatives Considered

- Single hard-coded model: Rejected (reduces flexibility).
- Immediate multi-provider ensemble: Rejected (complexity vs value now).

## Definition of Done

- Interface + at least local & one external adapter.
- Startup dimension check implemented.
- Metrics & docs updated.

## Appendix (Optional)

Interface sketch:

```ts
interface EmbeddingProvider { embedBatch(text: string[]): Promise<number[][]> }
```

---
Template compliance confirmed.
