import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 部署於 https://<user>.github.io/konvajs_fabricjs_reactdnd_DEMO/
// 本機開發走 '/'，CI 走子路徑（GITHUB_PAGES=1）
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isPages = env.GITHUB_PAGES === '1';
  return {
    base: isPages ? '/konvajs_fabricjs_reactdnd_DEMO/' : '/',
    plugins: [react()],
    server: { port: 5173, open: true },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500
    }
  };
});
