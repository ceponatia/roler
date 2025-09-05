---
title: R-010 Reactive Frontend Technical Specification
status: Draft
last-updated: 2025-09-04
related-prd: ../prd/r-010-reactive-frontend-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Implement a web UI (SvelteKit) delivering streaming token display, real-time entity state reflection, and modular component structure achieving lighthouse performance ≥85 and first-token latency <1s.

In-Scope:

- Streaming chat component (SSE consumer) with incremental render.
- Entity state store with subscription to server-sent updates.
- Modular UI primitives & feature folders.
- Performance instrumentation & metrics (first token, repaint latency).

Out-of-Scope (this spec):

- Native mobile wrappers.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Token streaming <1s | SSE + incremental flush | Backpressure handling optional |
| Real-time entity updates | Svelte stores + event channel | Minimal diff patches |
| Modular components | Feature folder + isolated stores | Testable units |

## 3. High-Level Architecture

Components:

1. StreamService (wraps EventSource / fetch streaming).
2. ChatStore (messages[], streaming state, partial token buffer).
3. EntityStore (entity map keyed by id + version).
4. UpdateDispatcher (applies diff patches to stores).
5. MetricsCollector (web vitals + custom timers).
6. UI Components (ChatView, TokenStream, EntityPanel, PerformanceBadge).

## 4. Data & Schema Design (Zod-First)

Client parses streamed JSON event envelopes via Zod (message chunk, meta, done, error). Entity updates validated similarly.

## 5. Hook Interface Contracts

Optional plugin injection (future) for custom stream event decorators.

## 6. Registration & Loading Flow

App load → initialize stores → connect stream on chat start → dispatch incremental tokens → update entity store on events.

## 7. Versioning & Stability Model

Public component props documented; breaking changes require minor bump until stable v1.

## 8. Public API Surface (Initial)

- Stores: createChatStore(), createEntityStore().
- Components: ChatView, EntityPanel, TokenStream (internal streaming logic).

## 9. Error Handling & Codes

Stream errors surfaced via toast + retry; codes aligned with backend (STREAM_TIMEOUT, STREAM_ABORTED).

## 10. Security & Capability Model

Role gating in layout load; restricted fields omitted server-side; client never escalates.

## 11. Performance Considerations

Use requestAnimationFrame batching for token append; virtualization for long histories; debounced layout reflow.

## 12. Observability & Metrics

Client metrics: firstTokenMs, streamDurationMs, entityUpdateLatencyMs, droppedEventsCount.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Stream disconnect | Auto-retry with backoff | Resilience |
| Burst updates | Batch apply within frame | Avoid thrash |
| Large entity patch | Lazy hydrate details | Perf |

## 14. Implementation Plan (Step-by-Step)

1. Define event envelope schemas.
2. Implement StreamService.
3. ChatStore & streaming reducer.
4. EntityStore + diff apply logic.
5. Components & styling.
6. Metrics instrumentation.
7. Performance tests & lighthouse run script.
8. Docs (frontend-architecture.md).

## 15. Testing Strategy

Unit (store reducers), integration (mock SSE), performance (Lighthouse CI), resilience (disconnect/retry), security (restricted field absence).

## 16. Documentation Plan

frontend-architecture.md, streaming-guide.md, performance-tips.md.

## 17. Migration / Rollout

Feature flag for streaming; progressive enhancement fallback (static responses) if disabled.

## 18. Assumptions

Modern evergreen browsers; SSE supported; token streaming backend stable.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-rendering | UI jank | Batch + memoize |
| SSE instability | UX degradation | Retry + fallback poll |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Backpressure needed? | Phase 2 (monitor droppedEvents) | Add metric |

## 21. Acceptance Criteria Traceability

First token test ↔ <1s; entity update propagation test ↔ <200ms; lighthouse script ↔ ≥85 score.

## 22. KPI Measurement Plan

Collect firstTokenMs & entityUpdateLatencyMs; alert if regress.

## 23. Future Extensions (Not Implemented Now)

Backpressure & diff compression; offline mode.

## 24. Out-of-Scope Confirmations

No native mobile client.

## 25. Summary

Implements a reactive, streaming-first frontend architecture with robust stores, performance instrumentation, and modular components meeting latency and UX goals.

---
END OF DOCUMENT
