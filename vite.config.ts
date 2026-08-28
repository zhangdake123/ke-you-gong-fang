import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // 使用相对路径，打包后可直接打开或用任意静态服务器托管
})
