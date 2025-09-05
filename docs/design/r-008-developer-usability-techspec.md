---
title: R-008 Developer Usability Technical Specification
status: Draft
last-updated: 2025-09-04
related-prd: ../prd/r-008-developer-usability-prd.md
revision: 0.1.0
---

## 1. Purpose & Scope

Automate contract surface documentation, schema diff/change log generation, and centralized error code registry to improve developer onboarding and reduce drift.

In-Scope:

- Schema doc generation pipeline from Zod definitions.
- Semantic schema diff tool (breaking/additive classification).
- Changelog generator & CI gate for breaking changes.
- Error code registry doc build.

Out-of-Scope (this spec):

- Polished developer portal UI.

## 2. Requirements Mapping

| PRD Requirement | Design Element | Notes |
|-----------------|----------------|-------|
| Auto API reference | Doc generator CLI | Markdown output |
| Schema diff detection | AST + Zod descriptor compare | CI fail on breaking |
| Error code centralization | Registry enumeration script | Single source |

## 3. High-Level Architecture

Components:

1. Doc Generator: Walks schema tree → emits Markdown.
2. Diff Engine: Serializes stable JSON descriptors → compares baseline vs head.
3. Changelog Builder: Produces versioned CHANGELOG sections.
4. Error Code Collector: Scans error definitions & outputs table.
5. CI Gate Script: Runs diff & fails on breaking without version bump.

## 4. Data & Schema Design (Zod-First)

Utilize existing describe/ snapshot utility extended with stable ordering. Add internal descriptor schema.

## 5. Hook Interface Contracts

Optional plugin for custom formatting (phase 2), not in scope now.

## 6. Registration & Loading Flow

CI & dev scripts invoke generators; outputs committed for review.

## 7. Versioning & Stability Model

Changelog entries follow semver categories; diff engine classifies breaking vs minor vs patch.

## 8. Public API Surface (Initial)

- CLI commands: `schemas:generate-docs`, `schemas:diff`, `errors:generate`.

## 9. Error Handling & Codes

Include existing codes; add internal codes for doc generation failures (DOC_GEN_FAILURE, DOC_DIFF_FAILURE).

## 10. Security & Capability Model

Exclude secrets & internal-only schemas (config allowlist / blocklist).

## 11. Performance Considerations

Generation < 60s; diff incremental by hashing descriptor subsets.

## 12. Observability & Metrics

Optional run timing logs; not production critical.

## 13. Failure Modes & Degradation

| Scenario | Behavior | Rationale |
|----------|----------|-----------|
| Diff false positive | Mark as review-needed | Safety over permissiveness |
| Missing schema doc | CI fail | Completeness |

## 14. Implementation Plan (Step-by-Step)

1. Extend snapshot descriptor util.
2. Implement doc generator.
3. Implement diff engine + baseline store.
4. CLI wrappers & scripts.
5. Error code collector.
6. CI integration.
7. Tests (descriptor stability, diff classification).
8. Docs usage guide.

## 15. Testing Strategy

Unit (diff logic), integration (generate then mutate then diff), snapshot (doc output stable), negative (breaking change triggers fail).

## 16. Documentation Plan

developer-docs.md, changelog-policy.md, error-codes.md.

## 17. Migration / Rollout

Introduce generator + baseline snapshot; enforce after initial commit.

## 18. Assumptions

All schemas centralized under `@roler/schemas`.

## 19. Risks & Mitigations (Expanded)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-classification of breaking | CI noise | Heuristics + allow overrides |
| Under-classification | Runtime break | Conservative rules |

## 20. Open Questions & Proposed Answers

| Question | Proposed Answer | Action |
|----------|-----------------|--------|
| Version docs per release? | Tag snapshots archived | Phase 2 |

## 21. Acceptance Criteria Traceability

Breaking change test ↔ CI fail; doc generation test ↔ markdown produced.

## 22. KPI Measurement Plan

Track doc generation success & review cycle time qualitatively.

## 23. Future Extensions (Not Implemented Now)

Multi-language SDK emitters; HTML portal.

## 24. Out-of-Scope Confirmations

No marketing site style portal.

## 25. Summary

Automates developer-facing documentation and schema change detection, reducing drift and improving onboarding quality.

---
END OF DOCUMENT
