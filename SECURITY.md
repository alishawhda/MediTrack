# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | ✅        |
| < 0.1   | ❌        |

## Reporting a vulnerability

Please **do not open a public issue**. Use GitHub’s private
[security advisory](https://github.com/alishawhda/MediTrack/security/advisories/new)
form. Include:

- the affected page or module,
- reproduction steps or a proof of concept,
- the impact you believe it has,
- your browser/OS if relevant.

You can expect an acknowledgement within 72 hours. This is a student project
maintained on a best-effort basis; fixes are prioritised by impact.

## What this project is (and is not)

MediTrack is a **front-end prototype with no backend**. It is not suitable for
real patient data, and the security posture reflects that:

- **Credentials are intentionally public.** The demo login (`admin` /
  `meditrack123`) is verified entirely in the browser by `src/js/auth.js`.
  Anyone can read the source or bypass the check. There is no server-side
  authentication, authorisation, or session integrity.
- **All data is client-side.** Patients are stored in `localStorage` on the
  visitor’s device. Nothing is transmitted. Clearing site data deletes it.
- **XSS is mitigated defensively.** Values read from storage or form input are
  escaped with `escapeHtml()` before being inserted into HTML. Chart options
  and labels come from bundled constants.
- **The lockout throttle is UX, not security.** It lives in memory and resets
  on reload; it reduces accidental brute force in a demo, not a real attack.

## Before production use

If you adapt this project for real use, at minimum:

1. Replace `src/js/auth.js` with an API-backed login using HTTP-only cookies and
   server-side session validation.
2. Add role-based authorisation for every read and write.
3. Move patient data to a database with encryption at rest and in transit.
4. Add CSRF protection, rate limiting, audit logging, and a privacy/data
   retention policy.
5. Run a dependency and application security review before launch.

## Dependency hygiene

- Runtime and dev dependencies are pinned exactly in `package.json`, with a
  committed `package-lock.json`.
- `npm audit` is expected to report **0 vulnerabilities**; CI fails on lint,
  test or build regressions, and Dependabot raises update PRs weekly.
