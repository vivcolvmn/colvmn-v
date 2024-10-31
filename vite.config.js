import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client', // Set the root if your project structure requires it
  plugins: [react()],
  build: {
    outDir: 'dist', // Specify output directory
  },
});
