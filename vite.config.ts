import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://94.182.92.104:9092',
        target: 'http://localhost:9092',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // برای درخواست‌های POST هدرها را اضافه می‌کند
            if (proxyReq.method === 'POST') {
              proxyReq.setHeader('Content-Type', 'application/json')
              proxyReq.setHeader('Accept', 'application/json')
            }
          })
        }
      },
      '/rest': {
        // target: 'http://94.182.92.104:9092',
        target: 'http://localhost:9092',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // برای درخواست‌های POST هدرها را اضافه می‌کند
            if (proxyReq.method === 'POST') {
              proxyReq.setHeader('Content-Type', 'application/json')
              proxyReq.setHeader('Accept', 'application/json')
            }
          })
        }
      },
    }
  },
});
