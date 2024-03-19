import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],

    resolve: { alias: { '@': '/src' } },

    server: { host: true, port: 3090 },
  }
})
