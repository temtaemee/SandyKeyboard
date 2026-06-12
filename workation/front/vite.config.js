import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const appRoot = process.cwd();
  const workspaceRoot = resolve(appRoot, '../..');
  const env = {
    ...loadEnv(mode, workspaceRoot, ''),
    ...loadEnv(mode, appRoot, ''),
  };
  const devProxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:8001';

  return {
    plugins: [react()],
    envDir: workspaceRoot,
    server: {
      proxy: {
        '/api': {
          target: devProxyTarget,
          changeOrigin: true,
        },
        '/ws-connect': {
          target: devProxyTarget,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
});
