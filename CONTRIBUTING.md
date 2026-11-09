# Contributing to MediTrack

Thanks for helping. This is a small static app, so the workflow is lightweight
but the quality bar is real: every change must keep lint, formatting, tests and
the production build green.

## Setup

```bash
git clone https://github.com/alishawhda/MediTrack.git
cd MediTrack
npm install
npm start
```

Node **20.19+** is required (22 recommended). Use the lockfile; do not commit
`node_modules`.

## Before opening a pull request

```bash
npm run format
npm run lint
npm test
npm run build
```

All four must pass. CI runs the same commands and will block a merge if any fail.

## Branches and commits

- Branch from `main`: `feat/…`, `fix/…`, `docs/…`, `chore/…`.
- Use [Conventional Commits](https://www.conventionalcommits.org/):
  `feat: add appointment filter`, `fix: stop date cells wrapping`.
- Keep pull requests focused. One concern per PR, with a short description of
  the problem and the approach.

## Code conventions

- **ES modules only.** No globals, no IIFEs. Page controllers export
  `init…Page(options)` and accept injectable `doc`, `storage` and `navigate`.
- **Pure logic in `data.js`.** If it can be tested without a DOM, it belongs
  there.
- **Escape before interpolating HTML.** Use `escapeHtml()` from `data.js` for
  anything that originates from storage or input.
- **Accessibility is not optional.** New controls need labels, visible focus,
  and keyboard operation. Status changes should use an `aria-live` region.
- **No new runtime CDN dependencies.** Add packages via npm and import them so
  the build stays self-contained.

## Tests

- Unit tests: `tests/data.test.js`, `tests/auth.test.js`.
- jsdom integration tests: `tests/login-page.test.js`,
  `tests/patients-page.test.js`, `tests/ui.test.js`.
- Name tests by behaviour, not implementation: “shows a helpful error for wrong
  credentials” beats “calls authenticate”.

When fixing a bug, add the failing test first, then the fix.

## Reporting bugs

Use the issue template. Include browser, steps to reproduce, expected and actual
behaviour. For security issues, follow [SECURITY.md](SECURITY.md) instead of
opening a public issue.
