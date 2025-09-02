# PRD: Configurable Vector Backend Selection (R-055)

Requirement ID: R-055
Source: requirements.md Section 13 (Vector Store Strategy and Scalability)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Allow selecting the active vector store backend (pgvector vs alternative like Qdrant) via configuration without consumer code changes.

## Problem / Opportunity

Hard-coded backend coupling complicates migration and experimentation. Config-driven selection enables phased adoption and rollback.

## Goals

- Single configuration flag or env variable selecting backend.
- Automatic wiring of Retriever implementation (R-041).
- Health validation on startup for chosen backend.

## Non-Goals

- Runtime hot-swapping without restart.
- Multi-backend concurrent primary usage (dual-read covered by R-056).

## User Stories

1. As an operator, I change VECTOR_BACKEND=pgvector to qdrant and restart—system uses new backend.
2. As a developer, I add new backend implementation with minimal config extension.
3. As a maintainer, I detect misconfiguration at startup with clear error.

## Functional Scope

- Config parsing and validation (enum of supported backends).
- Backend factory returning Retriever implementation.
- Startup health probes verifying connectivity and index existence.

## Out of Scope

- Auto-migration of existing vectors to new backend.
- Source-of-truth switching logic.

## Acceptance Criteria

- GIVEN unsupported backend value WHEN startup THEN process aborts with descriptive error code.
- GIVEN valid backend switch WHEN restarted THEN retrieval tests pass unchanged.
- GIVEN connectivity failure WHEN detected THEN startup fails fast.
- All criteria trace back to R-055.

## Metrics / KPIs

- Backend Switch Success Time.
- Startup Failure Count (misconfig).
- Retrieval Error Rate post-switch.

## Risks and Mitigations

- Risk: Divergent capability sets → Mitigation: Capability flags and guarded features.
- Risk: Hidden performance regression → Mitigation: Dual-read comparison (R-056) before full switch.
- Risk: Misconfiguration in production → Mitigation: Strict enum validation and canary.

## Dependencies

- Unified retrieval interface (R-041).
- Outbox sync (R-049) for secondary parity.

## Security and Privacy Considerations

- Ensure credentials or URLs stored securely (env variables validated R-094).

## Performance Considerations

- Baseline benchmark per backend documented.

## Accessibility and UX Notes

- Operational docs provide clear switch steps.

## Operational Considerations

- Feature flag gating new backend rollout.
- Canary game subset for early validation.

## Open Questions

- OQ-R055-01: Provide dry-run connectivity check command.
- OQ-R055-02: Auto-create missing indexes on startup.

## Alternatives Considered

- Hard-coded backend constant: Rejected (inflexibility).
- Abstract service proxy layer now: Rejected (over-engineering early).

## Definition of Done

- Config flag and factory implemented.
- Startup validation and tests.
- Documentation updated.

## Appendix (Optional)

Env example: VECTOR_BACKEND=pgvector.

---
Template compliance confirmed.
