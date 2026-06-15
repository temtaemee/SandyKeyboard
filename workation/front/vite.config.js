// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 💡 ESM 환경에서 __dirname을 안전하게 가져오는 코드 추가
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // ❌ const appRoot = process.cwd(); <-- 터미널 위치에 따라 변하므로 삭제/주석 처리

  // ⭕ 현재 vite.config.js 파일 위치 기준으로 무조건 고정
  const appRoot = __dirname;

  // front(현재) -> workation(..) -> final(..) 총 두 단계 위로 고정
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
    // 🚨 Vite에게 .env를 읽을 위치를 정확히 고정해 줍니다.
    envDir: workspaceRoot,

    server: {
      proxy: {
        '/api': { target: devProxyTarget, changeOrigin: true },
        '/ws-connect': { target: devProxyTarget, ws: true, changeOrigin: true },
      },
    },
  };
});