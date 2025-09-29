# PRD: Data Residency & Local Inference (R-081)

Requirement ID: R-081
Source: requirements.md Section 17 (Security & Access Controls)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Ensure sensitive game data remains local by default; model inference and embeddings run on local infrastructure unless explicit opt-in to external providers is configured.

## Problem / Opportunity

External model APIs introduce privacy risk, jurisdictional concerns, and cost unpredictability. Local inference strengthens control.

## Goals

- Default config uses local models (Ollama) only.
- Opt-in flag required for external provider usage.
- Audit log entry when external provider first used per session.

## Non-Goals

- Federated data residency across multiple regions.
- Automatic data anonymization for external calls (manual prompt design baseline).

## User Stories

1. As a privacy-conscious GM, I confirm no data leaves local server.
2. As an operator, I enable external provider for benchmarking with explicit env flag.
3. As a compliance reviewer, I view audit entries of external usage.

## Functional Scope

- Config gating provider selection.
- Warning log if external provider enabled.
- Telemetry capturing external call count.

## Out of Scope

- Multi-provider load balancing.

## Acceptance Criteria

- GIVEN default config WHEN system runs THEN external calls count = 0.
- GIVEN external provider flag enabled WHEN first inference occurs THEN audit log emitted.
- GIVEN flag disabled WHEN attempt to select external provider THEN error produced.
- All criteria trace back to R-081.

## Metrics / KPIs

- External Inference Call Count.
- Percentage Local vs External Calls.

## Risks & Mitigations

- Risk: Silent fallback to external provider → Mitigation: Explicit flag requirement + fail-fast.
- Risk: Performance gap local vs external → Mitigation: Benchmark report before decision.

## Dependencies

- Env validation (R-078).
- Backend selection patterns (R-055 for concept parity).

## Security / Privacy Considerations

- Redact restricted data if ever external path chosen.

## Performance Considerations

- Monitor local model latency vs target (R-054, PT-140 influence).

## Accessibility & UX Notes

- Informational UI flag in settings (GM only) indicating provider.

## Operational Considerations

- Alert if external usage spikes unexpectedly.

## Open Questions

- OQ-R081-01: Provide per-game override vs global only?

## Alternatives Considered

- Always external — Rejected (privacy & cost).

## Definition of Done

- Config gating implemented.
- Audit & telemetry integrated.
- Docs updated.

## Appendix (Optional)

Config example: `EXTERNAL_PROVIDER_ENABLED=false`.

---
Template compliance confirmed.
