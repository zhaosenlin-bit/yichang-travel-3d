import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/yichang-travel-3d/',
  build: { target: 'es2020', sourcemap: false, chunkSizeWarningLimit: 1500 },
  server: { port: 5174, host: true }
});
