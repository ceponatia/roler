# Testing & Coverage (Draft)

## Strategy

- Per-package isolation: each workspace defines its own `vitest.config.ts`.
- `pnpm test:ci` runs tests serially across workspaces with coverage enabled.
- Coverage reporters: text summary + lcov written to `coverage/lcov.info` in each package.

## Merge Process

- Script: `scripts/merge-lcov.mjs` (uses `safe-fs` wrapper for path confinement and deterministic merging).
- Output: root `coverage/monorepo-lcov.info` consumed by Codacy workflow.

## Codacy Integration

- Workflow: `.github/workflows/coverage-codacy.yml` runs on PR + main pushes.
- Steps: install deps → run `pnpm test:ci` → merge coverage → upload via Codacy bash uploader.
- Secret: `CODACY_PROJECT_TOKEN` required (GitHub Actions secret).

## Adding a New Package

1. Create `vitest.config.ts` with coverage enabled (reporter lcov).
2. Add test scripts (`test`, `test:ci`) mirroring existing packages.
3. Ensure `pnpm test:ci` covers the new package (workspace detected automatically).
4. Verify merged report includes the new package sections.

## Future Enhancements

- Enforce minimum coverage thresholds per package.
- Add failure condition if merged lcov below size/line count.
- Generate coverage badge from Codacy or local lcov parsing.
