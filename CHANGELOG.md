# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned

- Appointment create/edit flow
- Playwright end-to-end coverage
- CSV import/export

## [0.1.0] - 2026-11-09

### Added

- Vite multi-page build, dev server and production bundle.
- Vitest suite: 57 tests covering domain helpers, auth throttling, login,
  patient table, add-patient flow and shared UI rendering.
- ESLint flat config, Prettier, EditorConfig and a committed lockfile.
- GitHub Actions CI (lint, format check, tests, build) and a Pages deploy
  workflow.
- Community files: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue and
  PR templates, Dependabot.
- Architecture decision records in `docs/adr/`.
- Accessible skip links, semantic headings, labelled controls, focus rings,
  `aria-live` status areas and reduced-motion support.
- Demo login lockout after five failed attempts, with a countdown message.
- Patient form field-level validation and a `role="status"` success toast.
- Graceful fallbacks for corrupt or unavailable browser storage.

### Changed

- Refactored page scripts from globals/IIFEs into ES modules with explicit
  imports and per-page `init…Page()` entry points.
- Bundled Bootstrap, Bootstrap Icons and Chart.js from npm instead of CDN
  `<script>` tags, with pinned versions.
- Replaced inline `onclick` logout with a listener.
- Human-readable appointment dates (`Mon 9 Nov 2026`).
- Table dates no longer wrap mid-value.

### Security

- Removed the inline credential check from the global script; demo auth now
  lives behind a single `auth.js` seam documented in SECURITY.md.
- All user-provided table content is escaped before rendering.
