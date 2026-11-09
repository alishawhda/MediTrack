# ADR 0003 — Isolate demo authentication behind one adapter

- **Status:** Accepted
- **Date:** 2026-11-09
- **Deciders:** Lead engineer

## Context

The prototype hard-coded `admin` / `meditrack123` inside a global script and
compared credentials inline in the login handler. That conflated UI, session
handling and credential logic, and made the security story unclear.

A static site cannot provide real authentication: any client-side check can be
read or bypassed. Pretending otherwise would be dishonest.

## Decision

- Move credential verification, session storage and throttling into
  `src/js/auth.js`.
- Keep the demo credentials explicit and documented in the README and login
  page. Do **not** obfuscate or hash them in the client — that would be security
  theatre.
- Add a five-attempt in-memory lockout as a UX safeguard, documented as such.
- Document the limitations prominently in `SECURITY.md` and provide a migration
  checklist for real deployment.
- Never include credentials of any kind in source that talks to a real service;
  this project talks to none.

## Consequences

- One file to replace when a real API arrives: swap `authenticate()` and the
  session helpers for HTTP calls.
- The login page and its tests remain stable if the auth mechanism changes.
- Reviewers can see exactly how weak the demo auth is, which is safer than a
  false sense of security.
