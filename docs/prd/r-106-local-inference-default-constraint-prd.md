# PRD: R-106 Local Inference Default Constraint

Requirement ID: R-106
Source: requirements.md Section 22
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Maintain local LLM/embedding inference as default execution mode (R-015, R-081) with explicit opt-in required for external providers to preserve privacy and cost control.

## Problem / Opportunity

Silent fallback to hosted providers could leak data and increase costs; enforcing explicit opt-in preserves user trust.

## Goals

- Config flag must be set + acknowledged before remote inference used.
- Warning logged if remote mode enabled including reason field.
- Tests ensuring default remains local.

## Non-Goals

- Implementing remote providers themselves (assumed available separately).

## User Stories

1. As a privacy-conscious GM, I know data stays local unless I opt in.
2. As an operator, I can audit when remote inference enabled and by whom/change record.
3. As a developer, I fail tests if I accidentally set remote as default.

## Functional Scope

- Config flag + validation.
- Audit log entry on remote enablement.
- Test asserting default path selection.

## Out of Scope

- Cost tracking dashboards.

## Acceptance Criteria

- GIVEN default config WHEN service starts THEN local inference selected.
- GIVEN remote flag without acknowledgment variable WHEN start THEN startup fails.
- GIVEN remote enablement WHEN invoked THEN audit log recorded.

## Metrics / KPIs

- Remote inference enablement count.

## Risks & Mitigations

- Risk: Hidden code path forcing remote → Mitigation: integration test verifying provider identity.

## Dependencies

- R-094 (config), R-078, R-081.

## Security / Privacy Considerations

- Data never sent externally unless explicit opt-in.

## Performance Considerations

- Local inference resource monitoring recommended (future).

## Operational Considerations

- Runbook: enabling remote for troubleshooting with rollback steps.

## Open Questions

- OQ: Should we hash prompts for local privacy analytics?

## Alternatives Considered

- Implicit fallback — rejected (privacy risk).

## Definition of Done

- Default enforced.
- Tests & audit coverage in place.
- Docs updated (privacy section).

---
