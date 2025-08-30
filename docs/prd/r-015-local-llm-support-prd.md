# PRD: Local LLM Support (R-015)

Requirement ID: R-015
Source: requirements.md Section 3 (Platform & Technology)
Status: Draft
Owner: Product
Last Updated: 2025-08-29

## Summary

Enable local inference (chat + embeddings) using on-device or self-hosted models (e.g., Ollama) with a pluggable abstraction allowing optional switch to hosted providers while preserving privacy-first operation and consistent API contracts.

## Problem / Opportunity

Relying solely on hosted LLM providers raises cost and data privacy concerns (PII / GM-only narrative leakage). Local models reduce data egress, enable offline / air-gapped scenarios, and provide predictable cost structure while retaining option to leverage hosted models for scale or specialized quality.

## Goals

- Pluggable provider abstraction for chat & embedding requests.
- Local model initialization, health, and warm start to minimize first-token latency.
- Configuration toggle to select provider without code change.

## Non-Goals

- Implementing custom model training pipelines.
- Providing model quantization tooling beyond invoking upstream capabilities.

## User Stories

1. As a privacy-focused GM, I can run all generation locally so that sensitive content never leaves my environment.
2. As an operator, I can switch to a hosted provider via config for improved quality without refactoring code.
3. As a developer, I can detect provider unavailability and gracefully fall back (if enabled) to a secondary provider.

## Functional Scope

- Provider interface (chat(stream), embed(batch)) with unified error shape.
- Local provider: model presence check, lazy download hook (if supported), warm pool management.
- Hosted provider adapter: API key validation, rate limit error mapping.
- Configuration & validation: primary provider, optional fallback provider.

## Out of Scope

- Multi-provider ensemble / routing logic based on prompt classification (future extension).
- Automated evaluation harness for model comparison (handled elsewhere).

## Acceptance Criteria

- GIVEN local provider configured AND model absent WHEN service starts THEN system triggers descriptive error or fetches model (if auto-download enabled) before accepting traffic.
- GIVEN local provider running WHEN chat request made THEN first token latency ≤1s (aligns with R-054) after warm start.
- GIVEN primary provider failure AND fallback enabled WHEN request occurs THEN system retries using fallback and annotates response provenance.
- GIVEN invalid provider id in config WHEN startup occurs THEN process aborts with clear message.
- All criteria trace back to R-015.

## Metrics / KPIs

- First Token Latency (local warmed): ≤1s p95.
- Local Provider Uptime: ≥99% (excluding planned model updates).
- Fallback Invocation Rate: <1% of total requests (indicates primary stability).

## Risks & Mitigations

- Risk: Large model load time delaying startup → Mitigation: Async warm phase with readiness gate & caching of model weights.
- Risk: Quality gap vs hosted models → Mitigation: Document recommended hosted alternatives & evaluation notes.
- Risk: Hardware resource contention (CPU/GPU) → Mitigation: Configurable concurrency & batch limits.

## Dependencies

- Local runtime (e.g., Ollama) or container image with model runtime.
- Embedding consumer components (retrieval pipeline R-041..R-045).

## Security / Privacy Considerations

- Local inference keeps restricted GM-only data on host (aligns with R-059/077/081).
- Hosted provider usage requires explicit opt-in flag (R-106 privacy control alignment).

## Performance Considerations

- Warm pool sizing to balance memory vs latency.
- Embedding batch size tuning for throughput.

## Accessibility & UX Notes

- Configuration status surfaced via diagnostics endpoint indicating provider and model readiness.

## Operational Considerations

- Health check: provider reachable + model loaded.
- Feature flags: LLM_PROVIDER, LLM_FALLBACK_PROVIDER.
- Rolling upgrade guidance when updating model versions.

## Open Questions

- OQ-R015-01: Provide auto-download for models or require manual pre-seed?
- OQ-R015-02: Standard log schema for provider provenance annotations?

## Alternatives Considered

- Hosted-only approach: Rejected (privacy & cost constraints).
- Hard-coded local provider logic: Rejected (prevents hosted fallback extensibility).

## Definition of Done

- Provider abstraction implemented with local + hosted adapters.
- Config validation & startup checks in place.
- Warm start & latency metrics instrumented.
- Fallback pathway tested (forced failure scenario).

## Appendix (Optional)

Diagnostics example:

```json
{
"provider": "local-ollama",
"model": "mistral-instruct-7b",
"status": "ready",
"fallback": "openai-gpt4o (disabled)"
}
```

---
Template compliance confirmed.
