import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
// base はリポジトリ名に合わせて変更してください（GitHub Pages用）
export default defineConfig({
  plugins: [react()],
  base: '/sake-quiz/',
  resolve: {
    alias: {
      '@guide-data': path.resolve(__dirname, '../sake-guide-script/src/data'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
