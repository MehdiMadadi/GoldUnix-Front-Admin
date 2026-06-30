import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// const apiBaseUrl = 'http://94.182.92.104:9092';
const apiBaseUrl = 'http://localhost:9092';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: apiBaseUrl,
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
        target: apiBaseUrl,
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
