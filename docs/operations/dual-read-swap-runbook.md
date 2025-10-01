# Dual-Read Swap Runbook

last-updated: 2025-09-30
status: Accepted
requirements: R-005

This runbook provides a step-by-step procedure for migrating the primary retriever backend using the dual-read capability, as well as rollback guidance. It fulfills the final operational documentation requirement for R-005.

## 1. Pre-Migration Checklist

- [ ] Confirm the target backend is provisioned and reachable (network, auth, TLS verified).
- [ ] Ensure schemas/collections contain the same candidate set as the current primary backend.
- [ ] Verify dashboards and alerts from `docs/operations/variance-monitoring.md` are active.
- [ ] Obtain approval from product owner and on-call SRE.
- [ ] Schedule migration window and communicate to stakeholders.

## 2. Staging Validation

1. Deploy updated configuration to staging with the new backend configured as shadow (`dualRead.enabled = true`).
2. Run `pnpm -C packages/rag test` to confirm adapter and schema compatibility.
3. Execute smoke tests:
   - `packages/rag/src/lib/retriever/__tests__/adapter-swap-smoke.test.ts`
   - `packages/rag/src/lib/retriever/__tests__/factory-swap.test.ts`
4. Validate dashboards show shadow samples and low variance for 24h.

## 3. Production Rollout Plan

### Phase 1 – Shadow Warm-Up

1. Set `dualRead.enabled = true` with shadow pointing at the new backend.
2. Start with `sampleRate = 0.02` (2%) for low impact.
3. Monitor for at least one full traffic cycle (minimum 2 hours or region-specific peak).
4. Increase sample rate gradually (e.g., 0.05 → 0.1) only if variance metrics remain within thresholds (score delta <0.2, latency delta <80ms, mismatch count steady).

### Phase 2 – Cutover

1. Freeze deploys during the cutover window.
2. Update configuration so the new backend becomes primary. Keep the previous backend as shadow with a reduced sample rate (e.g., 0.05) for guardrail monitoring.
3. Redeploy retrieval service(s) and validate:
   - Startup logs announce primary kind as the new backend.
   - `retrieval_total` counters resume expected throughput.
   - Variance monitoring shows low deltas.
4. Maintain dual read for 24h post-cutover. If no alerts, disable dual read or repoint shadow to the next candidate backend.

## 4. Rollback Procedure

### Immediate Rollback (<15 minutes after cutover)

1. Revert configuration: set previous backend as primary and disable dual read (`dualRead.enabled = false`).
2. Redeploy retrieval service(s) and confirm metrics baseline.
3. Notify stakeholders of rollback completion and incident review scheduling.

### Delayed Rollback (>15 minutes after cutover)

1. Execute Immediate Rollback steps.
2. Run data integrity validation between adapters to reconcile drift introduced during the partial migration.
3. File follow-up tickets for any data corrections required.

## 5. Incident Response

- **Trigger:** `RETR_DUAL_VARIANCE_HIGH` alert sustained for >5 minutes or shadow errors >0.
- **Action:** Pause sample rate increases; if cutover already complete, revert to prior backend using rollback procedure.
- **Postmortem:** Capture root cause, metrics, and remediation details within 48 hours.

## 6. Communication Plan

- Pre-cutover: Announce in engineering channel + incident management calendar.
- During rollout: Provide status updates at start, midpoint, and completion (or rollback).
- Post-rollout: Share variance summary and next steps.

## 7. Artifacts to Update

- Retriever configuration repository / secrets manager entries.
- Observability dashboards (swap backend labels as needed).
- Traceability matrix `docs/traceability/rtm.md` once migration is complete.

## 8. References

- `docs/operations/retriever.md` for configuration details.
- `docs/operations/variance-monitoring.md` for telemetry setup.
- `docs/design/r-005-pluggable-vector-store-techspec.md` for acceptance criteria and design context.
