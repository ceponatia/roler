# PRD: R-101 Restricted Attribute Authorization

Requirement ID: R-101
Source: requirements.md Section 21
Status: Draft
Owner: Product
Last Updated: 2025-09-02

## Summary

Ensure GM-only (restricted) attributes (R-059, R-077) are excluded from unauthorized client responses and prompts with test-backed enforcement and redaction at serialization boundaries.

## Problem / Opportunity

Leakage of GM secrets undermines gameplay integrity and trust. Centralized redaction guarantees consistent protection.

## Goals

- Single serialization layer redacts restricted fields unless GM role.
- Test suite covering representative endpoints.
- Audit logging for attempted unauthorized access.

## Non-Goals

- Field-level encryption (not required currently).

## User Stories

1. As a player, I never see GM secret attributes.
2. As a GM, I can view and edit restricted data seamlessly.
3. As a security reviewer, I verify redaction tests exist and pass.

## Functional Scope

- Role-aware serializer.
- Prompt assembly filter integration.
- Audit log entries for blocked access attempts.

## Out of Scope

- UI masking animations.

## Acceptance Criteria

- GIVEN player role WHEN fetching entity THEN restricted fields absent.
- GIVEN GM role WHEN fetching entity THEN restricted fields present.
- GIVEN prompt assembly WHEN player context used THEN restricted fields not included.

## Metrics / KPIs

- Unauthorized access attempts count.
- Redaction test coverage (target 100% of restricted serialization paths).

## Risks & Mitigations

- Risk: New endpoint bypasses serializer → Mitigation: lint/arch rule + tests.

## Dependencies

- R-059, R-077, R-044, R-063..R-066.

## Security / Privacy Considerations

- Logging masks values; only attribute keys referenced.

## Performance Considerations

- Redaction overhead minimized (precomputed mask list per request).

## Operational Considerations

- Security review checklist item for new endpoints.

## Open Questions

- OQ: Provide optional GM preview of player-visible diff?

## Alternatives Considered

- Inline per-endpoint filtering — rejected (duplicative, error-prone).

## Definition of Done

- Central serializer implemented.
- Tests & audit logs validated.
- Docs updated for security review.

---
