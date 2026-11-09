import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = import.meta.dirname;

export default defineConfig({
  // Relative base keeps the build portable on GitHub Pages project sites.
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        login: resolve(root, 'index.html'),
        dashboard: resolve(root, 'dashboard.html'),
        patients: resolve(root, 'patients.html'),
        appointments: resolve(root, 'appointments.html'),
      },
    },
  },
});
