import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // VITE_BASE_URL overrides the default. Falls back to /kanade-website/ in CI/prod builds
  // so GitHub Pages asset paths resolve correctly. Set VITE_BASE_URL=/ for local previews
  // against a custom domain or a non-root deploy path.
  base: process.env.VITE_BASE_URL ?? (process.env.NODE_ENV === 'production' ? '/kanade-website/' : '/'),
})
