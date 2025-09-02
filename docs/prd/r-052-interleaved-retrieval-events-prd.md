# PRD: Interleaved Retrieval Events (R-052)

Requirement ID: R-052
Source: requirements.md Section 12 (Streaming & Realtime)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Allow retrieval or meta events to interleave with streamed token output, giving clients progressive insight into context being used.

## Problem / Opportunity

Users benefit from understanding why the model is responding a certain way; early context preview aids trust and debugging. Interleaving avoids waiting until generation end.

## Goals

- Event types: retrieval.start, retrieval.item, retrieval.complete.
- Ordering guarantees relative to token events (context events precede first dependent tokens when possible).
- Optional inclusion controlled by client parameter.

## Non-Goals

- Real-time dynamic re-ranking mid-generation.
- Client modification of retrieval parameters mid-stream.

## User Stories

1. As a player, I see which lore chunks influenced the answer.
2. As a developer, I debug retrieval misses by inspecting streamed items.
3. As a GM, I toggle retrieval events off for minimalist UI.

## Functional Scope

- Retrieval event emission before or alongside token events.
- Payload: id, type (atom or chunk), rank, truncated preview.
- Client opt-in query parameter.

## Out of Scope

- Post-hoc interactive filtering of context mid-stream.
- Streaming of full canonical document bodies.

## Acceptance Criteria

- GIVEN includeContext enabled WHEN stream starts THEN retrieval.start emitted before first token.
- GIVEN N retrieved items WHEN emitted THEN ranks are contiguous starting at 1.
- GIVEN includeContext disabled WHEN streaming THEN no retrieval.* events present.
- All criteria trace back to R-052.

## Metrics / KPIs

- Retrieval Event Opt-In Rate.
- Average Context Items Streamed.
- Context Event Latency vs Token Start.

## Risks and Mitigations

- Risk: Payload bloat → Mitigation: Truncate previews and limit item count.
- Risk: Ordering race with first token → Mitigation: Buffer initial tokens until retrieval.complete or timeout.
- Risk: Privacy leakage of restricted chunks → Mitigation: Redaction filter prior to emission.

## Dependencies

- Streaming transport (R-051).
- Field-aware retrieval (R-042).

## Security and Privacy Considerations

- Redact restricted data consistently across retrieval events and tokens.

## Performance Considerations

- Ensure added latency before first token <100ms.

## Accessibility and UX Notes

- Screen reader grouping with descriptive headings for context items.

## Operational Considerations

- Config to cap max streamed retrieval items.

## Open Questions

- OQ-R052-01: Provide full chunk fetch link in UI events.
- OQ-R052-02: Allow server-side sampling of context events to reduce noise.

## Alternatives Considered

- Post-generation context modal only: Rejected (delayed insight).
- Always-on context events: Rejected (user preference variability).

## Definition of Done

- Retrieval events implemented and documented.
- Metrics instrumentation live.
- Tests cover ordering and opt-in or opt-out.

## Appendix (Optional)

Sample retrieval.item event:

```json
{ "event": "retrieval.item", "rank": 1, "type": "atom", "preview": "Eyes: blue" }
```

---
Template compliance confirmed.
