/**
 * MediTrack domain data and pure helpers.
 *
 * This module deliberately has no DOM dependencies so every function can be
 * unit-tested in Node. Anything that touches the browser is injectable.
 */

export const STORAGE_KEYS = Object.freeze({
  patients: 'mt_patients',
  user: 'mt_user',
});

export const PATIENT_STATUSES = Object.freeze(['Active', 'Critical', 'Discharged']);
export const CONDITIONS = Object.freeze([
  'Hypertension',
  'Diabetes',
  'Asthma',
  'Fracture',
  'Fever',
  'Cardiac',
]);
export const GENDERS = Object.freeze(['Female', 'Male']);
export const DOCTORS = Object.freeze(['Dr. Aisyah', 'Dr. Hafiz', 'Dr. Mei Ling']);
export const DEPARTMENTS = Object.freeze(['Cardiology', 'General', 'Respiratory', 'Orthopaedics']);
export const APPOINTMENT_STATUSES = Object.freeze(['Scheduled', 'Completed', 'Cancelled']);

export const DEFAULT_PATIENTS = Object.freeze(
  [
    {
      id: 'P001',
      name: 'Ahmad Faiz',
      age: 45,
      gender: 'Male',
      condition: 'Hypertension',
      doctor: 'Dr. Aisyah',
      status: 'Active',
      lastVisit: '2026-10-28',
    },
    {
      id: 'P002',
      name: 'Siti Nurhaliza',
      age: 34,
      gender: 'Female',
      condition: 'Diabetes',
      doctor: 'Dr. Hafiz',
      status: 'Active',
      lastVisit: '2026-10-30',
    },
    {
      id: 'P003',
      name: 'Tan Wei Ming',
      age: 52,
      gender: 'Male',
      condition: 'Cardiac',
      doctor: 'Dr. Aisyah',
      status: 'Critical',
      lastVisit: '2026-11-05',
    },
    {
      id: 'P004',
      name: 'Nur Aina',
      age: 8,
      gender: 'Female',
      condition: 'Asthma',
      doctor: 'Dr. Mei Ling',
      status: 'Active',
      lastVisit: '2026-11-01',
    },
    {
      id: 'P005',
      name: 'Raj Kumar',
      age: 61,
      gender: 'Male',
      condition: 'Diabetes',
      doctor: 'Dr. Hafiz',
      status: 'Active',
      lastVisit: '2026-10-22',
    },
    {
      id: 'P006',
      name: 'Lim Mei Fong',
      age: 29,
      gender: 'Female',
      condition: 'Fracture',
      doctor: 'Dr. Mei Ling',
      status: 'Discharged',
      lastVisit: '2026-10-12',
    },
    {
      id: 'P007',
      name: 'Hafizuddin Omar',
      age: 40,
      gender: 'Male',
      condition: 'Fever',
      doctor: 'Dr. Hafiz',
      status: 'Discharged',
      lastVisit: '2026-10-18',
    },
    {
      id: 'P008',
      name: 'Aminah Yusof',
      age: 67,
      gender: 'Female',
      condition: 'Hypertension',
      doctor: 'Dr. Aisyah',
      status: 'Active',
      lastVisit: '2026-11-03',
    },
    {
      id: 'P009',
      name: 'Kevin Lee',
      age: 35,
      gender: 'Male',
      condition: 'Asthma',
      doctor: 'Dr. Mei Ling',
      status: 'Active',
      lastVisit: '2026-11-04',
    },
    {
      id: 'P010',
      name: 'Zulaikha Rahman',
      age: 58,
      gender: 'Female',
      condition: 'Cardiac',
      doctor: 'Dr. Aisyah',
      status: 'Critical',
      lastVisit: '2026-11-06',
    },
    {
      id: 'P011',
      name: 'Daniel Wong',
      age: 23,
      gender: 'Male',
      condition: 'Fracture',
      doctor: 'Dr. Mei Ling',
      status: 'Active',
      lastVisit: '2026-11-02',
    },
    {
      id: 'P012',
      name: 'Farah Diyana',
      age: 31,
      gender: 'Female',
      condition: 'Fever',
      doctor: 'Dr. Hafiz',
      status: 'Discharged',
      lastVisit: '2026-10-25',
    },
  ].map(Object.freeze),
);

