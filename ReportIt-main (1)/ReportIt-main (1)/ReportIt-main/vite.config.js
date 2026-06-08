import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: '/',
    proxy: {
      "/api/auth": {
        target: "http://127.0.0.1:8081",
        changeOrigin: true,
      },
      "/api": {
        target: "http://127.0.0.1:8082",
        changeOrigin: true,
      },
    },
  },
})
