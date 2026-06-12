const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

export const API_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL) || '/api';

// 💡 헷갈리지 않게 배포 환경의 프로토콜과 상관없이 무조건 https 주소로 고정합니다.
const S3_BUCKET_FALLBACK =
  'https://finalproject-s3-bucket-243050855199-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com';

// 💡 VITE_SERVER_BASE_URL 환경 변수가 완전히 비어있거나 공백일 때 무조건 S3로 고정되도록 강제 처리를 더 공고히 합니다.
const rawEnvUrl = import.meta.env.VITE_SERVER_BASE_URL;
export const SERVER_BASE_URL =
  rawEnvUrl && rawEnvUrl.trim() !== ''
    ? trimTrailingSlash(rawEnvUrl)
    : S3_BUCKET_FALLBACK;

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws-connect`;

export const S3_ASSET_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_S3_ASSET_BASE_URL) || '';

export const resolveAssetUrl = (path) => {
  if (!path) return null;

  if (typeof path === 'string' && path.includes('api.sandykey.shop')) {
    return path.replace(
      /^https?:\/\/api\.sandykey\.shop\/?/,
      `${SERVER_BASE_URL}/`
    );
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${SERVER_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const resolveS3AssetUrl = (keyOrUrl) => {
  if (!keyOrUrl) return null;
  if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://'))
    return keyOrUrl;
  return S3_ASSET_BASE_URL
    ? `${S3_ASSET_BASE_URL}/${keyOrUrl.replace(/^\/+/, '')}`
    : resolveAssetUrl(keyOrUrl);
};
