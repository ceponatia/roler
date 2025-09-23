import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve package root reliably
const __filename = fileURLToPath(import.meta.url);
const pkgRoot = path.resolve(path.dirname(__filename), '..');

const docusaurusBin = path.resolve(pkgRoot, 'node_modules/.bin/docusaurus');
const siteDir = path.resolve(pkgRoot, 'website');

const result = spawnSync(docusaurusBin, ['gen-api-docs', 'roler', siteDir], {
  cwd: pkgRoot,
  stdio: 'inherit'
});

process.exit(result.status === null ? 1 : result.status);
