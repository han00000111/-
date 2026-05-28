import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署在 /-/ 路径，Vercel 部署在根路径；不要改成固定 base。
  base: process.env.VERCEL ? '/' : '/-/',
})
