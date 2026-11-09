/* Login page controller. */
import { authenticate, getUser, signIn } from '../auth.js';

function defaultNavigate(url) {
  globalThis.location.assign(url);
}

function messageFor(result) {
  if (result.reason === 'missing') return 'Enter both your username and password.';
  if (result.reason === 'locked') {
    const seconds = Math.ceil((result.retryAfterMs ?? 0) / 1000);
    return `Too many failed attempts. Try again in ${seconds} second${seconds === 1 ? '' : 's'}.`;
  }
  if (typeof result.attemptsLeft === 'number') {
    return `Invalid username or password. ${result.attemptsLeft} attempt${
      result.attemptsLeft === 1 ? '' : 's'
    } left before a short lockout.`;
  }
  return 'Invalid username or password. Please try again.';
}

export function initLoginPage({ doc = document, storage, navigate = defaultNavigate } = {}) {
  const form = doc.getElementById('loginForm');
  if (!form) return false;

  if (getUser(storage)) {
    navigate('dashboard.html');
    return false;
  }

  const errorBox = doc.getElementById('loginError');
  const username = doc.getElementById('username');
  const password = doc.getElementById('password');
  const submit = form.querySelector('button[type="submit"]');
  const toggle = doc.getElementById('togglePassword');

  const clearError = () => {
    errorBox.textContent = '';
    errorBox.classList.add('d-none');
  };

  const showError = (message) => {
    errorBox.textContent = message;
    errorBox.classList.remove('d-none');
  };

  toggle?.addEventListener('click', () => {
    const visible = password.type === 'text';
    password.type = visible ? 'password' : 'text';
    toggle.setAttribute('aria-pressed', String(!visible));
    toggle.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
    toggle.querySelector('i')?.classList.toggle('bi-eye', visible);
    toggle.querySelector('i')?.classList.toggle('bi-eye-slash', !visible);
    password.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError();
    username.classList.remove('is-invalid');
    password.classList.remove('is-invalid');

    const result = authenticate(username.value, password.value);

    if (result.ok) {
      signIn(result.user, storage);
      submit.disabled = true;
      submit.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Signing in…';
      navigate('dashboard.html');
      return;
    }

    showError(messageFor(result));
    if (result.reason === 'invalid' || result.reason === 'missing') {
      username.classList.add('is-invalid');
      password.classList.add('is-invalid');
    }
    password.select();
  });

  return true;
}

if (typeof document !== 'undefined' && document.body?.dataset.page === 'login') {
  initLoginPage();
}
