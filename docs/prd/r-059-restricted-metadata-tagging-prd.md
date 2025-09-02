# PRD: Restricted Metadata Tagging (R-059)

Requirement ID: R-059
Source: requirements.md Section 14 (Normalization & Canonical Data)
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Introduce metadata tagging for GM-only (restricted) attributes so they are excluded from player prompts, UI views (unless authorized), and logs, maintaining narrative suspense and privacy.

## Problem / Opportunity

Without explicit tagging, sensitive story elements or spoilers could leak into player-facing generation or logs. A unified restriction flag ensures consistent enforcement across retrieval, streaming, and exports.

## Goals

- Single boolean (or enum) `restricted` flag on AttrAtom & related entities.
- Enforcement hooks in prompt assembly & retrieval filtering.
- Redaction guarantees in logs and exports (unless GM context).

## Non-Goals

- Complex role-based attribute-level ACL beyond GM vs Player baseline.
- Encryption of restricted data at rest (out of immediate scope).

## User Stories

1. As a GM, I mark certain attributes as secret and they are omitted from player prompts.
2. As a player, I never see GM-only atoms in chat output unless revealed.
3. As an operator, I monitor that leakage incidents remain zero.

## Functional Scope

- Schema extension with `restricted` field.
- Filter integration in retrieval & prompt assembly (R-044).
- Redaction utility for logging (R-067, R-077, R-101 alignment).

## Out of Scope

- Time-based auto-unlock mechanics.
- Partial obfuscation (e.g., hashing) — simple omission/redaction only.

## Acceptance Criteria

- GIVEN attribute flagged restricted WHEN prompt assembled for player role THEN attribute absent from context.
- GIVEN restricted attribute WHEN GM views entity THEN attribute visible with clear badge.
- GIVEN restricted atom WHEN logs emitted THEN value redacted (placeholder token) outside GM debug mode.
- All criteria trace back to R-059.

## Metrics / KPIs

- Restricted Field Leakage Incidents (target 0).
- Restricted Attribute Coverage (% of entities with at least one restricted atom where expected).
- Redaction Latency Overhead (<5 ms p95 per request).

## Risks & Mitigations

- Risk: Incomplete filtering path → Mitigation: Centralized filtering utility reused everywhere + test matrix.
- Risk: Accidental unflagging → Mitigation: Audit log of flag changes (R-035 extension).
- Risk: Developer bypass → Mitigation: Lint/static checks disallow direct raw attribute serialization.

## Dependencies

- Prompt assembly (R-044).
- Logging redaction (R-065 to R-067).

## Security / Privacy Considerations

- Prevent serialization of restricted values in client network responses for non-GM roles.

## Performance Considerations

- Filtering implemented as a lightweight predicate over atom list.

## Accessibility & UX Notes

- GM UI indicates restricted items with icon and tooltip (screen-reader label: "Restricted attribute").

## Operational Considerations

- Add monitoring alert if leakage incidents >0 within 24h.

## Open Questions

- OQ-R059-01: Should restricted atoms be exportable in GM-only export bundles?
- OQ-R059-02: Provide bulk flagging tools?

## Alternatives Considered

- Separate table for restricted atoms — Rejected (duplication, complexity).
- No tagging (manual omission) — Rejected (error-prone).

## Definition of Done

- Schema updated & migrations applied.
- Filtering & redaction utilities implemented and tested.
- Leakage detection tests (negative assertions).

## Appendix (Optional)

Restricted atom example (player serialization omitted):

```json
{ "path": "plot.twist", "value": "NPC is secret ally", "restricted": true }
```

---
Template compliance confirmed.
