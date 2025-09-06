import { defineConfig } from 'vite'    // ต้อง import defineConfig
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // ให้ Vite ฟังทุก interface
    port: 5173
  }
})
