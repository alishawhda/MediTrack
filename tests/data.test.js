import { describe, expect, it } from 'vitest';
import {
  APPOINTMENTS,
  DEFAULT_PATIENTS,
  STORAGE_KEYS,
  countBy,
  createPatient,
  escapeHtml,
  filterPatients,
  loadPatients,
  nextPatientId,
  savePatients,
  sortUpcoming,
  validatePatientInput,
} from '../src/js/data.js';
import { memoryStorage } from './helpers/memory-storage.js';

describe('countBy', () => {
  it('groups items and counts duplicates', () => {
    expect(countBy(DEFAULT_PATIENTS, 'status')).toEqual({
      Active: 7,
      Critical: 2,
      Discharged: 3,
    });
  });

  it('returns an empty object for an empty list', () => {
    expect(countBy([], 'status')).toEqual({});
  });
});

describe('escapeHtml', () => {
  it('neutralises every HTML-significant character', () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;',
    );
  });

  it('leaves ordinary text untouched', () => {
    expect(escapeHtml('Ahmad Faiz')).toBe('Ahmad Faiz');
  });
});

describe('filterPatients', () => {
  it('matches name, ID, condition and doctor case-insensitively', () => {
    expect(filterPatients(DEFAULT_PATIENTS, { query: 'cardiac' })).toHaveLength(2);
    expect(filterPatients(DEFAULT_PATIENTS, { query: 'p001' })).toHaveLength(1);
    expect(filterPatients(DEFAULT_PATIENTS, { query: 'mei ling' })).toHaveLength(4);
  });

  it('combines the status filter with the text query', () => {
    const rows = filterPatients(DEFAULT_PATIENTS, { query: '', status: 'Critical' });
    expect(rows.map((row) => row.id)).toEqual(['P003', 'P010']);
  });

  it('returns everything when the query is blank and status is All', () => {
    expect(filterPatients(DEFAULT_PATIENTS, { query: '  ', status: 'All' })).toHaveLength(12);
  });

  it('returns no rows when nothing matches', () => {
    expect(filterPatients(DEFAULT_PATIENTS, { query: 'zzzz' })).toEqual([]);
  });
});

describe('nextPatientId', () => {
  it('increments the highest numeric suffix', () => {
    expect(nextPatientId(DEFAULT_PATIENTS)).toBe('P013');
  });

  it('starts at P001 for an empty list', () => {
    expect(nextPatientId([])).toBe('P001');
  });

  it('ignores malformed identifiers', () => {
    expect(nextPatientId([{ id: 'X' }, { id: 'P007' }])).toBe('P008');
  });
});

describe('sortUpcoming', () => {
  it('keeps only scheduled appointments, soonest first', () => {
    const upcoming = sortUpcoming(APPOINTMENTS);
    expect(upcoming.every((appointment) => appointment.status === 'Scheduled')).toBe(true);
    expect(upcoming[0]).toMatchObject({ id: 'A101', date: '2026-11-09', time: '09:00' });
    expect(upcoming[1].id).toBe('A102');
  });

  it('respects the limit', () => {
    expect(sortUpcoming(APPOINTMENTS, 2)).toHaveLength(2);
  });

  it('does not mutate the source array', () => {
    const original = APPOINTMENTS.map((appointment) => appointment.id);
    sortUpcoming(APPOINTMENTS);
    expect(APPOINTMENTS.map((appointment) => appointment.id)).toEqual(original);
  });
});

describe('validatePatientInput', () => {
  it('accepts a complete, valid payload', () => {
    const result = validatePatientInput({
      name: 'Nur Aina',
      age: '8',
      gender: 'Female',
      condition: 'Asthma',
      doctor: 'Dr. Mei Ling',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.value.name).toBe('Nur Aina');
    expect(result.value.age).toBe(8);
  });

  it('rejects short names, out-of-range ages and unknown options', () => {
    const result = validatePatientInput({
      name: 'A',
      age: '121',
      gender: 'Other',
      condition: 'Unknown',
      doctor: 'Dr. Nobody',
    });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual([
      'age',
      'condition',
      'doctor',
      'gender',
      'name',
    ]);
  });

  it('rejects non-integer ages', () => {
    expect(
      validatePatientInput({
        name: 'Valid Name',
        age: '30.5',
        gender: 'Male',
        condition: 'Fever',
        doctor: 'Dr. Hafiz',
      }).errors.age,
    ).toBeDefined();
  });
});

describe('createPatient', () => {
  it('builds a record with the next ID, Active status and today’s visit date', () => {
    const result = createPatient(
      {
        name: '  Siti Aminah ',
        age: '33',
        gender: 'Female',
        condition: 'Fever',
        doctor: 'Dr. Hafiz',
      },
      DEFAULT_PATIENTS,
      new Date('2026-11-09T12:00:00Z'),
    );

    expect(result.ok).toBe(true);
    expect(result.patient).toEqual({
      id: 'P013',
      name: 'Siti Aminah',
      age: 33,
      gender: 'Female',
      condition: 'Fever',
      doctor: 'Dr. Hafiz',
      status: 'Active',
      lastVisit: '2026-11-09',
    });
  });

  it('returns errors instead of a record when invalid', () => {
    const result = createPatient({ name: '' }, DEFAULT_PATIENTS);
    expect(result.ok).toBe(false);
    expect(result.errors.name).toBeDefined();
  });
});

describe('persistence', () => {
  it('returns demo data when storage is empty', () => {
    expect(loadPatients(memoryStorage())).toHaveLength(12);
  });

  it('round-trips saved patients', () => {
    const storage = memoryStorage();
    const custom = [{ id: 'P001', name: 'Only Patient' }];
    expect(savePatients(custom, storage)).toBe(true);
    expect(loadPatients(storage)).toEqual(custom);
  });

  it('falls back to demo data when stored JSON is corrupt', () => {
    const storage = memoryStorage({ [STORAGE_KEYS.patients]: '{not json' });
    expect(loadPatients(storage)).toHaveLength(12);
  });

  it('drops malformed records instead of crashing the page', () => {
    const storage = memoryStorage({
      [STORAGE_KEYS.patients]: JSON.stringify([{ id: 'P001', name: 'Good' }, null, { id: 3 }]),
    });
    expect(loadPatients(storage)).toEqual([{ id: 'P001', name: 'Good' }]);
  });

  it('reports failure when storage throws (quota or private mode)', () => {
    const storage = {
      getItem() {
        throw new Error('denied');
      },
      setItem() {
        throw new Error('quota');
      },
    };
    expect(loadPatients(storage)).toHaveLength(12);
    expect(savePatients([], storage)).toBe(false);
  });

  it('returns a fresh copy so callers cannot mutate the fixture', () => {
    const first = loadPatients(memoryStorage());
    first[0].name = 'Changed';
    expect(DEFAULT_PATIENTS[0].name).not.toBe('Changed');
  });
});
