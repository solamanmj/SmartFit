import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  optimizeDeps: {
    entries: [path.resolve(__dirname, 'index.html')],
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  },
  server: {
    host: true,
    port: 5173
  }
});

