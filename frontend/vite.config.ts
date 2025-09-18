import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true, // Permite acceso desde el exterior para Playwright
    strictPort: true, // Falla si el puerto está ocupado
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: true,
  },
  build: {
    sourcemap: true, // Útil para debugging en tests
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Evita problemas con chunks en testing
      },
    },
  },
  // Configuraciones específicas para testing
  define: {
    // Asegura que process.env esté disponible en el browser
    'process.env': process.env,
  },
  // Optimización para desarrollo con tests y pnpm
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
      'lucide-react',
      'tailwind-merge',
      'clsx',
      'use-debounce',
    ],
    // Force pre-bundling para evitar problemas con pnpm
    force: true,
  },
});
