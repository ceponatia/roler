# PRD: Role Enforcement (R-032)

Requirement ID: R-032
Source: requirements.md Section 8 (Authentication & Authorization)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Enforce Game Master (GM) vs Player role distinctions on all protected endpoints and entity operations to ensure least-privilege access and protect restricted narrative content.

## Problem / Opportunity

Without centralized role enforcement, endpoints risk inconsistent permission checks leading to accidental data exposure or unauthorized actions. A unified guard layer reduces duplication and ensures future role additions (e.g., Observer) integrate cleanly.

## Goals

- Central permission guard composable across HTTP endpoints, workers, and retrieval flows.
- Explicit mapping of operations → required role(s).
- Deny-by-default posture with audited allowlist.

## Non-Goals

- Complex attribute-based access control (future extension if needed).
- Cross-game shared role inheritance.

## User Stories

1. As a GM, I can modify canonical entities while players cannot.
2. As a player, I can view allowed entity data without seeing GM-only fields.
3. As a maintainer, I can add a new endpoint and declare required role via a simple guard helper.

## Functional Scope

- Role guard middleware/utility referencing session context.
- Operation-to-role mapping registry (CRUD, export, normalization override, etc.).
- Integration with retrieval pipeline to filter restricted attributes for players.
- Audit logging of denied attempts (code + userId + operation).

## Out of Scope

- Fine-grained per-field dynamic policies beyond restricted tag filtering (covered in normalization metadata R-059).
- UI role management screens (admin UX later).

## Acceptance Criteria

- GIVEN a player attempts a GM-only endpoint WHEN request processed THEN response is 403 with standardized error code.
- GIVEN a retrieval for a player WHEN restricted attributes exist THEN they are excluded from assembled prompt.
- GIVEN a new endpoint without explicit role guard WHEN lint/CI runs THEN build fails (enforcement rule).
- All criteria trace back to R-032.

## Metrics / KPIs

- Unauthorized Access Attempt Logs per Day (baseline, watch for spikes).
- Percentage of endpoints with declared role guard: 100%.
- Time to add new guarded endpoint: <5 minutes.

## Risks & Mitigations

- Risk: Missed guard on new endpoint → Mitigation: Lint/AST rule + deny-by-default fallback.
- Risk: Overly coarse roles blocking legitimate actions → Mitigation: Review process & future role granularity roadmap.
- Risk: Performance overhead in retrieval filtering → Mitigation: Precomputed restricted attribute sets.

## Dependencies

- Session authentication (R-031).
- Restricted metadata tagging (R-059, R-077).

## Security / Privacy Considerations

- Prevents leakage of GM-only narrative content to players.
- Logs access denials for monitoring suspicious behavior.

## Performance Considerations

- Lightweight guard checks (in-memory role string compare + cached permissions map).

## Accessibility & UX Notes

- Player UI hides GM-only actions to reduce cognitive load (not just rely on server denial).

## Operational Considerations

- Permission map documented and versioned.
- Alert if denial rate spikes unusually (potential probing attack).

## Open Questions

- OQ-R032-01: Introduce observer/spectator read-only role soon?
- OQ-R032-02: Should normalization override require GM role only or future editor role?

## Alternatives Considered

- Scattered inline role checks: Rejected (inconsistent enforcement risk).
- Overly granular ABAC from start: Rejected (complexity without immediate need).

## Definition of Done

- Guard middleware & mapping implemented.
- Lint/CI enforcement verifying guard usage.
- Tests confirming restricted attribute suppression for players.

## Appendix (Optional)

Conceptual permission map snippet:

```ts
export const PERMISSIONS = {
  entityUpdate: ['GM'],
  entityView: ['GM', 'Player'],
  canonExport: ['GM']
} as const;
```

---
Template compliance confirmed.
