# PRD: R-XXX TITLE

Requirement ID: R-XXX
Source: requirements.md Section SECTION_NUMBER
Status: Draft | In Review | Approved
Owner: OWNER_NAME
Last Updated: YYYY-MM-DD

## Summary

ONE PARAGRAPH CLEAR, CONCISE SUMMARY OF THE REQUIREMENT AND INTENDED OUTCOME.

## Problem / Opportunity

WHAT USER / SYSTEM PROBLEM ARE WE SOLVING? WHY NOW? QUANTIFY PAIN OR OPPORTUNITY WHERE POSSIBLE.

## Goals

- PRIMARY OUTCOME 1
- PRIMARY OUTCOME 2
- PRIMARY OUTCOME 3

## Non-Goals

- EXPLICITLY EXCLUDED ITEM 1
- EXCLUDED ITEM 2

## User Stories

1. As a USER_TYPE, I want CAPABILITY so that VALUE.
2. As a USER_TYPE, I can ACTION resulting in OUTCOME.
3. As a MAINTAINER_OR_OPERATOR, I can OPERATIONAL_STORY.

## Functional Scope

- KEY FUNCTIONAL ELEMENT 1
- KEY FUNCTIONAL ELEMENT 2
- KEY FUNCTIONAL ELEMENT 3

## Out of Scope

- INTENTIONALLY OMITTED AREA 1
- OMITTED AREA 2

## Acceptance Criteria

- GIVEN PRECONDITION WHEN ACTION THEN OBSERVABLE_RESULT.
- GIVEN EDGE_CASE WHEN ACTION THEN ERROR_OR_ALTERNATIVE_PATH.
- All criteria trace back to the single requirement ID (R-XXX).

## Metrics / KPIs

- METRIC_NAME: TARGET_OR_BASELINE
- METRIC_NAME: TARGET_OR_BASELINE

## Risks & Mitigations

- Risk: RISK_DESCRIPTION → Mitigation: MITIGATION_ACTION.
- Risk: RISK_DESCRIPTION → Mitigation: MITIGATION_ACTION.

## Dependencies

- UPSTREAM REQUIREMENT IDS / SYSTEM COMPONENTS
- TOOLING / INFRA DEPENDENCIES

## Security / Privacy Considerations

- DATA EXPOSURE / ACCESS CONTROL NOTES
- REDACTION / LOGGING RULES

## Performance Considerations

- LATENCY / THROUGHPUT / RESOURCE CONSTRAINTS

## Accessibility & UX Notes

- ACCESSIBILITY EXPECTATIONS OR KEYBOARD / SCREEN READER BEHAVIORS

## Operational Considerations

- MONITORING / ALERTING REQUIREMENTS
- ROLLOUT STRATEGY / FEATURE FLAG
- BACKFILL / MIGRATION STEPS

## Open Questions

- OQ-ID QUESTION TEXT
- QUESTION AWAITING DECISION

## Alternatives Considered

- OPTION_A — Rationale for rejection
- OPTION_B — Rationale for rejection

## Definition of Done

- All Acceptance Criteria satisfied
- Documentation updated (README / developer docs / user help)
- Tests: unit + integration + (E2E if applicable) cover new behavior
- No leftover TODO / FIXME or placeholder strings ("TBD", "<...>")
- Metrics instrumentation added (if applicable)
- Security & privacy checks applied (lint/tests/redaction)

## Appendix (Optional)

DIAGRAMS, SEQUENCE FLOWS, PSEUDO-CODE, DATA MODEL SNIPPETS

---
Template Usage: Replace angle-bracket placeholders and remove unused optional sections before marking Approved. Ensure markdown lint (headings + list spacing) passes and align section order across all PRDs.
