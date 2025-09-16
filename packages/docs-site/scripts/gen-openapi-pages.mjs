#! /usr/bin/env -S node
/* eslint-env node */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve package root reliably
const __filename = fileURLToPath(import.meta.url);
const pkgRoot = path.resolve(path.dirname(__filename), '..');

const siteDir = path.resolve(pkgRoot, 'website');
const docusaurusMjs = path.resolve(pkgRoot, 'node_modules/@docusaurus/core/bin/docusaurus.mjs');

const node = process.env.npm_node_execpath || process.execPath;
const result = spawnSync(node, [docusaurusMjs, 'gen-api-docs', 'roler'], {
  cwd: siteDir,
  stdio: 'inherit'
});

const code = typeof result.status === 'number' ? result.status : 1;
process.exit(code);
