# PRD: Attribute Override Corrections (R-062)

Requirement ID: R-062
Source: requirements.md Section 14 (Normalization & Canonical Data)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Enable authorized users (GM) to manually override, correct, or remove normalized attribute atoms while preserving audit trails and preventing reappearance of rejected automated suggestions.

## Problem / Opportunity

Deterministic or LLM-derived extraction may occasionally misinterpret text. Without an override mechanism, incorrect attributes pollute retrieval context and downstream generation. Overrides ensure data quality and user trust.

## Goals

- CRUD operations for atoms: accept (persist), modify (update value/path), remove (soft delete), reinstate.
- Audit log entries for each override action (who, when, old vs new value).
- Prevent re-proposal of rejected LLM suggestions for identical input hash.

## Non-Goals

- Bulk multi-entity override operations (future enhancement).
- Cross-game synchronization of overrides.

## User Stories

1. As a GM, I correct an incorrect color attribute and it updates retrieval context immediately.
2. As a developer, I see an audit record for every override action.
3. As a GM, I remove an unwanted LLM suggestion and it is not suggested again for that submission.

## Functional Scope

- Override API endpoints (secured by role & game scope).
- Soft delete flag on atoms plus optional reason field.
- Rejection cache keyed by submission hash + atom path + value source.

## Out of Scope

- Real-time collaborative override editing.
- Automatic consensus merging across multiple GM edits.

## Acceptance Criteria

- GIVEN existing atom WHEN overridden (value changed) THEN new value persisted and old value stored in audit log.
- GIVEN atom removed WHEN retrieval executed THEN removed atom excluded from results.
- GIVEN LLM suggestion rejected WHEN same suggestion would reappear THEN system suppresses it.
- All criteria trace back to R-062.

## Metrics / KPIs

- Override Success Rate (no errors) ≥99%.
- Correction Latency p95 <150 ms.
- Reappearance Rate of Rejected Suggestions = 0.

## Risks & Mitigations

- Risk: Data inconsistency after override → Mitigation: Transactional update + cache invalidation.
- Risk: Audit log omission → Mitigation: Mandatory logging middleware; test coverage.
- Risk: Rejection cache growth → Mitigation: TTL eviction + hashing.

## Dependencies

- Normalization transparency (R-061).
- LLM fallback suggestions (R-058) for rejection logic.

## Security / Privacy Considerations

- Authorization check ensures only GM can override restricted atoms.

## Performance Considerations

- Index on (submissionHash, path, valueSource) for rejection lookup.

## Accessibility & UX Notes

- Inline edit controls keyboard accessible; announce changes to screen reader via live region.

## Operational Considerations

- Metrics dashboards for override volume & rejection cache hit rate.

## Open Questions

- OQ-R062-01: Provide bulk accept-all for suggestions?
- OQ-R062-02: Allow per-atom comment threads for rationale?

## Alternatives Considered

- Direct DB edits (no API) — Rejected (no audit trail, unsafe).
- Automatic acceptance of high-confidence LLM suggestions — Rejected (risk of silent errors).

## Definition of Done

- Override API implemented with tests.
- Audit logging & suppression cache functional.
- Retrieval reflects overrides immediately.

## Appendix (Optional)

Override audit entry example:

```json
{ "action": "override", "path": "eyes.color", "old": "green", "new": "blue", "userId": "gm123" }
```

---
Template compliance confirmed.
