# PRD: R-100 Horizontal Scalability Architecture

Requirement ID: R-100
Source: requirements.md Section 21
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Enable independent horizontal scaling of web (API/streaming) and worker tiers with tunable connection pools and queue throughput, ensuring growth without architectural rewrites.

## Problem / Opportunity

Monolithic scaling couples unrelated workloads, increasing cost and reducing resilience. Separation ensures efficient resource allocation.

## Goals

- Scale web replicas for concurrency without blocking worker throughput.
- Worker scaling improves job processing linearly (ties R-091).
- Connection pool sizing guidelines & safeguards to prevent DB exhaustion.

## Non-Goals

- Multi-region load balancing strategy.

## User Stories

1. As an operator, I scale workers to clear backlog without restarting web pods.
2. As a developer, I configure pool sizes per tier via env vars.
3. As an SRE, I observe saturation metrics to inform scaling decisions.

## Functional Scope

- Separate deploy artifacts & configs for web vs worker.
- Pool configuration & metric exposure (in-use, wait count).
- Autoscaling recommendations documentation.

## Out of Scope

- Automated autoscaler implementation (manual or platform-provided only initially).

## Acceptance Criteria

- GIVEN added web replicas WHEN load increases THEN latency remains stable (R-088, R-089) within limits.
- GIVEN added worker replicas WHEN backlog present THEN processing rate increases proportionally.
- GIVEN misconfigured large pool WHEN starting THEN warnings logged and capped.

## Metrics / KPIs

- Pool utilization %.
- Queue throughput.

## Risks & Mitigations

- Risk: DB connection storms → Mitigation: global max cap + jittered startup.

## Dependencies

- R-091, R-046..R-050 (jobs), R-094 (config).

## Security / Privacy Considerations

- Least privilege DB credentials per tier (optional split users).

## Performance Considerations

- Avoid oversubscription (pool size <= (CPU cores * factor)).

## Operational Considerations

- Scaling playbook documented.

## Open Questions

- OQ: Introduce separate read replica usage later?

## Alternatives Considered

- Single process with role flag — rejected (resource contention, scaling inefficiency).

## Definition of Done

- Distinct deployment configs stable.
- Metrics & docs published.

---
