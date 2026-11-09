/* Shared, DOM-only presentation helpers. */
import { escapeHtml } from './data.js';

export const NAV_ITEMS = Object.freeze([
  { page: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { page: 'patients', label: 'Patients', icon: 'bi-people' },
  { page: 'appointments', label: 'Appointments', icon: 'bi-calendar-check' },
]);

const STATUS_CLASS = Object.freeze({
  Active: 'status-active',
  Critical: 'status-critical',
  Discharged: 'status-discharged',
  Scheduled: 'status-scheduled',
  Completed: 'status-completed',
  Cancelled: 'status-cancelled',
});

/** Colour-coded status pill. */
export function statusBadge(status) {
  const className = STATUS_CLASS[status] ?? 'status-discharged';
  return `<span class="badge-status ${className}">${escapeHtml(status)}</span>`;
}

/** Human-friendly date, e.g. "Mon 9 Nov 2026". Falls back to the input. */
export function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(isoDate);

  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';

  return `${value('weekday')} ${value('day')} ${value('month')} ${value('year')}`.trim();
}

/** Render the top navigation into `mount`. */
export function renderNavbar(mount, { page, user, onLogout } = {}) {
  const items = NAV_ITEMS.map((item) => {
    const active = item.page === page;
    return `<li class="nav-item">
      <a class="nav-link${active ? ' active' : ''}" href="${item.page}.html"${
        active ? ' aria-current="page"' : ''
      }><i class="bi ${item.icon} me-1" aria-hidden="true"></i>${item.label}</a>
    </li>`;
  }).join('');

  mount.innerHTML = `
    <nav class="navbar navbar-expand-md navbar-mt navbar-dark" aria-label="Main">
      <div class="container">
        <a class="navbar-brand brand" href="dashboard.html">
          <i class="bi bi-heart-pulse-fill text-warning me-1" aria-hidden="true"></i>Medi<span>Track</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
          aria-controls="menu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menu">
          <ul class="navbar-nav me-auto">${items}</ul>
          <span class="navbar-user me-3 small">
            <i class="bi bi-person-circle me-1" aria-hidden="true"></i>${escapeHtml(user?.name ?? '')}
          </span>
          <button class="btn btn-sm btn-outline-light" type="button" id="logoutBtn">
            <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i>Log out
          </button>
        </div>
      </div>
    </nav>`;

  mount.querySelector('#logoutBtn')?.addEventListener('click', () => onLogout?.());
}

/** Render the site footer. */
export function renderFooter(mount) {
  mount.innerHTML = `
    <footer class="footer-mt">
      <div class="container d-flex flex-column flex-md-row justify-content-between gap-2">
        <div>
          <strong class="brand">MediTrack</strong> — Patient Management System<br>
          IMS566 Individual Project, UiTM
        </div>
        <div class="text-md-end">
          &copy; 2026 MediTrack. Sample data only.<br>
          <a href="dashboard.html">Dashboard</a> |
          <a href="patients.html">Patients</a> |
          <a href="appointments.html">Appointments</a>
        </div>
      </div>
    </footer>`;
}

let toastTimer;

/** Announce a short message in the page's polite live region. */
export function showToast(message, { doc = document, tone = 'success' } = {}) {
  const region = doc.getElementById('toast');
  if (!region) return;
  region.textContent = message;
  region.dataset.tone = tone;
  region.classList.remove('d-none');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => region.classList.add('d-none'), 4000);
}
