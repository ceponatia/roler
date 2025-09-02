# PRD: Incremental Client Assembly (R-053)

Requirement ID: R-053
Source: requirements.md Section 12 (Streaming & Realtime)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Provide a client-side state layer that assembles streamed token events in order, handles partial updates, and exposes stable interfaces for UI components.

## Problem / Opportunity

Ad-hoc concatenation leads to race conditions, flicker, and duplication in UI. A structured assembly store abstracts ordering, error handling, and finalization.

## Goals

- Ordered accumulation of tokens with minimal re-rendering.
- Support cancellation and partial transcript retention.
- Emit derived state (isStreaming, progress metrics).

## Non-Goals

- Offline caching of entire chat history (separate persistence concern).
- Multi-tab synchronization (future enhancement).

## User Stories

1. As a player, streamed text appears smoothly without jumps.
2. As a developer, I subscribe to a store for streaming state rather than implementing manual buffering.
3. As a tester, I simulate dropped connection and verify safe recovery messaging.

## Functional Scope

- Token accumulator buffering minimal string segments.
- Finalization logic (on done or error) marking transcript complete.
- Error propagation and retry hook.

## Out of Scope

- Multi-stream aggregation in a single UI panel.
- Rich formatting (markdown rendering separate layer).

## Acceptance Criteria

- GIVEN token events sequence WHEN received THEN assembled text equals concatenation in order without duplication.
- GIVEN cancellation WHEN invoked THEN assembly stops and state flagged aborted.
- GIVEN error event WHEN received THEN assembly finalizes with error state preserved.
- All criteria trace back to R-053.

## Metrics / KPIs

- UI Render Count per 100 tokens.
- Assembly Error Rate.
- Average Cancel Handling Latency.

## Risks and Mitigations

- Risk: Memory growth for long streams → Mitigation: Chunk segmentation and windowing (future optimization).
- Risk: Race conditions → Mitigation: Single-threaded queue dispatch.
- Risk: Excess re-renders → Mitigation: Batch updates using requestAnimationFrame or microtask.

## Dependencies

- Streaming transport (R-051).
- Token event schema.

## Security and Privacy Considerations

- Avoid logging raw token buffer in client debug tools by default.

## Performance Considerations

- Minimize string concatenation cost by using array join pattern.

## Accessibility and UX Notes

- Live region updates throttled to prevent screen reader flood.

## Operational Considerations

- No server operational burden; client monitoring via telemetry optional.

## Open Questions

- OQ-R053-01: Provide diff-based updates for rich formatting layer.
- OQ-R053-02: Persist partial tokens on reconnect attempt.

## Alternatives Considered

- Direct DOM append per token: Rejected (performance and flicker).
- Post-stream full text replace: Rejected (delays feedback).

## Definition of Done

- Store implementation and tests.
- Docs with integration example.
- Performance measurement baseline captured.

## Appendix (Optional)

Accumulator pseudo:

```ts
tokens: string[]; onToken(t){ tokens.push(t); }
```

---
Template compliance confirmed.
