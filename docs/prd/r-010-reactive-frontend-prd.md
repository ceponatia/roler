# PRD: R-010 Reactive Frontend

Requirement ID: R-010
Source: requirements.md Section 3
Status: Accepted
Owner: PRODUCT
Last Updated: 2025-09-29

## Summary

Deliver a web-based reactive frontend supporting incremental streaming updates and real-time entity state reflection.

## Problem / Opportunity

Static or slow-refresh UIs reduce immersion during narrative sessions.

## Goals

- Token streaming UI with sub-second first token
- Real-time entity change propagation
- Modular component architecture

## Non-Goals

- Native mobile client (web-first)

## User Stories

1. As a user, I see messages stream token-by-token.
2. As a GM, entity edits reflect in chat context without page refresh.
3. As a developer, I compose UI from modular, testable components.

## Functional Scope

- Chat & entity Svelte stores
- Streaming component handling incremental tokens and metadata events
- Hot module reload friendly structure

## Out of Scope

- Offline caching mode

## Acceptance Criteria

- GIVEN streaming request THEN first token renders <1s (R-054 linkage).
- GIVEN entity update THEN dependent UI updates without reload.
- Lighthouse performance score ≥ 85 (desktop baseline) in CI run.

## Metrics / KPIs

- First token latency p95 < 1s
- UI update propagation latency < 200 ms

## Risks & Mitigations

- Risk: Over-rendering → Mitigation: granular stores & memoization.

## Dependencies

- Streaming transport (R-051..R-054)
- Logging/perf metrics (R-063..R-067)

## Security / Privacy Considerations

- Role-based filtering ensures restricted data absent from player view.

## Performance Considerations

- Minimize DOM churn with keyed lists and batch updates.

## Operational Considerations

- Feature flag for experimental streaming component variants.

## Open Questions

- Should we implement backpressure handling for slow clients?

## Alternatives Considered

- Polling approach (rejected: latency + inefficiency)

## Definition of Done

- Streaming + reactive updates implemented, metrics instrumentation added, performance threshold validated.
