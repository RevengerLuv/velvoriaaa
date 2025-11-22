import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  // ADD THESE LINES FOR PRODUCTION:
  base: '/',
  build: {
    outDir: 'dist',
  },
  // This is crucial for SPA routing
  preview: {
    host: true,
    port: 4173
  }
})
