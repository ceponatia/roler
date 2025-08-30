---
applyTo:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Instructions for Writing Tests

## General Guidelines

1. **Follow the Pyramid at Boundaries:** Structure your tests from unit tests (L0) to integration tests (L2) and end-to-end tests (L3).
2. **Use Unified Result & Validation:** Leverage @contracts for consistent error handling and validation across tests.
3. **Implement Property Tests Where It Fits:** Utilize property-based testing for more robust and flexible test coverage.
4. **Limit Snapshots to Stable Artifacts:** Use snapshots judiciously and only for stable, well-defined outputs.
5. **Ensure Determinism by Default:** Make tests deterministic by controlling randomness and external dependencies.
6. **Scope Tests to Changes:** Use the affected graph to run only the tests impacted by code changes.
7. **Maintain Readability and Clarity:** Write clear, concise, and well-documented tests to facilitate understanding and maintenance.