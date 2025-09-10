---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
description: Run the wiki locally and contribute new pages
---

This page covers working with the wiki only. It does not require the full application.

## Run locally (fish)

```fish
cd gh-pages
pnpm install
pnpm start
```

To build and preview the static site:

```fish
cd gh-pages
pnpm build
pnpm serve
```

## Contribution rules

- Keep content inside `gh-pages/docs/` only.
- Do not include requirements, PRDs, or tech specs in the site. Link to them on GitHub if needed.
- Prefer short, maintainable pages, with frontmatter (`id`, `title`, `sidebar_label`, `description`).
- Add new pages to the curated sidebar (`gh-pages/sidebars.ts`).
- Clearly distinguish what’s implemented vs. planned.
