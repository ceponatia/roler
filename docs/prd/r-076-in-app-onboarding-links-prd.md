# PRD: In-App Onboarding Links & Guides (R-076)

Requirement ID: R-076
Source: requirements.md Section 16 (Frontend Requirements)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide contextual help links and quick-start guidance in-app (tooltips, help panel) to accelerate new GM onboarding without external documentation dependence.

## Problem / Opportunity

New users face steep learning curve; absence of inline guidance increases drop-off. Embedded pointers reduce time-to-first-success.

## Goals

- Persistent help icon opening a panel with relevant docs.
- Contextual tooltips on key controls (first-run prominence).
- Link mapping maintained to external docs with stable anchors.

## Non-Goals

- Full interactive tutorial walkthrough (future).
- Gamified onboarding quests.

## User Stories

1. As a new GM, I open help panel and follow steps to create first entity.
2. As a returning user, I dismiss tooltips permanently.
3. As a doc maintainer, I update a guide link without code changes (config driven).

## Functional Scope

- Help panel component loading markdown snippets.
- Tooltip registry keyed by element id with dismissal persistence (local storage).
- Config file mapping keys → external doc URLs.

## Out of Scope

- Multi-page progressive tutorial state machine.

## Acceptance Criteria

- GIVEN first visit WHEN viewing entity editor THEN tooltip for override panel appears once.
- GIVEN tooltip dismissed WHEN revisiting THEN it does not reappear.
- GIVEN help panel link updated in config WHEN reloaded THEN new destination used.
- All criteria trace back to R-076.

## Metrics / KPIs

- Tooltip Dismissal Rate.
- Help Panel Open Rate.
- Time to First Entity Creation (improvement target).

## Risks & Mitigations

- Risk: Tooltip fatigue → Mitigation: One-time display + consolidated panel.
- Risk: Stale links → Mitigation: Link checker CI job.

## Dependencies

- Feature organization (R-073).

## Security / Privacy Considerations

- Avoid embedding sensitive GM-only text in static help accessible to players.

## Performance Considerations

- Lazy-load help content to avoid initial bundle bloat.

## Accessibility & UX Notes

- Tooltips accessible via focus + aria-describedby.

## Operational Considerations

- Telemetry events on help usage.

## Open Questions

- OQ-R076-01: Provide search within help panel?

## Alternatives Considered

- Rely solely on external docs — Rejected (context switching cost).

## Definition of Done

- Help panel & tooltips shipped.
- Config-driven link mapping.
- Tests for dismissal persistence.

## Appendix (Optional)

Tooltip config example: `[ { id: 'override-panel', docKey: 'overrides' } ]`.

---
Template compliance confirmed.
