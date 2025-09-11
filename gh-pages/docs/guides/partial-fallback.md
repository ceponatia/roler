# Partial Fallback Semantics

When deadlines are tight, the retrieval pipeline may return a partial but useful subset of items. This document describes how to detect and handle partial responses safely.

## Detecting Partials

The `RetrievalResponse` contains:

- `partial: boolean` — true when the orchestrator returned early.
- `partialReason?: 'SOFT_TIMEOUT' | 'HARD_TIMEOUT' | 'ADAPTIVE_LIMIT'` — why it returned early.
- `items` — ordered results; still deterministic given the same input and dataset.

## Client Handling

- Render what you have immediately. Do not block the user waiting for retries.
- If `partial` is true and `partialReason` is `SOFT_TIMEOUT`, you may optimistically proceed and optionally background a refresh.
- If `partial` is true and `partialReason` is `HARD_TIMEOUT`, prefer a subtle UI notice (e.g., "Results may be incomplete").
- For `ADAPTIVE_LIMIT`, the system decided additional querying wouldn’t fit the budget; treat as soft.

## UX Recommendations

- Keep messaging subtle; avoid alarming the user. Prioritize responsiveness.
- Cache the successful partial response client-side to keep interactions snappy.
- For consecutive partials, consider reducing the requested `limit` or avoiding expensive filters.

## Server Guidance

- Log `partial` events with requestId and timings for correlation.
- Track `retrieval_partial_returns_total{reason}` and ensure the rate stays low (&lt;1%).
- Revisit `softPartialDeadlineMs` and `baseK` if partials are frequent.
