import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo (npm run dev) reenviamos /api/* a los microservicios locales,
    // igual que hace Nginx en producción. Así el frontend usa siempre rutas relativas.
    proxy: {
      '/api/auth': 'http://localhost:8000',
      '/api/academic': 'http://localhost:8001',
      '/api/feedback': 'http://localhost:8002',
    },
  },
})
