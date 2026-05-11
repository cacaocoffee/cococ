import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['@tanstack/react-router', '@tanstack/react-query'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          markdown: ['react-markdown'],
        },
      },
    },
  },

  // ──────────────────────────────────────────────────────────
  // 개발 서버 프록시 설정
  // ──────────────────────────────────────────────────────────
  // 프론트엔드(5173포트)에서 /api 로 시작하는 요청을
  // 자동으로 백엔드(4000포트)로 전달해줍니다.
  // 이렇게 하면 CORS 문제 없이 개발할 수 있습니다.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
