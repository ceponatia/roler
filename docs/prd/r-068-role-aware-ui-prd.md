# PRD: Role-Aware UI (R-068)

Requirement ID: R-068
Source: requirements.md Section 16 (Frontend Requirements)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Deliver a role-aware frontend that adapts capabilities, navigation, and visibility based on authenticated user role (GM vs Player) to enforce least-privilege UX and clarity.

## Problem / Opportunity

Uniform UI for all users risks accidental exposure of GM-only features and confuses players with irrelevant controls. Dynamic role scoping improves security and usability.

## Goals

- Conditional rendering of GM-only panels (normalization overrides, export tools).
- Unified permissions store derived from session (no ad-hoc checks scattered).
- Consistent role badge in global header for context.

## Non-Goals

- Fine-grained per-attribute custom role matrix (baseline GM vs Player only).
- Anonymous spectator mode (future enhancement).

## User Stories

1. As a Player, I do not see GM-only editing tools.
2. As a GM, I access override controls without switching contexts.
3. As a developer, I consume a single permissions store to gate UI elements.

## Functional Scope

- Session load populating role + game permissions.
- Svelte store `permissions` with derived booleans (isGM, canEditEntities...).
- Utility component for conditional slot rendering.

## Out of Scope

- RBAC management UI.
- Dynamic role elevation flows.

## Acceptance Criteria

- GIVEN GM session WHEN entity page loads THEN override panel visible.
- GIVEN Player session WHEN same page loads THEN override panel absent in DOM.
- GIVEN role switch test (mock) WHEN permissions store updates THEN dependent components rerender with correct visibility.
- All criteria trace back to R-068.

## Metrics / KPIs

- Incorrect Exposure Incidents (target 0).
- Permission Store Lookup Latency (~0 ms in-memory baseline).

## Risks & Mitigations

- Risk: Drift between backend auth and frontend gating → Mitigation: Derive store solely from backend-issued session payload.
- Risk: Client tampering → Mitigation: Server re-validates all actions (defense-in-depth).

## Dependencies

- Authentication & roles (R-031 to R-033).

## Security / Privacy Considerations

- No sensitive data fetch unless role allows; API returns 403 if bypass attempt.

## Performance Considerations

- Lightweight derived store; avoid recomputation loops.

## Accessibility & UX Notes

- Hidden GM features fully removed (not `display:none`) to prevent screen reader confusion.

## Operational Considerations

- Feature flag not required; baseline behavior.

## Open Questions

- OQ-R068-01: Provide UI to preview as Player while logged in as GM?

## Alternatives Considered

- Single UI with disabled controls — Rejected (clutter, potential leaks).

## Definition of Done

- Permissions store implemented.
- Conditional rendering integrated.
- Tests verifying DOM absence for player.

## Appendix (Optional)

Permissions store sketch: `{ role: 'gm' | 'player', isGM: boolean }`.

---
Template compliance confirmed.
