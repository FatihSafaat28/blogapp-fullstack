import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  envDir: '../',
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
