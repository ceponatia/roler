# PRD: Re-Embedding Triggers (R-048)

Requirement ID: R-048
Source: requirements.md Section 11 (Jobs & Asynchronous Processing)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Define and implement triggers for re-embedding content when relevant text, attribute changes, or schema adjustments occur to maintain retrieval quality.

## Problem / Opportunity

Stale embeddings degrade contextual relevance and hallucination risk. Over-eager re-embedding wastes compute. Precisely scoped triggers balance freshness and cost.

## Goals

- Identify minimal-change thresholds requiring re-embed.
- Batch similar updates for efficiency.
- Track embedding freshness metadata.

## Non-Goals

- Real-time inline embedding on every keystroke.
- Model quality regression detection (separate evaluation suite).

## User Stories

1. As a GM, when I edit an entity's description significantly, its retrieval context updates after background processing.
2. As a developer, I adjust trigger thresholds via config file.
3. As an operator, I view queue metrics showing re-embed backlog.

## Functional Scope

- Change detection (diff length / semantic magnitude heuristics).
- Trigger scheduler enqueuing REEMBED jobs.
- Freshness field (lastEmbeddedAt, modelVersion) on chunks/atoms.

## Out of Scope

- Automatic model selection per entity.
- Multi-model simultaneous embedding retention.

## Acceptance Criteria

- GIVEN minor whitespace edit WHEN saved THEN no re-embed triggered.
- GIVEN substantive content change (length delta > threshold) WHEN saved THEN re-embed job queued.
- GIVEN model version upgrade WHEN initiated THEN all affected vectors scheduled progressively (back-pressure aware).
- All criteria trace back to R-048.

## Metrics / KPIs

- Re-Embed Job Volume per Day.
- Average Embed Freshness Age.
- Skipped Redundant Embed Rate.

## Risks & Mitigations

- Risk: Excessive embeds spike cost → Mitigation: Threshold tuning & batching.
- Risk: Missed stale embeddings → Mitigation: Periodic audit scanning.
- Risk: Backlog buildup → Mitigation: Worker scaling triggers.

## Dependencies

- Async processing (R-046), worker deployment (R-047).
- Embedding provider abstraction (R-043).

## Security / Privacy Considerations

- Ensure restricted attributes not embedded if policy forbids.

## Performance Considerations

- Batch embed size optimized for GPU/CPU throughput.

## Accessibility & UX Notes

- UI status indicator for pending vector updates (optional phase).

## Operational Considerations

- Configurable thresholds via env or config file.
- Migration strategy for model version bump.

## Open Questions

- OQ-R048-01: Include semantic diff using embeddings to decide trigger?
- OQ-R048-02: Cap daily re-embedding quota?

## Alternatives Considered

- Always re-embed on every edit: Rejected (cost, latency).
- Manual only re-embedding: Rejected (stale data risk).

## Definition of Done

- Trigger detection logic & tests.
- Freshness metadata fields added.
- Metrics & config documented.

## Appendix (Optional)

Trigger decision pseudo:

```ts
if (delta.length > LENGTH_THRESHOLD) enqueueReembed(id)
```

---
Template compliance confirmed.
