# PRD: Type Inference Reuse (R-027)

Requirement ID: R-027
Source: requirements.md Section 6 (Validation & Schema Strategy)
Status: Accepted
Owner: Product
Last Updated: 2025-09-29

## Summary

Ensure internal code consumes inferred TypeScript types directly from Zod schemas (no manual interface duplication) to prevent drift and reduce maintenance overhead.

## Problem / Opportunity

Manually re-declaring interfaces for request/response or data objects risks mismatches and increases refactor cost. Using `z.infer` unifies source-of-truth, enabling safer refactors and consistent IDE assistance.

## Goals

- Achieve 100% replacement of manually duplicated schema-derived interfaces.
- Provide utility helpers for common infer patterns (e.g., `inferDto<typeof Schema>` usage) without redefining shapes.
- Enforce via lint rule or script detection.

## Non-Goals

- Eliminating all handwritten domain types (some pure internal types acceptable when not duplicating schemas).
- Introducing runtime reflection beyond Zod capabilities.

## User Stories

1. As a developer, I change a schema and see all affected usages compile-break, guiding updates.
2. As a reviewer, I confirm no manual interface mirrors a schema shape.
3. As a maintainer, I run a script that reports 0 duplicate interface patterns.

## Functional Scope

- Helper type utilities (e.g., `type GameCreate = z.infer<typeof GameCreateSchema>` export pattern).
- Lint/AST rule identifying interfaces whose property set exactly matches a schema.
- Documentation updates showing canonical pattern for inference.

## Out of Scope

- Generating runtime validators from inferred types (direction is from schema → type only).
- Code mods to auto-convert legacy interfaces (manual one-time migration acceptable).

## Acceptance Criteria

- GIVEN a schema definition WHEN updating a field type THEN all dependent code consuming inferred type compiles with new constraints.
- GIVEN an interface duplicating a schema WHEN lint runs THEN build fails with actionable message.
- GIVEN repository scan WHEN executed THEN duplicate count reported as 0.
- All criteria trace back to R-027.

## Metrics / KPIs

- Duplicate Interface Count: 0.
- Mean Refactor Time after schema change: Reduced (baseline vs after adoption).

## Risks & Mitigations

- Risk: False positives in duplicate detection → Mitigation: Threshold heuristic (exact property match) & allowlist.
- Risk: Developer confusion on pattern → Mitigation: Clear examples in docs + templates.

## Dependencies

- Shared schema layer (R-025).
- Inbound validation enforcement (R-026).

## Security / Privacy Considerations

- Consistent types reduce accidental logging of restricted fields.

## Performance Considerations

- Minimal; compile-time only.

## Accessibility & UX Notes

- Developer docs clarity improves onboarding.

## Operational Considerations

- CI script (e.g., ts-node) scanning for duplicates integrated in pipeline.

## Open Questions

- OQ-R027-01: Should we auto-generate barrel exports for inferred types?
- OQ-R027-02: Include diff summary in PR comments for schema changes?

## Alternatives Considered

- Manual interface duplication: Rejected (drift risk, extra maintenance).
- Code generation (e.g., TS from JSON Schema): Rejected for initial complexity.

## Definition of Done

- Utilities added; existing duplicated interfaces removed/refactored.
- Lint/scan enforcement active with sample violation test.
- Documentation page added with examples.

## Appendix (Optional)

Inference example snippet:

```ts
export const GameCreateSchema = z.object({ name: z.string(), seed: z.number().int() });
export type GameCreate = z.infer<typeof GameCreateSchema>;
```

---
Template compliance confirmed.
