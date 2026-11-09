# ADR 0002 — ES modules, Vite and injected dependencies

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Lead engineer

## Context

The original code used four `<script>` tags per page, IIFEs and implicit globals
(`getUser`, `loadPatients`, `APPOINTMENTS`, `Chart`). Nothing could be imported
by a test, and load order was significant.

Tests and a build step are required quality gates. Both need explicit module
boundaries.

## Decision

1. Convert application code to **ES modules** with named exports.
2. Use **Vite** for the dev server and multi-page production build.
3. Give each page a controller that exports `init…Page({ doc, storage, navigate })`
   and only auto-runs when its page marker is present.
4. Bundle Bootstrap, Bootstrap Icons and Chart.js from pinned npm versions
   rather than CDN tags.

## Consequences

- Modules must be served over HTTP; opening `index.html` from the filesystem no
  longer works. `npm start` is the documented entry point.
- Tests import pure functions directly and drive page controllers in jsdom with
  fake storage — no browser download required.
- Vite emits one small bundle per page plus shared chunks, with hashed asset
  names and relative `base: './'` paths for GitHub Pages.
- Dependencies are versioned in `package-lock.json` and scanned by Dependabot.
- Bundle size grows versus CDN scripts, but the app becomes reproducible and
  works offline.
