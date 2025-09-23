# Remove Redocusaurus and Implement Native OpenAPI in Docusaurus

> **Objective:** Remove **Redocusaurus** and switch to **Redocly’s Docusaurus OpenAPI plugin & theme** so **all docs live natively inside Docusaurus** (no iframes, no separate Redoc HTML). Keep **TypeDoc → Markdown** for TS APIs and generate **Zod → OpenAPI** for schema/API docs. Build with **Node 20 LTS** in CI.

---

## ✅ Outcomes

- **Redocusaurus** removed from dependencies and config.
- **OpenAPI** rendered as **native Docusaurus pages** using:
  - `@redocly/docusaurus-plugin-openapi-docs`
  - `docusaurus-theme-openapi`
- **TypeDoc** generates Markdown under `packages/docs-site/docs/api/`.
- **Zod → OpenAPI** spec generated at `packages/docs-site/openapi.json`.
- **Docusaurus** builds cleanly (SSR-safe) on **Node 20 LTS**.
- **GitHub Actions** builds & deploys the site.

---

## 0) Branch & Environment

```bash
git checkout -b docs/remove-redocusaurus
# Ensure Node 20 for docs work
node -v   # should be v20.x
```

---

## 1) Uninstall Redocusaurus & Cleanup Config

Remove any usage of **redocusaurus** in `docusaurus.config.(js|ts)` (presets/plugins).

**Uninstall packages:**

```bash
pnpm remove -w redocusaurus redoc-cli || true
```

> If you previously relied on `redoc-cli bundle`, you won’t need it anymore. We’ll generate native pages instead.

Search removal points (adjust the paths as needed):

- `packages/docs-site/docusaurus.config.ts` → remove `redocusaurus` entries.
- Any references to `openapi.html` or Redoc iframe pages → remove.

Commit:

```bash
git add -A
git commit -m "docs: remove Redocusaurus and related config"
```

---

## 2) Install Native OpenAPI Integration (No Iframes)

Install **Redocly’s plugin & theme** + TypeDoc + Zod → OpenAPI at the workspace root:

```bash
pnpm add -Dw   @redocly/docusaurus-plugin-openapi-docs   docusaurus-theme-openapi   @asteasolutions/zod-to-openapi   typedoc typedoc-plugin-markdown
```

---

## 3) TypeDoc Configuration (Markdown)

Create or update `typedoc.json` (at repo root or in `packages/docs-site`). Example:

```json
{
  "entryPoints": ["packages/your-lib/src/index.ts"],
  "plugin": ["typedoc-plugin-markdown"],
  "out": "packages/docs-site/docs/api",
  "hideBreadcrumbs": true,
  "hideInPageTOC": false
}
```

> Adjust `entryPoints` to match your monorepo package(s).

Add script(s) to **root** `package.json`:

```json
{
  "scripts": {
    "docs:typedoc": "typedoc"
  }
}
```

---

## 4) Zod → OpenAPI Generation Script

Create `scripts/gen-openapi.ts` (adjust schemas to your project):

```ts
import { z } from 'zod';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const registry = new OpenAPIRegistry();

// Example schema
const Character = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  class: z.enum(['mage','warrior','rogue']),
  level: z.number().int().min(1),
});
registry.register('Character', Character);

// TODO: Add your paths/responses and register them as needed.

const generator = new OpenApiGeneratorV3(registry.definitions);
const doc = generator.generateDocument({
  openapi: '3.0.3',
  info: { title: 'LLM RPG API', version: '1.0.0' },
  paths: {},
});

writeFileSync(
  join(process.cwd(), 'packages/docs-site/openapi.json'),
  JSON.stringify(doc, null, 2)
);
console.log('Wrote OpenAPI spec to packages/docs-site/openapi.json');
```

Add script to **root** `package.json`:

```json
{
  "scripts": {
    "docs:openapi:gen": "ts-node scripts/gen-openapi.ts"
  }
}
```

