import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader:'jsx'
  },
  server: {
    proxy: {
      "/api/events": {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  },
})
