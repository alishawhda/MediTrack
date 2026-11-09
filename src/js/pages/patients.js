/* Patients page controller: search, filter, add and reset. */
import { initShell } from '../shell.js';
import {
  DEFAULT_PATIENTS,
  escapeHtml,
  filterPatients,
  createPatient,
  loadPatients,
  savePatients,
} from '../data.js';
import { showToast, statusBadge } from '../ui.js';

function defaultCloseModal(doc) {
  // Bootstrap's data API closes the dialog when its dismiss button is clicked.
  doc.querySelector('#addModal [data-bs-dismiss="modal"]')?.click();
}

export function initPatientsPage({
  doc = document,
  storage,
  notify = (message, tone) => showToast(message, { doc, tone }),
  closeModal = () => defaultCloseModal(doc),
} = {}) {
  let patients = loadPatients(storage);

  const body = doc.getElementById('patientBody');
  const search = doc.getElementById('search');
  const filter = doc.getElementById('statusFilter');
  const count = doc.getElementById('count');
  const form = doc.getElementById('addForm');
  const errorBox = doc.getElementById('addError');
  const field = (name) => form?.querySelector(`[name="${name}"]`);

  if (!body || !search || !filter || !form) return false;

  function render() {
    const rows = filterPatients(patients, { query: search.value, status: filter.value });

    body.innerHTML = rows.length
      ? rows
          .map(
            (patient) => `<tr>
              <td class="text-muted text-nowrap">${escapeHtml(patient.id)}</td>
              <td class="fw-semibold">${escapeHtml(patient.name)}</td>
              <td>${escapeHtml(patient.age)}</td>
              <td>${escapeHtml(patient.gender)}</td>
              <td>${escapeHtml(patient.condition)}</td>
              <td>${escapeHtml(patient.doctor)}</td>
              <td class="text-nowrap">${escapeHtml(patient.lastVisit)}</td>
              <td>${statusBadge(patient.status)}</td>
            </tr>`,
          )
          .join('')
      : `<tr><td colspan="8" class="empty-state">
            No patients match this search. Try another name, ID or condition.
          </td></tr>`;

    if (count) {
      count.textContent = `Showing ${rows.length} of ${patients.length} patients`;
    }
  }

  function clearFieldErrors() {
    form.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.add('d-none');
    }
  }

  function showFieldErrors(errors) {
    if (!errorBox) return;
    errorBox.textContent = Object.values(errors).join(' ');
    errorBox.classList.remove('d-none');
    const map = {
      name: 'pname',
      age: 'page',
      gender: 'pgender',
      condition: 'pcondition',
      doctor: 'pdoctor',
    };
    Object.keys(errors).forEach((key) => {
      const field = form.querySelector(`#${map[key]}`);
      field?.classList.add('is-invalid');
      field?.setAttribute('aria-describedby', 'addError');
    });
  }

  search.addEventListener('input', render);
  filter.addEventListener('change', render);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearFieldErrors();

    const result = createPatient(
      {
        name: field('pname').value,
        age: field('page').value,
        gender: field('pgender').value,
        condition: field('pcondition').value,
        doctor: field('pdoctor').value,
      },
      patients,
    );

    if (!result.ok) {
      showFieldErrors(result.errors);
      field('pname').focus();
      return;
    }

    patients = [...patients, result.patient];
    const persisted = savePatients(patients, storage);

    form.reset();
    closeModal();
    render();
    notify(
      persisted
        ? `${result.patient.name} added as ${result.patient.id}.`
        : `${result.patient.name} added for this session — browser storage is unavailable.`,
      persisted ? 'success' : 'warning',
    );
    search.value = '';
    filter.value = 'All';
    render();
  });

  doc.getElementById('resetData')?.addEventListener('click', () => {
    patients = DEFAULT_PATIENTS.map((patient) => ({ ...patient }));
    const persisted = savePatients(patients, storage);
    search.value = '';
    filter.value = 'All';
    render();
    notify(
      persisted ? 'Demo data restored.' : 'Demo data restored for this session only.',
      persisted ? 'success' : 'warning',
    );
  });

  render();

  return true;
}

if (typeof document !== 'undefined' && document.body?.dataset.page === 'patients') {
  if (initShell()) initPatientsPage();
}
