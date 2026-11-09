// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initLoginPage } from '../src/js/pages/login.js';
import { resetThrottle } from '../src/js/auth.js';
import { STORAGE_KEYS } from '../src/js/data.js';
import { memoryStorage } from './helpers/memory-storage.js';

const PAGE = `
  <div id="loginError" class="alert alert-danger d-none" role="alert"></div>
  <form id="loginForm" novalidate>
    <input id="username" name="username" />
    <input id="password" name="password" type="password" />
    <button id="togglePassword" type="button" aria-pressed="false" aria-label="Show password">
      <i class="bi bi-eye"></i>
    </button>
    <button type="submit">Sign in</button>
  </form>
`;

function setup() {
  document.body.innerHTML = PAGE;
  const storage = memoryStorage();
  const navigate = vi.fn();
  initLoginPage({ doc: document, storage, navigate });
  return {
    storage,
    navigate,
    form: document.getElementById('loginForm'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    error: document.getElementById('loginError'),
  };
}

function submit(form) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

beforeEach(() => {
  resetThrottle();
});

describe('login page', () => {
  it('signs in with the demo credentials and stores the session', () => {
    const { form, username, password, storage, navigate } = setup();
    username.value = 'admin';
    password.value = 'meditrack123';

    submit(form);

    expect(navigate).toHaveBeenCalledWith('dashboard.html');
    expect(JSON.parse(storage.getItem(STORAGE_KEYS.user))).toEqual({
      username: 'admin',
      name: 'Dr. Aisyah',
    });
  });

  it('shows a helpful error for wrong credentials and does not navigate', () => {
    const { form, username, password, navigate, error } = setup();
    username.value = 'admin';
    password.value = 'wrong';

    submit(form);

    expect(navigate).not.toHaveBeenCalled();
    expect(error.classList.contains('d-none')).toBe(false);
    expect(error.textContent).toMatch(/Invalid username or password/i);
    expect(username.classList.contains('is-invalid')).toBe(true);
  });

  it('asks for both fields when they are empty', () => {
    const { form, error } = setup();
    submit(form);
    expect(error.textContent).toBe('Enter both your username and password.');
  });

  it('mentions the lockout once attempts are exhausted', () => {
    const { form, username, password, error } = setup();
    username.value = 'admin';
    password.value = 'wrong';
    for (let i = 0; i < 5; i += 1) submit(form);
    expect(error.textContent).toMatch(/Too many failed attempts/i);
  });

  it('redirects an already signed-in visitor straight to the dashboard', () => {
    document.body.innerHTML = PAGE;
    const navigate = vi.fn();
    const storage = memoryStorage({
      [STORAGE_KEYS.user]: JSON.stringify({ username: 'admin', name: 'Dr. Aisyah' }),
    });

    initLoginPage({ doc: document, storage, navigate });

    expect(navigate).toHaveBeenCalledWith('dashboard.html');
  });

  it('toggles password visibility without exposing it by default', () => {
    const { password } = setup();
    const toggle = document.getElementById('togglePassword');
    expect(password.type).toBe('password');

    toggle.click();
    expect(password.type).toBe('text');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');

    toggle.click();
    expect(password.type).toBe('password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });
});
