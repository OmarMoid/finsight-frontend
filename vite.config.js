import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The project's .env lives one level up, alongside backend/ — without this
  // Vite only looks in frontend/ and silently falls back to code defaults.
  envDir: '..',
  server: {
    port: 3000,
    // Bind all interfaces so the dev server is reachable from the iPhone.
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
