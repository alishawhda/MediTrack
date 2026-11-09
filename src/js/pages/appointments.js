/* Appointments page controller: status filter, table and department chart. */
import { initShell } from '../shell.js';
import { APPOINTMENTS, escapeHtml } from '../data.js';
import { createDepartmentChart } from '../charts.js';
import { formatDate, statusBadge } from '../ui.js';

export function initAppointmentsPage({ doc = document } = {}) {
  const body = doc.getElementById('apptBody');
  const filter = doc.getElementById('apptFilter');
  const summary = doc.getElementById('apptSummary');
  if (!body || !filter) return false;

  function render() {
    const status = filter.value;
    const rows = APPOINTMENTS.filter(
      (appointment) => status === 'All' || appointment.status === status,
    );

    body.innerHTML = rows.length
      ? rows
          .map(
            (appointment) => `<tr>
              <td class="text-muted text-nowrap">${escapeHtml(appointment.id)}</td>
              <td class="fw-semibold">${escapeHtml(appointment.patient)}</td>
              <td>${escapeHtml(appointment.doctor)}</td>
              <td>${escapeHtml(appointment.dept)}</td>
              <td class="text-nowrap">${escapeHtml(formatDate(appointment.date))}</td>
              <td class="text-nowrap">${escapeHtml(appointment.time)}</td>
              <td>${statusBadge(appointment.status)}</td>
            </tr>`,
          )
          .join('')
      : `<tr><td colspan="7" class="empty-state">No ${escapeHtml(
          status.toLowerCase(),
        )} appointments. Choose another status.</td></tr>`;

    if (summary) {
      summary.textContent = `Showing ${rows.length} of ${APPOINTMENTS.length} appointments`;
    }
  }

  filter.addEventListener('change', render);
  render();

  createDepartmentChart(doc.getElementById('deptChart'), APPOINTMENTS);
  return true;
}

if (typeof document !== 'undefined' && document.body?.dataset.page === 'appointments') {
  if (initShell()) initAppointmentsPage();
}
