# PRD: Incremental Chat View (R-070)

Requirement ID: R-070
Source: requirements.md Section 16 (Frontend Requirements)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide a chat interface that renders streaming tokens and retrieval context incrementally, maintaining smooth scroll behavior and minimal layout shift.

## Problem / Opportunity

Full-response rendering delays feedback and harms engagement. Incremental token display leverages streaming backend (R-051) to improve responsiveness.

## Goals

- Live token append with efficient batching.
- Retrieval context panel updating when retrieval events arrive.
- Auto-scroll logic respecting user manual scroll (stickiness off when user scrolls up).

## Non-Goals

- Threaded conversation UI (single linear baseline).
- Offline chat caching.

## User Stories

1. As a player, I watch the assistant message appear progressively.
2. As a GM, I inspect streamed context items while generation continues.
3. As a tester, I verify scroll anchoring does not jump mid-stream when scrolled up.

## Functional Scope

- Streaming SSE consumer.
- Token buffer store (integration with R-053 assembly).
- Context sidebar updating on retrieval events (R-052).

## Out of Scope

- Message reactions / emoji.
- Multi-room switching.

## Acceptance Criteria

- GIVEN streaming message WHEN first tokens arrive THEN UI updates within 100 ms of receipt.
- GIVEN user scrolls up mid-stream WHEN new tokens arrive THEN scroll position unchanged.
- GIVEN retrieval events WHEN emitted THEN context items list updates in order of rank.
- All criteria trace back to R-070.

## Metrics / KPIs

- Frame Render Count per 100 tokens.
- Token Display Latency (arrival → paint) p95 <120 ms.

## Risks & Mitigations

- Risk: Excess re-renders → Mitigation: Batch tokens per animation frame.
- Risk: Scroll jitter → Mitigation: Intersection observer for bottom sentinel.

## Dependencies

- Streaming transport (R-051) & assembly (R-053).

## Security / Privacy Considerations

- Redact restricted context items (R-059) from player view.

## Performance Considerations

- Virtualization not required initially (messages limited) but design allows extension.

## Accessibility & UX Notes

- aria-live polite region for token stream; retrieval list labeled.".

## Operational Considerations

- None.

## Open Questions

- OQ-R070-01: Persist stream mid-flight on navigation?

## Alternatives Considered

- Polling model — Rejected (latency & overhead).

## Definition of Done

- Streaming chat component shipped.
- Performance baseline captured.
- Tests for scroll behavior.

## Appendix (Optional)

Store shape sketch: `{ messages: Message[], streaming: { id, tokens: string[] } }`.

---
Template compliance confirmed.
