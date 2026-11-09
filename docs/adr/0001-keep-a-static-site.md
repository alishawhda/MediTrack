# ADR 0001 — Keep MediTrack a static site

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Lead engineer

## Context

MediTrack began as four HTML pages with Bootstrap and Chart.js loaded from CDNs,
shared behaviour in global scripts, and sample data in `localStorage`. It is an
IMS566 individual project, graded on the front-end experience, and it must be
easy for a marker to open and use.

The brief for this work is “production-quality repository”, which could mean a
framework rewrite. That would add a server, a database and deployment
infrastructure the project does not need, while risking the hand-built pages the
assignment describes.

## Decision

Keep MediTrack as a **static, multi-page site**. Invest the quality budget in
structure, tests, accessibility, documentation and CI instead of a framework
migration.

## Consequences

- Hosting stays free and trivial (GitHub Pages), with no backend to operate.
- The app works offline after the first load; there is no API latency.
- Records are per-device and cannot be shared. This is documented as a demo
  limitation, not hidden.
- A real product would need a backend; the module boundaries (`auth.js`,
  `data.js`) are designed to make that replacement incremental.
- Rewriting to a SPA later remains possible without changing the visual design
  or the test intentions.
