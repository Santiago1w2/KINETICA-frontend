import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://44.214.92.196:8080',
      '/oauth2': 'http://44.214.92.196:8080',
      '/login': 'http://44.214.92.196:8080',
    }
  }
})
