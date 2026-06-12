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
  const kakaoJsKey =
    env.VITE_KAKAO_JS_KEY ||
    env.VITE_KAKAO_REST_API_KEY ||
    '6347acb399740f49699040d1f8cf61e5';

  return {
    plugins: [
      {
        name: 'kakao-js-key-fallback',
        enforce: 'pre',
        transformIndexHtml(html) {
          return html.replace(/%VITE_KAKAO_JS_KEY%/g, kakaoJsKey);
        },
      },
      react(),
    ],
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
