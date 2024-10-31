import { defineConfig } from 'vite';

export default defineConfig({
  root: 'client', // Sets client as the root directory for Vite
  build: {
    outDir: 'dist', // Puts the built files into client/dist
  },
});
