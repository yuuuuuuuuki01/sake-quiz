import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base はリポジトリ名に合わせて変更してください（GitHub Pages用）
export default defineConfig({
  plugins: [react()],
  base: '/sake-quiz/',
})
