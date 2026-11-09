// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { formatDate, renderFooter, renderNavbar, statusBadge } from '../src/js/ui.js';

describe('statusBadge', () => {
  it('maps each status to a distinct class', () => {
    expect(statusBadge('Active')).toContain('status-active');
    expect(statusBadge('Critical')).toContain('status-critical');
    expect(statusBadge('Scheduled')).toContain('status-scheduled');
  });

  it('escapes unexpected status text', () => {
    const html = statusBadge('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('formatDate', () => {
  it('formats ISO dates for humans', () => {
    expect(formatDate('2026-11-09')).toBe('Mon 9 Nov 2026');
  });

  it('returns the input when the date is unparseable', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});

describe('renderNavbar', () => {
  it('marks the current page and escapes the user name', () => {
    const mount = document.createElement('div');
    renderNavbar(mount, {
      page: 'patients',
      user: { name: '<img src=x onerror=alert(1)>' },
      onLogout: () => {},
    });

    const active = mount.querySelector('.nav-link.active');
    expect(active.textContent).toContain('Patients');
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(mount.innerHTML).not.toContain('<img src=x');
  });

  it('wires the logout button', () => {
    const mount = document.createElement('div');
    let loggedOut = false;
    renderNavbar(mount, {
      page: 'dashboard',
      user: { name: 'Dr. Aisyah' },
      onLogout: () => {
        loggedOut = true;
      },
    });
    mount.querySelector('#logoutBtn').click();
    expect(loggedOut).toBe(true);
  });
});

describe('renderFooter', () => {
  it('links to every main page', () => {
    const mount = document.createElement('div');
    renderFooter(mount);
    const hrefs = [...mount.querySelectorAll('a')].map((anchor) => anchor.getAttribute('href'));
    expect(hrefs).toEqual(['dashboard.html', 'patients.html', 'appointments.html']);
  });
});
