import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: '**/*.js', // 👈 ensures .js files with JSX are processed
    }),
  ],
  server: {
    port: 8080,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
