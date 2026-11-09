// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

// The page module pulls in the shell for navigation chrome; the tests only
// exercise the table/form logic, so Bootstrap's DOM plugins are not needed.
vi.mock('bootstrap', () => ({}));

import { initPatientsPage } from '../src/js/pages/patients.js';
import { DOCTORS, STORAGE_KEYS } from '../src/js/data.js';
import { memoryStorage } from './helpers/memory-storage.js';

function pageMarkup() {
  const doctorOptions = DOCTORS.map((doctor) => `<option>${doctor}</option>`).join('');
  return `
    <input id="search" />
    <select id="statusFilter">
      <option value="All">All statuses</option>
      <option>Active</option>
      <option>Critical</option>
      <option>Discharged</option>
    </select>
    <button id="resetData" type="button">Reset</button>
    <p id="count"></p>
    <table><tbody id="patientBody"></tbody></table>
    <div id="addError" class="alert alert-danger d-none" role="alert"></div>
    <form id="addForm">
      <input id="pname" name="pname" />
      <input id="page" name="page" />
      <select id="pgender" name="pgender">
        <option value="">Choose…</option>
        <option>Female</option>
        <option>Male</option>
      </select>
      <select id="pcondition" name="pcondition">
        <option value="">Choose…</option>
        <option>Asthma</option>
        <option>Cardiac</option>
        <option>Diabetes</option>
        <option>Fever</option>
        <option>Fracture</option>
        <option>Hypertension</option>
      </select>
      <select id="pdoctor" name="pdoctor">
        <option value="">Choose…</option>
        ${doctorOptions}
      </select>
    </form>
  `;
}

function setup() {
  document.body.innerHTML = pageMarkup();
  const storage = memoryStorage();
  const notify = vi.fn();
  const closeModal = vi.fn();
  const started = initPatientsPage({ doc: document, storage, notify, closeModal });

  return {
    started,
    storage,
    notify,
    closeModal,
    body: document.getElementById('patientBody'),
    search: document.getElementById('search'),
    filter: document.getElementById('statusFilter'),
    count: document.getElementById('count'),
    error: document.getElementById('addError'),
    form: document.getElementById('addForm'),
    reset: document.getElementById('resetData'),
  };
}

function fillValidForm(form, overrides = {}) {
  form.querySelector('[name="pname"]').value = overrides.name ?? 'Siti Aminah';
  form.querySelector('[name="page"]').value = overrides.age ?? '33';
  form.querySelector('[name="pgender"]').value = overrides.gender ?? 'Female';
  form.querySelector('[name="pcondition"]').value = overrides.condition ?? 'Fever';
  form.querySelector('[name="pdoctor"]').value = overrides.doctor ?? 'Dr. Hafiz';
}

function submit(form) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('patients page', () => {
  it('initially renders every demo patient', () => {
    const { started, body, count } = setup();
    expect(started).toBe(true);
    expect(body.querySelectorAll('tr')).toHaveLength(12);
    expect(count.textContent).toBe('Showing 12 of 12 patients');
  });

  it('filters live as the visitor types', () => {
    const { body, search } = setup();

    search.value = 'cardiac';
    search.dispatchEvent(new Event('input', { bubbles: true }));

    expect(body.querySelectorAll('tr')).toHaveLength(2);
    expect(body.textContent).toContain('Tan Wei Ming');
    expect(body.textContent).toContain('Zulaikha Rahman');
  });

  it('shows a helpful empty state instead of a blank table', () => {
    const { body, search } = setup();

    search.value = 'nobody';
    search.dispatchEvent(new Event('input', { bubbles: true }));

    expect(body.querySelectorAll('tr')).toHaveLength(1);
    expect(body.textContent).toMatch(/No patients match this search/i);
  });

  it('filters by status', () => {
    const { body, filter } = setup();

    filter.value = 'Critical';
    filter.dispatchEvent(new Event('change', { bubbles: true }));

    expect(body.querySelectorAll('tr')).toHaveLength(2);
  });

  it('adds a valid patient, persists it and closes the modal', () => {
    const { form, storage, notify, closeModal, body } = setup();
    fillValidForm(form);

    submit(form);

    expect(closeModal).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith('Siti Aminah added as P013.', 'success');
    expect(body.querySelectorAll('tr')).toHaveLength(13);
    expect(body.textContent).toContain('Siti Aminah');

    const stored = JSON.parse(storage.getItem(STORAGE_KEYS.patients));
    expect(stored).toHaveLength(13);
    expect(stored.at(-1)).toMatchObject({ id: 'P013', name: 'Siti Aminah', status: 'Active' });
  });

  it('rejects an invalid patient with field-level feedback', () => {
    const { form, storage, error, body, closeModal } = setup();
    fillValidForm(form, { name: 'A', age: '200', gender: '' });

    submit(form);

    expect(error.classList.contains('d-none')).toBe(false);
    expect(error.textContent).toMatch(/full name/i);
    expect(error.textContent).toMatch(/age between 0 and 120/i);
    expect(document.getElementById('pname').classList.contains('is-invalid')).toBe(true);
    expect(closeModal).not.toHaveBeenCalled();
    expect(body.querySelectorAll('tr')).toHaveLength(12);
    expect(storage.getItem(STORAGE_KEYS.patients)).toBeNull();
  });

  it('restores the demo data and clears filters', () => {
    const { form, reset, body, search, filter, notify } = setup();
    fillValidForm(form);
    submit(form);
    expect(body.querySelectorAll('tr')).toHaveLength(13);

    search.value = 'zzz';
    filter.value = 'Critical';
    reset.click();

    expect(search.value).toBe('');
    expect(filter.value).toBe('All');
    expect(body.querySelectorAll('tr')).toHaveLength(12);
    expect(notify).toHaveBeenLastCalledWith('Demo data restored.', 'success');
  });

  it('warns when browser storage refuses the write', () => {
    document.body.innerHTML = pageMarkup();
    const hostile = {
      getItem() {
        return null;
      },
      setItem() {
        throw new Error('quota');
      },
    };
    const notify = vi.fn();
    initPatientsPage({ doc: document, storage: hostile, notify, closeModal: vi.fn() });

    const form = document.getElementById('addForm');
    fillValidForm(form);
    submit(form);

    expect(notify).toHaveBeenCalledWith(expect.stringMatching(/this session/), 'warning');
    expect(document.querySelectorAll('#patientBody tr')).toHaveLength(13);
  });
});
