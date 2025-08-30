# PRD: R-006 Custom Entities & Plugins

Requirement ID: R-006
Source: requirements.md Section 2
Status: Draft
Owner: PRODUCT
Last Updated: YYYY-MM-DD

## Summary

Support custom entity types, attributes, and plugin-style feature injection with safe registration and conflict detection.

## Problem / Opportunity

Static entity schema limits campaign customization and ecosystem growth.

## Goals

- Register new entity archetypes & attributes
- Provide hook points (pre-save, post-normalize, retrieval augment)
- Enforce unique namespacing for attributes

## Non-Goals

- Remote marketplace distribution
- Runtime code sandboxing

## User Stories

1. As a developer, I add a new entity archetype with domain attributes.
2. As a GM, I extend attributes (factions, reputation) for campaign flavor.
3. As an integrator, I add a plugin for automated status effects.

## Functional Scope

- Registration manifest API (id, version, capabilities)
- Validation extension injection for custom schemas
- Hook lifecycle (pre-save, post-normalize, retrieval enrich)

## Out of Scope

- Auto-updates of third-party plugins

## Acceptance Criteria

- GIVEN plugin registering attribute already existing THEN conflict error emitted.
- GIVEN custom attribute flagged retrievable THEN it appears in retrieval context.
- Example plugin exercises each hook category in tests.

## Metrics / KPIs

- Time to build sample plugin < 2 hours
- Collision rate after namespacing rollout = 0

## Risks & Mitigations

- Risk: Plugin order dependency → Mitigation: explicit priority ordering + diagnostics log.

## Dependencies

- Extensible framework (R-001)
- Boundary validation (R-004)

## Security / Privacy Considerations

- Attribute registration cannot override restricted metadata flags.

## Performance Considerations

- Hook chain adds <5 ms p95 per mutation.

## Operational Considerations

- Feature flag to disable third-party plugin loading.

## Open Questions

- Should plugin manifests declare min/max framework version?

## Alternatives Considered

- Hard-coded entity list (rejected: inflexible)

## Definition of Done

- Manifest API implemented, hooks tested, example plugin published, docs updated.
