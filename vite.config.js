import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE is injected by GitHub Actions via actions/configure-pages.
// It equals the Pages base path, e.g. '/ridoy-beverage/'.
// Locally it is undefined so we default to '/'.
const rawBase = process.env.VITE_BASE || '/'
const base    = rawBase.endsWith('/') ? rawBase : rawBase + '/'

export default defineConfig({
  plugins: [react()],
  base,
})
