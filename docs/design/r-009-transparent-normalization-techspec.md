---
title: R-009 Transparent Normalization Technical Specification
Status: Accepted
last-updated: 2025-09-04
related-prd: ../prd/r-009-transparent-normalization-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Implement a deterministic, explainable normalization pipeline for entity attributes & text that preserves original input, provides provenance metadata (rule vs LLM), and supports manual override with audit trail.

In-Scope:

- Rule engine (ordered regex / deterministic transforms) with config.
- Optional LLM fallback stage (feature-flagged) capturing prompt + model id.
- Atom store capturing: originalValue, normalizedValue, provenance, overriddenFlag, overrideMeta.
- Override API & skip-on-reprocess semantics.
- Audit log entries for normalization & overrides.

Out-of-Scope (this spec):

- Concurrent override conflict resolution.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Deterministic rules first | Ordered rule list with stable IDs | Versioned rule set |
| Optional LLM fallback | Fallback stage only if rule set yields gap | Flag controlled |
| Manual override + lock | Override API setting overriddenFlag | Skip future transforms |
| Provenance logging | Atom provenance field (RULE / LLM / OVERRIDE) | Stored & queryable |

## 3. High-Level Architecture

Components:

1. Normalization Orchestrator.
2. Rule Engine (list of Rule { id, match, transform }).
3. LLM Fallback Adapter (abstract interface; initial local model call wrapper).
4. Atom Store (DB table for normalized atoms) & audit logger.
5. Override Service (apply override, mark atom locked).
6. Provenance Reporter (metrics + structured log events).

## 4. Data & Schema Design (Zod-First)

Schemas:

- NormalizationRuleSchema { id, pattern, flags?, description }
- NormalizationAtomSchema { id, entityId, fieldPath, original, normalized, provenance, overriddenFlag, overrideMeta?, createdAt, updatedAt }
- OverrideRequestSchema { atomId, newValue, reason }
- OverrideResponseSchema { atomId, normalized, overriddenFlag, overrideMeta }

## 5. Hook Interface Contracts

Future extension hooks pre/post normalization; not implemented in this phase.

## 6. Registration & Loading Flow

Load rule set (versioned) at startup → orchestrator applies sequentially → collect missing fields → if fallback enabled, call LLM adapter → persist atoms & audit.

## 7. Versioning & Stability Model

Rule set version increments on modification; provenance includes ruleVersion for reproducibility. Schema additive evolution only.

## 8. Public API Surface (Initial)

- normalizeEntity(entityId, snapshot) → Promise\<NormalizationResult\>
- listAtoms(entityId, filter?) → atoms[]
- overrideAtom(atomId, newValue, reason) → OverrideResponse

## 9. Error Handling & Codes

Codes: NORM_RULE_APPLY_ERROR, NORM_FALLBACK_ERROR, NORM_OVERRIDE_INVALID, NORM_ATOM_NOT_FOUND.

## 10. Security & Capability Model

Role checks for override (GM only). Sensitive original values not exposed to unauthorized roles (redacted view).

## 11. Performance Considerations

Pipeline target overhead <10% of submission latency; regex compiled once; fallback parallelizable for multiple missing atoms with concurrency limit.

## 12. Observability & Metrics

Metrics: norm_pipeline_latency_ms, norm_fallback_invocations_total, norm_overrides_total, norm_atoms_created_total, norm_rule_application_total{ruleId}.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Rule runtime error | Skip rule + log error | Resilience |
| Fallback LLM timeout | Return partial normalization (provenance=PARTIAL) | Non-blocking |
| Override missing atom | Return not found error | Integrity |

## 14. Implementation Plan (Step-by-Step)

1. Define schemas.
2. Implement rule engine.
3. Orchestrator & atom persistence.
4. Override API & audit log.
5. Optional LLM fallback adapter.
6. Metrics instrumentation.
7. Tests (rules, overrides, fallback, provenance logging).
8. Docs (normalization.md, override-guide.md).

## 15. Testing Strategy

Unit (rule matching), integration (full pipeline), negative (invalid override), performance (profiling), provenance correctness.

## 16. Documentation Plan

normalization.md, override-guide.md, provenance.md.

## 17. Migration / Rollout

Shadow run normalization first (store atoms but not used), then enable presentation + overrides.

## 18. Assumptions

Rule set size moderate (<200 rules). LLM fallback deterministic enough for current model.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-normalization | Loss of nuance | Conservative rule design |
| Fallback hallucinations | Bad normalized data | Provenance + manual override |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Partial rollback of atoms? | Provide batch override revert endpoint later | Defer |

## 21. Acceptance Criteria Traceability

Override tests ↔ lock semantics; provenance tests ↔ rule vs LLM capture.

## 22. KPI Measurement Plan

Track override frequency & fallback rate; anomaly if fallback rate spikes.

## 23. Future Extensions (Not Implemented Now)

Batch overrides, rule testing sandbox.

## 24. Out-of-Scope Confirmations

No auto conflict resolution or concurrency control this phase.

## 25. Summary

Delivers transparent, auditable normalization with deterministic rule precedence, optional AI augmentation, and robust override semantics.

---
END OF DOCUMENT
