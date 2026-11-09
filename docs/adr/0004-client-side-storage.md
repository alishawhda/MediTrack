# ADR 0004 — Persist patients in localStorage with defensive reads

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Lead engineer

## Context

The prototype let visitors add patients and kept them in `localStorage` between
reloads. `JSON.parse` was unguarded, so corrupt data could throw during page
load, and missing storage (private mode, quota) could break saving with no
feedback.

## Decision

- Keep `localStorage` as the persistence layer for patient records.
- Route all access through `loadPatients()` / `savePatients()` in `data.js`.
- Validate parsed data: non-arrays and records without a string `id`/`name` are
  discarded; failures fall back to the bundled demo data.
- Return a boolean from `savePatients()` and surface failures to the visitor via
  a warning toast instead of silently losing the record.
- Keep `sessionStorage` for the signed-in user so a session ends with the tab.
- Make storage injectable so tests can simulate corruption and quota errors.

## Consequences

- A marker can add a patient, reload, and still see it — the demo feels real.
- Corrupt or unavailable storage degrades to demo data rather than a blank page.
- Data is per-browser and per-device; there is no sync or backup. Documented in
  the README.
- Moving to a backend means replacing the two functions, not the page code.