> Ensure `ts-node` is available in your dev stack (either installed or via your monorepo tooling).

---

## 5) Docusaurus Configuration

Update `packages/docs-site/docusaurus.config.ts`:

```ts
import type {Config} from '@docusaurus/types';

const config: Config = {
  // ... your existing config
  themes: [
    'docusaurus-theme-openapi',
  ],
  plugins: [
    [
      '@redocly/docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        docsPluginId: 'classic',
        config: {
          rpg: {
            // If you write openapi.json to the docs-site package:
            specPath: 'openapi.json',
            outputDir: 'openapi',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            }
          }
        }
      }
    ]
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Your Docs',
      items: [
        {type: 'docSidebar', sidebarId: 'apiSidebar', position: 'left', label: 'API (TS)'},
        {type: 'docSidebar', sidebarId: 'openapiSidebar', position: 'left', label: 'OpenAPI'},
      ],
    },
  },
};

export default config;
```

Create/update `packages/docs-site/sidebars.ts`:

```ts
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  apiSidebar: [{type: 'autogenerated', dirName: 'api'}],
  openapiSidebar: [{type: 'autogenerated', dirName: 'openapi'}],
};

export default sidebars;
```

---

## 6) Generate OpenAPI Pages (Native Docusaurus)

Add a script to generate MDX pages from your `openapi.json` via the Redocly plugin:

**Root `package.json`:**

```json
{
  "scripts": {
    "docs:openapi:pages": "docusaurus openapi:generate --config packages/docs-site/docusaurus.config.ts --id openapi"
  }
}
```

This writes MDX under `packages/docs-site/openapi/` which Docusaurus serves natively.

---

## 7) Build & Verify Locally

```bash
pnpm docs:openapi:gen        # Zod -> openapi.json
pnpm docs:typedoc            # TS -> docs/api Markdown
pnpm docs:openapi:pages      # Generate native OpenAPI pages
pnpm -C packages/docs-site start   # or build
```

You should see two sidebars:

- **API (TS)** → TypeDoc Markdown under `/docs/api/*`
- **OpenAPI** → Generated pages under `/docs/openapi/*`

Commit:

```bash
git add -A
git commit -m "docs: add Redocly Docusaurus OpenAPI plugin & theme; TypeDoc Markdown; native OpenAPI pages"
```

---

## 8) GitHub Actions (CI/CD)

Create or update a docs workflow (Node **20 LTS**):

```yaml
name: Docs
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install deps
        run: pnpm install --frozen-lockfile

      - name: Generate OpenAPI from Zod
        run: pnpm docs:openapi:gen

      - name: Generate TypeDoc Markdown
        run: pnpm docs:typedoc

      - name: Generate OpenAPI Pages
        run: pnpm docs:openapi:pages

      - name: Build Docusaurus
        run: pnpm -C packages/docs-site build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: packages/docs-site/build
```

Commit:

```bash
git add -A
git commit -m "ci: build & deploy Docusaurus docs with OpenAPI pages and TypeDoc"
```

---

## 9) Cleanup & Verification Checklist

- [ ] No `redocusaurus` in `package.json` or lockfile.
- [ ] No `openapi.html` or Redoc iframes left.
- [ ] `packages/docs-site/openapi.json` generated by `docs:openapi:gen`.
- [ ] `packages/docs-site/openapi/` contains MDX after `docs:openapi:pages`.
- [ ] `packages/docs-site/docs/api/` contains TypeDoc Markdown.
- [ ] Local `pnpm -C packages/docs-site build` passes on Node 20.
- [ ] CI passes and deploys.
- [ ] Navigation shows **API (TS)** and **OpenAPI** sidebars.

---

## 10) Merge

```bash
git push origin docs/remove-redocusaurus
# Open PR, get review, merge to main
```

**Done!** You now have a single, native Docusaurus site hosting both TS API docs (TypeDoc) and OpenAPI docs (generated from Zod) with SSR-safe build and CI deployment.
