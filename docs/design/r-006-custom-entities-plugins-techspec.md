---
title: R-006 Custom Entities & Plugins Technical Specification
Status: Accepted
last-updated: 2025-09-04
related-prd: ../prd/r-006-custom-entities-plugins-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Enable safe registration of custom entity archetypes, attributes, and plugin hooks with uniqueness guarantees and controlled execution ordering.

In-Scope:

- Plugin manifest (id, version, declared entityTypes, attributes, hooks, priority).
- Attribute namespace enforcement (vendor:attrName).
- Hook categories: pre-save, post-normalize, retrieval-enrich.
- Conflict detection (duplicate attribute or entity archetype identifiers).

Out-of-Scope (this spec):

- Remote distribution marketplace.
- Runtime sandboxing.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Register new archetypes | Manifest entityTypes list | Zod validated |
| Extend attributes | Manifest attributes + schema injection | Namespaced |
| Hook points execution | Hook registry + ordered chain | Priority sort |
| Unique namespacing | Namespace validator | Reject collisions |

## 3. High-Level Architecture

Components:

1. Plugin Manifest Schema & Loader.
2. EntityType Registry (map id → descriptor).
3. Attribute Registry (namespace + name → schema).
4. Hook Pipeline Manager (per category arrays ordered by priority desc).
5. Conflict Detector & Diagnostics Logger.
6. Metrics layer (hook latency, errors, registry counts).

## 4. Data & Schema Design (Zod-First)

Add PluginManifestSchema; extend existing extension system (R-001). Attribute descriptor includes: { fqName, baseTypeRef, constraints, retrievableFlag }.

## 5. Hook Interface Contracts

Same shape as R-001 extension hooks; additions: attribute registration occurs before pre-save phase.

## 6. Registration & Loading Flow

Load core extensions → load custom plugin manifests → validate uniqueness → register attributes → register hooks.

## 7. Versioning & Stability Model

Manifest stable fields; additive attributes allowed; removing an attribute requires major plugin version bump.

## 8. Public API Surface (Initial)

- `registerPlugin(manifest)`
- Query APIs: `getEntityType(id)`, `listAttributes(namespace?)`.

## 9. Error Handling & Codes

Codes: PLUG_DUP_ATTRIBUTE, PLUG_DUP_ENTITY_TYPE, PLUG_MANIFEST_INVALID.

## 10. Security & Capability Model

Restricted attributes cannot be overridden; manifest parser rejects attempts.

## 11. Performance Considerations

Plugin load happens at startup; hook overhead budget shared with R-001 (<5 ms p95 mutation).

## 12. Observability & Metrics

plugin_load_latency_ms, plugin_hook_latency_ms{category}, plugin_conflicts_total.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Attribute conflict | Reject plugin, log error | Data integrity |
| Hook error | Log + continue | Resilience |

## 14. Implementation Plan (Step-by-Step)

1. Define manifest schema.
2. Implement registries.
3. Integrate with extension loader (R-001).
4. Conflict detection logic & tests.
5. Hook pipeline link.
6. Metrics instrumentation.
7. Example plugin.
8. Docs (custom-entities.md).

## 15. Testing Strategy

Unit (schema, conflicts), integration (hook order), performance (load cost), negative (duplicate attr).

## 16. Documentation Plan

Author guide + manifest reference.

## 17. Migration / Rollout

Behind feature flag `CUSTOM_PLUGINS_ENABLED`.

## 18. Assumptions

Plugin count modest initially (<50).

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Namespace squatting | Ecosystem fragmentation | Reservation policy |
| Hook chain latency | Slow mutations | Budget + metrics |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Min framework version field? | Yes; enforce semver range | Add manifest field |

## 21. Acceptance Criteria Traceability

Conflict tests ↔ rejection; retrieval enrichment test ↔ custom attribute inclusion.

## 22. KPI Measurement Plan

Track plugin_conflicts_total; time-to-first-plugin metric (manual).

## 23. Future Extensions (Not Implemented Now)

Remote registry sync, sandbox isolation.

## 24. Out-of-Scope Confirmations

No marketplace or sandbox in this phase.

## 25. Summary

Adds a structured plugin mechanism for custom entities & attributes with safe namespacing, deterministic hook execution, and conflict prevention.

---
END OF DOCUMENT
