/* Dashboard page controller. */
import { initShell } from '../shell.js';
import { APPOINTMENTS, escapeHtml, loadPatients, sortUpcoming } from '../data.js';
import { createConditionChart, createStatusChart } from '../charts.js';
import { formatDate } from '../ui.js';

export function initDashboardPage({ doc = document, storage } = {}) {
  const patients = loadPatients(storage);

  const setText = (id, value) => {
    const node = doc.getElementById(id);
    if (node) node.textContent = String(value);
  };

  setText('statTotal', patients.length);
  setText('statActive', patients.filter((patient) => patient.status === 'Active').length);
  setText('statCritical', patients.filter((patient) => patient.status === 'Critical').length);
  setText(
    'statUpcoming',
    APPOINTMENTS.filter((appointment) => appointment.status === 'Scheduled').length,
  );

  createConditionChart(doc.getElementById('condChart'), patients);
  createStatusChart(doc.getElementById('statusChart'), patients);

  const body = doc.getElementById('upcomingBody');
  if (body) {
    const upcoming = sortUpcoming(APPOINTMENTS);
    body.innerHTML = upcoming.length
      ? upcoming
          .map(
            (appointment) => `<tr>
              <td>${escapeHtml(appointment.patient)}</td>
              <td>${escapeHtml(appointment.doctor)}</td>
              <td class="text-nowrap">${escapeHtml(formatDate(appointment.date))} <span class="text-muted">${escapeHtml(appointment.time)}</span></td>
              <td>${escapeHtml(appointment.dept)}</td>
            </tr>`,
          )
          .join('')
      : '<tr><td colspan="4" class="text-center text-muted py-4">No upcoming appointments.</td></tr>';
  }

  return true;
}

if (typeof document !== 'undefined' && document.body?.dataset.page === 'dashboard') {
  if (initShell()) initDashboardPage();
}
