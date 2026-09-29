# niraj-nirmal.github.io/portfolio

Personal portfolio of Niraj Nirmal. Built with [Astro](https://astro.build), deployed to GitHub Pages via GitHub Actions.

## How it works
- **Deploys automatically** on every push to `main`, plus a daily rebuild (05:17 UTC) that refreshes GitHub/LeetCode stats.
- **GitHub & LeetCode cards** are fetched at build time by `scripts/fetch-data.mjs`. If an API is down, the committed JSON in `src/data/` is used, so deploys never break.

## Add an article
Create `src/content/writing/my-article.md`:

```markdown
---
title: "My article title"
description: "One-line summary shown on cards."
date: 2026-10-15
tags: ["MLOps"]
readingTime: "6 min read"
---
Article body in Markdown…
```

Commit and push — done. The home page always shows the 3 most recent; the archive lists everything.
To retire a placeholder card, delete its file from `src/content/writing/`.

## Local development
```bash
npm install
npm run fetch-data   # optional; refreshes stats
npm run dev          # http://localhost:4321/portfolio
npm run build        # output in dist/
```

## Structure
- `src/pages/index.astro` — the single-page home
- `src/pages/writing/` — archive + article pages
- `src/styles/global.css` — design tokens (black/gold palette) and all styling
- `src/layouts/Base.astro` — head metadata, nav, footer
- `public/` — favicon, robots.txt, OG image
