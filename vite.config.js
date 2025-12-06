import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['three'],
  },
  optimizeDeps: {
    include: ['three'],
    exclude: [],
  },
  server: {
    proxy: {
      '/api/news': {
        target: 'https://newsapi.org/v2/everything',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/news/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // API 키를 쿼리 파라미터에 추가
            const apiKey = process.env.VITE_NEWS_API_KEY
            if (!apiKey) {
              console.warn('News API 키가 설정되지 않았습니다. .env 파일에 VITE_NEWS_API_KEY를 설정해주세요.')
              return
            }
            const separator = proxyReq.path.includes('?') ? '&' : '?'
            proxyReq.path += `${separator}apiKey=${apiKey}`
          })
        }
      }
    }
  }
})

