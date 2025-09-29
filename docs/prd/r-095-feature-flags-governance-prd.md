# PRD: R-095 Feature Flags Governance

Requirement ID: R-095
Source: requirements.md Section 20
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Introduce governed feature flag system controlling vector backend selection (R-055), normalization LLM fallback (R-058), and dual-read mode (R-056) with auditable changes and safe rollout patterns.

## Problem / Opportunity

Unstructured flags cause inconsistency and risk. Governance ensures traceability, controlled exposure, and cleanup discipline.

## Goals

- Central registry of active flags with metadata (owner, expiry, description).
- Ability to target environment / percentage / role.
- Automated alert for expired past-due flags.

## Non-Goals

- Multi-tenant per-user experimentation framework (basic targeting only initially).

## User Stories

1. As an operator, I can enable dual-read in staging before production.
2. As a developer, I can retire a flag and detect unused code paths.
3. As a GM tester, I can opt into new normalization fallback.

## Functional Scope

- Flag definitions file or service.
- Evaluation API with context (env, role, random seed).
- Audit log for flag state changes.

## Out of Scope

- Real-time UI dashboard editing (initial CLI/config edits suffice).

## Acceptance Criteria

- GIVEN unknown flag key WHEN evaluated THEN returns default false.
- GIVEN expired flag WHEN reached expiry date THEN alert generated.
- GIVEN flag removal WHEN code deployed THEN no runtime evaluation failures.

## Metrics / KPIs

- Count of stale (past-expiry) flags (target 0).
- Flag evaluation latency (<1 ms in-process).

## Risks & Mitigations

- Risk: Flag drift across services → Mitigation: single shared package.
- Risk: Overuse of flags → Mitigation: expiry & owner requirement.

## Dependencies

- R-055, R-056, R-058.

## Security / Privacy Considerations

- Avoid exposing internal flags to clients unless required.

## Performance Considerations

- Pure in-memory map; negligible overhead.

## Operational Considerations

- Weekly job: report upcoming expirations.

## Open Questions

- OQ: Persist flag state changes or rely on Git history only?

## Alternatives Considered

- Hard-coded conditionals — rejected (no audit/targeting capability).

## Definition of Done

- Flag system implemented & documented.
- Tests: evaluation, expiry, removal.
- Initial registry includes required flags.

---
