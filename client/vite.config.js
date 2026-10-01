import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    // 5173 for Vite dev — the Express API server owns port 3000 (see .env)
    port: 5173,
    allowedHosts: true,
    proxy: {
      // In dev, the browser talks to Vite; /api is forwarded to the Express backend.
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      }
    }
  }
})
