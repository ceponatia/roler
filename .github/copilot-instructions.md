# Copilot Instructions for Roler

These rules are mandatory for all suggestions and generated changes.

1) TypeScript and API design
- Use strict TypeScript. Avoid `any`/`unknown`. If unavoidable, justify with a comment and link to an issue.
- Export APIs only from package root (`index.ts`) and update the package `exports` map. Do not use deep imports.
- Add TSDoc for every exported type/function, including usage examples for complex APIs.
- Prefer pure functions; avoid module side effects. Accurately set `sideEffects` in `package.json`.

2) Tests and coverage
- Add or update tests in the same change. Never submit functional changes without tests.
- Write deterministic tests; minimize snapshot usage and cover edge cases.
- Meet coverage thresholds (global and per-package). If a threshold is unmet, add tests or justify with a linked issue.

3) Linting, formatting, and structure
- Do not disable lint rules unless justified with a linked issue. Fix root causes.
- Adhere to project structure and module boundaries. Respect aliasing rules and avoid deep imports.
- Keep files small and cohesive; create modules per domain boundaries.

4) Documentation and changelogs
- Update package README when public APIs change (include examples).
- Reference PRD requirement IDs (e.g., r-00X) in PR descriptions and, when appropriate, in code comments.
- Add a Changeset for any user-visible change, public API change, or behavior change.

5) Security and configuration
- Never commit secrets. Read configuration from environment variables.
- Validate environment variables and external inputs with a schema (e.g., zod) before use.
- Avoid `console.log` in libraries; use the project logging facade with levels and contexts.

6) Scripts and portability
- Prefer cross-platform Node/TS scripts over bash-specific implementations.
- Ensure scripts run on Windows, macOS, and Linux.

7) Commit and PR conventions
- Use Conventional Commits; choose a clear scope (e.g., package name).
- Keep PRs focused. If large changes are required, explain why and outline the testing strategy.
- Fill out the PR template completely and link to relevant PRD/Techspec sections and issues.

Definition of Done (include this checklist in PRs)
- [ ] Lint/format clean; TypeScript strict passes
- [ ] Tests added/updated, deterministic; coverage thresholds met
- [ ] Public API boundaries respected; exports map updated; no deep imports
- [ ] TSDoc/README updated for public APIs
- [ ] Changeset added (if applicable)
- [ ] References to PRD requirement IDs added
- [ ] CI passes