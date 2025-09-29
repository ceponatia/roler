# PRD: R-092 Service Availability Uptime Target

Requirement ID: R-092
Source: requirements.md Section 19
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Achieve ≥99.9% monthly uptime for core chat and retrieval endpoints excluding planned maintenance, ensuring reliable storytelling sessions.

## Problem / Opportunity

Downtime interrupts campaigns and erodes trust; explicit availability target focuses resilience investments (redundancy, health checks, autoscaling).

## Goals

- Monthly downtime budget ≤43m 12s.
- Automatic failover & health probes for rapid detection.
- Error budget tracking integrated into dashboards.

## Non-Goals

- Multi-region active-active (future consideration if demand rises).

## User Stories

1. As a player, I can start a session anytime without outage errors.
2. As an operator, I can view uptime & error budget consumption.
3. As a developer, I get alerted only when budget at risk (not for transient blips <1 min).

## Functional Scope

- Health endpoints + synthetic checks.
- Uptime dashboard with error budget burn chart.
- Alert policies (burn rate SLO alerts: fast + slow).

## Out of Scope

- Detailed DR runbooks for regional disasters.

## Acceptance Criteria

- GIVEN month end WHEN uptime calculated THEN ≥99.9% if no major incidents.
- GIVEN outage >5 min WHEN detected THEN incident automatically created (ticket / log).
- GIVEN synthetic check failure WHEN endpoint recovers <1 min THEN no page (only log).

## Metrics / KPIs

- Uptime %.
- Error budget remaining.
- Mean Time To Recovery (MTTR).

## Risks & Mitigations

- Risk: Noisy alerts → Mitigation: multi-window burn rate strategy.
- Risk: Hidden partial outage (latency spike) → Mitigation: include latency SLI (R-088, R-089) in health view.

## Dependencies

- R-088, R-089 (latency metrics), R-063..R-066 (logging/tracing).

## Security / Privacy Considerations

- Health endpoint excludes sensitive details.

## Performance Considerations

- Synthetic check frequency tuned (e.g., 30s) to limit overhead.

## Operational Considerations

- Runbook: classification (partial vs full), rollbacks, scaling.

## Open Questions

- OQ: Include worker queues in core SLO scope?

## Alternatives Considered

- 99.5% target — rejected (insufficient reliability expectation for interactive sessions).

## Definition of Done

- SLO dashboard & alerts implemented.
- First monthly report generated.
- Incident response doc updated.

---
