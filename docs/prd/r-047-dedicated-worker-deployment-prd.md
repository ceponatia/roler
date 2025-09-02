# PRD: Dedicated Worker Deployment (R-047)

Requirement ID: R-047
Source: requirements.md Section 11 (Jobs & Asynchronous Processing)
Status: Draft
Owner: Product
Last Updated: 2025-09-01

## Summary

Deploy a dedicated worker service independent from the web tier for processing background jobs, enabling isolated scaling and resilience to workload spikes.

## Problem / Opportunity

Co-locating heavy background tasks with request-serving processes degrades latency and causes noisy neighbor resource contention. Separate worker deployment streamlines scaling and operational tuning.

## Goals

- Distinct deployment artifact (container/image) for workers.
- Horizontal scaling independent from web tier.
- Graceful shutdown draining in-flight jobs.

## Non-Goals

- Multi-tenant queue partitioning (future as scale increases).
- Autoscaling policy design (initial manual scaling acceptable).

## User Stories

1. As an operator, I scale workers without redeploying the web app.
2. As a developer, I add a new processor and it is discovered by the worker.
3. As a reliability engineer, I perform zero-downtime rolling restarts.

## Functional Scope

- Worker bootstrap scanning/registering processors.
- Health endpoints (liveness, readiness, drain status).
- Shutdown hook: stop pulling, finish active, report metrics.

## Out of Scope

- Cross-region worker coordination.
- Priority queues (handled later if needed).

## Acceptance Criteria

- GIVEN scale up event WHEN new worker pod starts THEN it begins processing within readiness window (<30s).
- GIVEN rolling restart WHEN initiated THEN no job is lost (in-flight completed or retried).
- GIVEN processor addition WHEN worker redeployed THEN job type accepted with no web tier changes.
- All criteria trace back to R-047.

## Metrics / KPIs

- Worker Utilization (% busy time).
- In-Flight Job Count per Worker.
- Graceful Shutdown Drain Time.

## Risks & Mitigations

- Risk: Version skew across workers → Mitigation: Deploy atomic revision set.
- Risk: Uneven load distribution → Mitigation: Global queue ensures fairness.
- Risk: Resource starvation → Mitigation: CPU/memory resource requests + limits.

## Dependencies

- Async processing support (R-046).
- Infrastructure containerization (R-096).

## Security / Privacy Considerations

- Limit worker network egress; principle of least privilege.

## Performance Considerations

- Ensure worker startup time minimal (<10s to readiness where possible).

## Accessibility & UX Notes

- Operational dashboard clarity (naming workers vs web nodes).

## Operational Considerations

- Deployment manifest & scaling runbook.
- Drain signal (env var / SIGTERM) documented.

## Open Questions

- OQ-R047-01: Use separate build pipeline or reuse monorepo build artifacts?
- OQ-R047-02: Implement autoscaling based on backlog size now?

## Alternatives Considered

- Single combined process model: Rejected (contention risk).
- Serverless per-job compute: Rejected early (cold start + cost).

## Definition of Done

- Worker image & deployment scripts.
- Health & drain testing.
- Metrics integrated into dashboards.

## Appendix (Optional)

Lifecycle phases documented.

---
Template compliance confirmed.
