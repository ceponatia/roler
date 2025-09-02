# Development Standard: DS-XXX TITLE

Standard ID: DS-XXX
Category: (Typing | Validation | Error Handling | Architecture | Logging | Security | Build | Testing | Other)
Status: Draft | In Review | Approved | Deprecated
Owner: OWNER_NAME
Last Updated: YYYY-MM-DD
Version: 1.0.0

## 1. Summary

ONE PARAGRAPH concise description of the standard, why it exists, and the high-level mandate it imposes.

## 2. Rationale

- Motivation / problem this solves.
- Risks if omitted (defect types, security, maintainability, performance impacts).
- Alignment with product / engineering goals (e.g., ties to R-004 strong typing, R-098 quality gates).

## 3. Normative Requirement Statement

> A short MUST / MUST NOT statement defining the enforceable rule (e.g., "All exported functions MUST declare an explicit return type").

## 4. Scope

- In-Scope: MODULES / FILE TYPES / SCENARIOS where rule applies.
- Out-of-Scope: EXCLUSIONS (generated code, third-party types, migration scripts, etc.).

## 5. Definitions (If Needed)

- TERM: Clarification.
- TERM: Clarification.

## 6. Examples

### 6.1 Compliant

```ts
// GOOD: explicit return type declared
export function parseEntity(input: unknown): EntityResult { /* ... */ }
```

### 6.2 Non-Compliant

```ts
// BAD: implicit any return type
export function parseEntity(input) { /* ... */ }
```

### 6.3 Edge Cases

- Brief list of borderline scenarios and prescribed treatment.

## 7. Implementation Guidance

- Practical steps to apply the rule.
- Preferred language / library constructs.
- Migration notes for existing violations.

## 8. Tooling & Enforcement

- Lint Rules: ESLint rule name / custom rule reference.
- TypeScript Compiler Flags (if applicable).
- CI Gates: how failure manifests (exit code, report artifact).
- Pre-Commit / Pre-Push Hooks (optional).

## 9. Metrics & Reporting

- Violation count trend (target 0).
- Time-to-remediation SLA if violations appear.
- Dashboard / report location (if any).

## 10. Related Standards & Requirements

- Related DS: DS-YYY (explain relationship / precedence if conflicts).
- Related Functional Requirements: R-###, R-### (e.g., R-025 schema validation, R-107 strict TS config).

## 11. Exception Process

- Allowed only for: exceptional legacy migration / external dependency.
- Approval required from ROLE(S) (e.g., Tech Lead + Product).
- Exception record format (ID, scope, expiry date, mitigation).
- Automatic expiry / review cadence (e.g., 30 days).

## 12. Risks if Violated

- List concrete failure modes (runtime type errors, data leakage, inconsistent logs, etc.).

## 13. Security / Privacy Considerations

- How adhering protects against misuse or leaks (if relevant).
- Redaction / masking implications (if relevant to logging standards).

## 14. Performance Considerations

- Overhead (compile-time, build length, runtime impacts) and justification.

## 15. Accessibility & UX Considerations (Optional)

- Only if the standard influences UI implementation patterns (e.g., a11y related coding guidelines).

## 16. Migration Plan (If Newly Introduced)

- Phase 1: Detection only (no fail) — timeline.
- Phase 2: CI warning.
- Phase 3: CI hard fail.
- Cleanup tasks / owners.

## 17. Validation & Test Strategy

- Unit tests for custom lint rules / transformers.
- Integration test ensuring rule active (e.g., intentionally violating fixture should fail in CI simulation).

## 18. Adoption Checklist

- [ ] Normative statement authored.
- [ ] Examples added (good & bad).
- [ ] Enforcement tooling configured.
- [ ] Exception process documented.
- [ ] Added to contributor docs / README section.
- [ ] Metrics collection defined.

## 19. Change Log

| Version | Date | Author | Change |
| ------- | ---- | ------ | ------ |
| 1.0.0 | YYYY-MM-DD | AUTHOR | Initial template creation |

## 20. Appendix (Optional)

- Additional diagrams, decision matrices, or rationale expansions.

---
Template Usage: Duplicate this file, replace placeholders, trim unused optional sections, and update Version upon material revisions. Ensure alignment with overarching requirements (R-004, R-098, R-107) and cross-reference related DS documents for cohesion.
