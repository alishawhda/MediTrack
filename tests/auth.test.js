import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEMO_CREDENTIALS,
  LOCKOUT_MS,
  MAX_ATTEMPTS,
  authenticate,
  getUser,
  resetThrottle,
  signIn,
  signOut,
} from '../src/js/auth.js';
import { STORAGE_KEYS } from '../src/js/data.js';
import { memoryStorage } from './helpers/memory-storage.js';

beforeEach(() => {
  resetThrottle();
});

describe('authenticate', () => {
  it('accepts the demo credentials', () => {
    const result = authenticate(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password);
    expect(result).toEqual({
      ok: true,
      user: { username: DEMO_CREDENTIALS.username, name: DEMO_CREDENTIALS.name },
    });
  });

  it('trims the username but not the password', () => {
    expect(authenticate('  admin  ', DEMO_CREDENTIALS.password).ok).toBe(true);
    expect(authenticate('admin', ` ${DEMO_CREDENTIALS.password}`).ok).toBe(false);
  });

  it('reports missing input without spending an attempt', () => {
    expect(authenticate('', '')).toEqual({ ok: false, reason: 'missing' });
    expect(authenticate('admin', '').reason).toBe('missing');
    // A missing submission must not contribute to the lockout counter.
    for (let i = 0; i < MAX_ATTEMPTS; i += 1) authenticate('', '');
    expect(authenticate('admin', DEMO_CREDENTIALS.password).ok).toBe(true);
  });

  it('counts down remaining attempts for wrong credentials', () => {
    expect(authenticate('admin', 'nope')).toMatchObject({
      ok: false,
      reason: 'invalid',
      attemptsLeft: MAX_ATTEMPTS - 1,
    });
  });

  it('locks out after the configured number of failures', () => {
    for (let i = 0; i < MAX_ATTEMPTS - 1; i += 1) authenticate('admin', 'wrong');
    const locked = authenticate('admin', 'wrong');
    expect(locked.reason).toBe('locked');
    expect(locked.retryAfterMs).toBe(LOCKOUT_MS);

    // Even the right password is rejected while locked.
    expect(authenticate('admin', DEMO_CREDENTIALS.password).reason).toBe('locked');
  });

  it('unlocks once the lockout window has passed', () => {
    const start = 1_000_000;
    for (let i = 0; i < MAX_ATTEMPTS; i += 1) authenticate('admin', 'wrong', start);
    expect(authenticate('admin', DEMO_CREDENTIALS.password, start + LOCKOUT_MS + 1).ok).toBe(true);
  });

  it('clears the failure counter after a successful login', () => {
    authenticate('admin', 'wrong');
    authenticate('admin', 'wrong');
    expect(authenticate('admin', DEMO_CREDENTIALS.password).ok).toBe(true);
    expect(authenticate('admin', 'wrong').attemptsLeft).toBe(MAX_ATTEMPTS - 1);
  });
});

describe('session helpers', () => {
  it('round-trips a user through storage', () => {
    const storage = memoryStorage();
    expect(getUser(storage)).toBeNull();
    expect(signIn({ username: 'admin', name: 'Dr. Aisyah' }, storage)).toBe(true);
    expect(getUser(storage)).toEqual({ username: 'admin', name: 'Dr. Aisyah' });
  });

  it('clears the session on sign out', () => {
    const storage = memoryStorage();
    signIn({ username: 'admin', name: 'Dr. Aisyah' }, storage);
    signOut(storage);
    expect(storage.getItem(STORAGE_KEYS.user)).toBeNull();
  });

  it('treats corrupt or incomplete sessions as signed out', () => {
    expect(getUser(memoryStorage({ [STORAGE_KEYS.user]: '{bad' }))).toBeNull();
    expect(getUser(memoryStorage({ [STORAGE_KEYS.user]: '{"name":"x"}' }))).toBeNull();
    expect(getUser(memoryStorage({ [STORAGE_KEYS.user]: 'null' }))).toBeNull();
  });

  it('survives storage access throwing', () => {
    const hostile = {
      getItem() {
        throw new Error('denied');
      },
      setItem() {
        throw new Error('denied');
      },
      removeItem() {
        throw new Error('denied');
      },
    };
    expect(getUser(hostile)).toBeNull();
    expect(signIn({ username: 'admin' }, hostile)).toBe(false);
    expect(() => signOut(hostile)).not.toThrow();
  });
});
