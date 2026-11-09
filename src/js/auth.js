/**
 * Demo authentication adapter.
 *
 * MediTrack is a front-end prototype: there is no backend, so credentials are
 * verified in the browser. This module is the single seam a real API would
 * replace. See SECURITY.md before using it for anything but a demo.
 */
import { STORAGE_KEYS } from './data.js';

export const DEMO_CREDENTIALS = Object.freeze({
  username: 'admin',
  password: 'meditrack123',
  name: 'Dr. Aisyah',
});

export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 30_000;

let failedAttempts = 0;
let lockedUntil = 0;

function browserSession() {
  try {
    return typeof sessionStorage === 'undefined' ? null : sessionStorage;
  } catch {
    return null;
  }
}

function isValid(raw) {
  return Boolean(raw && typeof raw === 'object' && typeof raw.username === 'string');
}

/** Read the signed-in user from session storage. */
export function getUser(storage = browserSession()) {
  try {
    const raw = JSON.parse(storage?.getItem(STORAGE_KEYS.user) ?? 'null');
    return isValid(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Persist the signed-in user for the current tab. */
export function signIn(user, storage = browserSession()) {
  try {
    storage?.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return true;
  } catch {
    return false;
  }
}

/** Clear the current session. */
export function signOut(storage = browserSession()) {
  try {
    storage?.removeItem(STORAGE_KEYS.user);
  } catch {
    // Storage may be disabled; an in-memory redirect still logs the user out.
  }
}

/** Reset the in-memory throttle (used by tests and after a successful login). */
export function resetThrottle() {
  failedAttempts = 0;
  lockedUntil = 0;
}

/**
 * Verify demo credentials.
 *
 * @returns {{ok: true, user: {username: string, name: string}}
 *   | {ok: false, reason: 'invalid'|'locked'|'missing', retryAfterMs?: number, attemptsLeft?: number}}
 */
export function authenticate(username, password, now = Date.now()) {
  if (lockedUntil && now < lockedUntil) {
    return { ok: false, reason: 'locked', retryAfterMs: lockedUntil - now };
  }

  const enteredUser = String(username ?? '').trim();
  const enteredPassword = String(password ?? '');

  if (!enteredUser || !enteredPassword) {
    return { ok: false, reason: 'missing' };
  }

  if (enteredUser === DEMO_CREDENTIALS.username && enteredPassword === DEMO_CREDENTIALS.password) {
    resetThrottle();
    return { ok: true, user: { username: DEMO_CREDENTIALS.username, name: DEMO_CREDENTIALS.name } };
  }

  failedAttempts += 1;
  if (failedAttempts >= MAX_ATTEMPTS) {
    lockedUntil = now + LOCKOUT_MS;
    failedAttempts = 0;
    return { ok: false, reason: 'locked', retryAfterMs: LOCKOUT_MS };
  }

  return { ok: false, reason: 'invalid', attemptsLeft: MAX_ATTEMPTS - failedAttempts };
}
