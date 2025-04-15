import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Disable source maps in production build
  },
  server: {
    sourcemap: false, // Disable source maps in development
  }
});
