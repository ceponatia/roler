# PRD: Per-Game & Instance Authorization (R-033)

Requirement ID: R-033
Source: requirements.md Section 8 (Authentication & Authorization)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Apply per-game and per-instance authorization to all CRUD operations using a deny-by-default model ensuring users only access entities for games they are explicitly associated with and at the correct role level.

## Problem / Opportunity

Without strict scoping, cross-game data leakage or accidental modification of unrelated instances can occur. Centralized authorization guards reduce repeated logic and improve security posture.

## Goals

- Enforce game + instance scoping on every entity read/write.
- Deny by default if association or permission not present.
- Provide reusable helper utilities minimizing boilerplate.

## Non-Goals

- Cross-game shared object references (future if needed).
- Fine-grained field masking (handled under normalization restrictions R-059/R-077).

## User Stories

1. As a GM, I can only modify entities belonging to games I manage.
2. As a player, I cannot read or modify entities from another GM's game.
3. As a maintainer, I add a new endpoint and attach an authorization guard in one line.

## Functional Scope

- Authorization middleware: validate session → game membership → role.
- Repository helper enforcing gameId filters automatically.
- Central policy map declaring operation → required scope.
- Audit log on denial (userId, gameId, entityId?, op, reason).

## Out of Scope

- Group / team-based aggregation across games.
- Offline mode entity mirroring.

## Acceptance Criteria

- GIVEN a player requesting entity outside their game WHEN processed THEN response 403 and no DB fetch beyond id existence check.
- GIVEN a GM modifying entity in authorized game WHEN request valid THEN update succeeds and audit trail records action.
- GIVEN a new endpoint missing guard WHEN CI policy scan runs THEN build fails with violation.
- All criteria trace back to R-033.

## Metrics / KPIs

- Unauthorized Cross-Game Access Attempts: Tracked (should trend low).
- Guard Coverage: 100% endpoints verified.
- Mean Authorization Check Overhead: <2ms.

## Risks & Mitigations

- Risk: Bypass via direct repository call → Mitigation: Enforced scoped repository wrappers + lint rule.
- Risk: Performance overhead → Mitigation: Index (gameId, entityId) for fast existence checks.
- Risk: Inconsistent audit fields → Mitigation: Shared log utility.

## Dependencies

- Session auth (R-031).
- Role enforcement (R-032).

## Security / Privacy Considerations

- Prevents cross-tenant data leakage.
- Logs denials for anomaly detection.

## Performance Considerations

- Add composite indexes to maintain low-latency authorization checks.

## Accessibility & UX Notes

- Unauthorized actions yield consistent error code enabling accessible feedback.

## Operational Considerations

- Alert if denial spike occurs for particular gameId.

## Open Questions

- OQ-R033-01: Cache membership lookups in memory per request?
- OQ-R033-02: Support future spectator role with read-only cross-entity access?

## Alternatives Considered

- Inline ad-hoc checks: Rejected (error prone, inconsistent).
- Broad global authorization then filtering: Rejected (risk of leakage pre-filter).

## Definition of Done

- Middleware + repository scoping implemented.
- CI guard coverage scan passes.
- Audit logging validated via tests.

## Appendix (Optional)

Scoping pseudo:

```ts
const entity = await repo.get({ id, gameId: ctx.gameId }); // enforced filter
```

---
Template compliance confirmed.