export const APPOINTMENTS = Object.freeze(
  [
    {
      id: 'A101',
      patient: 'Ahmad Faiz',
      doctor: 'Dr. Aisyah',
      dept: 'Cardiology',
      date: '2026-11-09',
      time: '09:00',
      status: 'Scheduled',
    },
    {
      id: 'A102',
      patient: 'Siti Nurhaliza',
      doctor: 'Dr. Hafiz',
      dept: 'General',
      date: '2026-11-09',
      time: '10:30',
      status: 'Scheduled',
    },
    {
      id: 'A103',
      patient: 'Tan Wei Ming',
      doctor: 'Dr. Aisyah',
      dept: 'Cardiology',
      date: '2026-11-08',
      time: '08:30',
      status: 'Completed',
    },
    {
      id: 'A104',
      patient: 'Nur Aina',
      doctor: 'Dr. Mei Ling',
      dept: 'Respiratory',
      date: '2026-11-10',
      time: '11:00',
      status: 'Scheduled',
    },
    {
      id: 'A105',
      patient: 'Raj Kumar',
      doctor: 'Dr. Hafiz',
      dept: 'General',
      date: '2026-11-07',
      time: '14:00',
      status: 'Completed',
    },
    {
      id: 'A106',
      patient: 'Lim Mei Fong',
      doctor: 'Dr. Mei Ling',
      dept: 'Orthopaedics',
      date: '2026-11-06',
      time: '15:30',
      status: 'Cancelled',
    },
    {
      id: 'A107',
      patient: 'Aminah Yusof',
      doctor: 'Dr. Aisyah',
      dept: 'Cardiology',
      date: '2026-11-11',
      time: '09:30',
      status: 'Scheduled',
    },
    {
      id: 'A108',
      patient: 'Kevin Lee',
      doctor: 'Dr. Mei Ling',
      dept: 'Respiratory',
      date: '2026-11-12',
      time: '13:00',
      status: 'Scheduled',
    },
    {
      id: 'A109',
      patient: 'Daniel Wong',
      doctor: 'Dr. Mei Ling',
      dept: 'Orthopaedics',
      date: '2026-11-10',
      time: '16:00',
      status: 'Scheduled',
    },
    {
      id: 'A110',
      patient: 'Zulaikha Rahman',
      doctor: 'Dr. Aisyah',
      dept: 'Cardiology',
      date: '2026-11-08',
      time: '10:00',
      status: 'Completed',
    },
  ].map(Object.freeze),
);

/** Escape a value for safe interpolation into HTML. */
export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );
}

/** Count occurrences of `key` across a list. */
export function countBy(list, key) {
  return list.reduce((result, item) => {
    const value = item[key];
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}

function browserStorage() {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function cloneDefaults() {
  return DEFAULT_PATIENTS.map((patient) => ({ ...patient }));
}

function isPatientLike(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  );
}

/**
 * Read patients from storage, falling back to the bundled demo data when the
 * store is empty, unreadable or contains junk.
 */
export function loadPatients(storage = browserStorage()) {
  try {
    const raw = storage?.getItem(STORAGE_KEYS.patients);
    if (!raw) return cloneDefaults();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return cloneDefaults();
    return parsed.filter(isPatientLike).map((patient) => ({ ...patient }));
  } catch {
    return cloneDefaults();
  }
}

/** Persist patients. Returns false when storage is unavailable or full. */
export function savePatients(list, storage = browserStorage()) {
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEYS.patients, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** Case-insensitive search across name, ID and condition, plus a status filter. */
export function filterPatients(list, { query = '', status = 'All' } = {}) {
  const needle = String(query).trim().toLowerCase();
  return list.filter((patient) => {
    const matchesStatus = status === 'All' || patient.status === status;
    if (!matchesStatus) return false;
    if (!needle) return true;
    return [patient.name, patient.id, patient.condition, patient.doctor]
      .join(' ')
      .toLowerCase()
      .includes(needle);
  });
}

/** Compute the next P### identifier without colliding with existing rows. */
export function nextPatientId(list) {
  const highest = list.reduce((max, patient) => {
    const numeric = Number.parseInt(String(patient.id).replace(/^P/i, ''), 10);
    return Number.isFinite(numeric) && numeric > max ? numeric : max;
  }, 0);
  return `P${String(highest + 1).padStart(3, '0')}`;
}

/** Upcoming appointments, soonest first. */
export function sortUpcoming(appointments, limit = 5) {
  return appointments
    .filter((appointment) => appointment.status === 'Scheduled')
    .slice()
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, limit);
}

/** Validate a "add patient" form payload. */
export function validatePatientInput(input = {}) {
  const errors = {};
  const name = String(input.name ?? '').trim();
  const age = Number(input.age);
  const gender = String(input.gender ?? '');
  const condition = String(input.condition ?? '');
  const doctor = String(input.doctor ?? '');

  if (name.length < 2) {
    errors.name = 'Enter the patient’s full name (at least 2 characters).';
  } else if (name.length > 80) {
    errors.name = 'Name must be 80 characters or fewer.';
  }
  if (!Number.isInteger(age) || age < 0 || age > 120) {
    errors.age = 'Enter an age between 0 and 120.';
  }
  if (!GENDERS.includes(gender)) errors.gender = 'Choose a gender.';
  if (!CONDITIONS.includes(condition)) errors.condition = 'Choose a condition.';
  if (!DOCTORS.includes(doctor)) errors.doctor = 'Choose a doctor.';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: { name, age, gender, condition, doctor },
  };
}

/** Build a new patient record or return validation errors. */
export function createPatient(input, existingPatients, today = new Date()) {
  const { valid, errors, value } = validatePatientInput(input);
  if (!valid) return { ok: false, errors };

  return {
    ok: true,
    patient: {
      id: nextPatientId(existingPatients),
      name: value.name,
      age: value.age,
      gender: value.gender,
      condition: value.condition,
      doctor: value.doctor,
      status: 'Active',
      lastVisit: today.toISOString().slice(0, 10),
    },
  };
}
