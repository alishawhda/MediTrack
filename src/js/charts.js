/* Chart.js setup. Only the controllers MediTrack uses are registered. */
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { countBy } from './data.js';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip,
);

const PALETTE = ['#0E6E73', '#F2A33A', '#12313A', '#6BB8B0', '#C0392B', '#9FB8B5'];

const BASE_OPTIONS = Object.freeze({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
  },
});

function safeChart(canvas, config, label) {
  if (!canvas) return null;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', label);
  return new Chart(canvas, config);
}

/** Patients grouped by condition. */
export function createConditionChart(canvas, patients) {
  const grouped = countBy(patients, 'condition');
  return safeChart(
    canvas,
    {
      type: 'doughnut',
      data: {
        labels: Object.keys(grouped),
        datasets: [{ data: Object.values(grouped), backgroundColor: PALETTE, borderWidth: 0 }],
      },
      options: { ...BASE_OPTIONS, cutout: '62%' },
    },
    `Patients by condition: ${Object.entries(grouped)
      .map(([name, total]) => `${name} ${total}`)
      .join(', ')}`,
  );
}

/** Patients grouped by status. */
export function createStatusChart(canvas, patients) {
  const grouped = countBy(patients, 'status');
  return safeChart(
    canvas,
    {
      type: 'bar',
      data: {
        labels: Object.keys(grouped),
        datasets: [{ label: 'Patients', data: Object.values(grouped), backgroundColor: PALETTE }],
      },
      options: {
        ...BASE_OPTIONS,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    },
    `Patients by status: ${Object.entries(grouped)
      .map(([name, total]) => `${name} ${total}`)
      .join(', ')}`,
  );
}

/** Appointments grouped by department. */
export function createDepartmentChart(canvas, appointments) {
  const grouped = countBy(appointments, 'dept');
  return safeChart(
    canvas,
    {
      type: 'bar',
      data: {
        labels: Object.keys(grouped),
        datasets: [
          { label: 'Appointments', data: Object.values(grouped), backgroundColor: PALETTE[0] },
        ],
      },
      options: {
        ...BASE_OPTIONS,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    },
    `Appointments by department: ${Object.entries(grouped)
      .map(([name, total]) => `${name} ${total}`)
      .join(', ')}`,
  );
}
