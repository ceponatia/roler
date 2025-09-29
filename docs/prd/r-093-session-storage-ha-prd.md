# PRD: R-093 Session Storage High Availability

Requirement ID: R-093
Source: requirements.md Section 19
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Provide horizontally scalable, highly available session storage (e.g., Redis with replication/failover) ensuring no mass logout or session loss during node failures.

## Problem / Opportunity

Single-instance session store creates SPOF leading to downtime or forced re-authentication. HA design protects continuity of play.

## Goals

- Automatic failover within <30 s without widespread session invalidation.
- Support scaling reads/writes linearly with shard or replica additions.
- Session TTL refresh reliability ≥99.9%.

## Non-Goals

- Cross-region session replication.

## User Stories

1. As a player, I remain logged in through a cache node failure.
2. As an operator, I can observe session store health and failovers.
3. As a developer, I can rotate session encryption keys without invalidating active sessions (grace period).

## Functional Scope

- Redis (cluster/sentinel) or equivalent configuration.
- Health checks & reconnection logic in app.
- Session key rotation mechanism.

## Out of Scope

- Persistent multi-day offline sessions.

## Acceptance Criteria

- GIVEN primary node failure WHEN failover occurs THEN <30 s disruption and <5% failed auth attempts.
- GIVEN key rotation WHEN performed THEN existing sessions valid until grace TTL expires.
- GIVEN scaling event WHEN shard added THEN no code changes required.

## Metrics / KPIs

- Session auth failure rate.
- Failover duration.

## Risks & Mitigations

- Risk: Split brain — Mitigation: tested sentinel/quorum config.
- Risk: Key mismatch — Mitigation: dual-key validation window.

## Dependencies

- R-031..R-033 (authn/authz), R-078 (env validation for connection vars).

## Security / Privacy Considerations

- Secure TLS connections; no sensitive PII stored (token references only).

## Performance Considerations

- Connection pooling + aggressive timeouts to avoid tail latency.

## Operational Considerations

- Runbook for failover test drills (quarterly).

## Open Questions

- OQ: Use Redis Cluster vs Sentinel for initial phase?

## Alternatives Considered

- Database-backed sessions — rejected (higher latency, heavier load).

## Definition of Done

- HA store deployed & tested via simulated failure.
- Metrics & alerts operational.
- Rotation documented.

---
