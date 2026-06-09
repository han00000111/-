import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署路径使用项目名称，Vercel 部署在根路径。
  base: process.env.VERCEL ? '/' : '/机器人综合管理平台/',
})
