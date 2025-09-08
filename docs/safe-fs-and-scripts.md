# Safe Filesystem Wrapper & Scripts (Draft)

## Purpose

Mitigate security/static-analysis risks of dynamic filesystem traversal in repo maintenance scripts (e.g., coverage merging).

## Module

- Location: `scripts/safe-fs.mjs`
- Exports: `createSafeFs(rootDir, opts)`, `asSafePath(rootDir, p)`
- Guarantees:
  - Root confinement via realpath prefix check
  - Symlink traversal safety
  - Hidden segment filtering (skip or error)
  - File size caps (default 5MB)
  - Centralized dynamic path usage (single audit point)

## Usage Pattern

```js
import { createSafeFs, asSafePath } from './safe-fs.mjs';
const safe = createSafeFs(rootDir);
const file = asSafePath(rootDir, 'packages/pkg/coverage/lcov.info');
const st = await safe.statSafe(file);
```

## Applied In

- `scripts/merge-lcov.mjs` – merges per-package `lcov.info` into root `monorepo-lcov.info` with annotated sections.

## Guidance For New Scripts

- Always construct absolute paths via `asSafePath`.
- Perform directory listings with `readdirSafe` and filter intentionally.
- Never call `fs.readFile` / `fs.stat` directly for dynamic repo paths; route through wrapper.

## Future Enhancements

- Add allowlist / denylist pattern filters
- Add glob expansion utility within safe wrapper
- Extend to write temp files under a controlled `tmp/` subdirectory
