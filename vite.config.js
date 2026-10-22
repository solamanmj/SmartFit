import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    entries: ['index.html'],
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  },
  server: {
    host: true,
    port: 5173
  }
});

