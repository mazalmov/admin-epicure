import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', 
    'process.env': process.env,
  },
})




