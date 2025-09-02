# PRD: Feature Organization & Discoverability (R-073)

Requirement ID: R-073
Source: requirements.md Section 16 (Frontend Requirements)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Organize UI modules by domain (chat, entities, canon, settings) with navigational affordances improving discoverability and reducing cognitive load.

## Problem / Opportunity

Scattered or inconsistent navigation hampers new GM onboarding and increases support burden. Domain grouping streamlines mental model.

## Goals

- Sidebar or top-level navigation grouping domain areas.
- Consistent page layout shell with content header.
- Route naming aligned with packages (retrieval, canon, games) for traceability.

## Non-Goals

- In-app global search (future enhancement).
- Personalized navigation ordering.

## User Stories

1. As a new GM, I locate entity editor without searching docs.
2. As a player, I only see chat-focused navigation.
3. As a developer, I map UI routes to backend endpoints easily.

## Functional Scope

- Layout component with nav slots.
- Role-based nav item filtering.
- Route naming conventions documented.

## Out of Scope

- Breadcrumbs for deep hierarchy (shallow structure baseline).

## Acceptance Criteria

- GIVEN GM login WHEN viewing navigation THEN sections appear: Chat, Entities, Canon, Settings.
- GIVEN Player login WHEN viewing navigation THEN no Canon or Settings admin items.
- GIVEN new feature route WHEN added THEN docs updated with mapping table.
- All criteria trace back to R-073.

## Metrics / KPIs

- Navigation Misclick Rate (analytics) trending downward.
- Time to First Entity Edit (onboarding metric).

## Risks & Mitigations

- Risk: Overcrowded nav → Mitigation: Collapse lesser-used sections.
- Risk: Drift between docs and nav → Mitigation: Automated route extraction script.

## Dependencies

- Role-aware UI (R-068).

## Security / Privacy Considerations

- Hidden nav items for unauthorized roles (no disabled placeholders).

## Performance Considerations

- Static nav data; minimal runtime overhead.

## Accessibility & UX Notes

- Semantic nav landmark elements; keyboard focus ring maintained.

## Operational Considerations

- None.

## Open Questions

- OQ-R073-01: Add quick tips tooltips on first visit?

## Alternatives Considered

- Flat route list — Rejected (clutter, low grouping clarity).

## Definition of Done

- Nav & layout shipped.
- Tests verifying role filtering.
- Docs mapping routes.

## Appendix (Optional)

Nav data example: `[ { label: 'Chat', path: '/chat', roles: ['gm','player'] } ]`.

---
Template compliance confirmed.
