const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

export const API_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL) || '/api';

// 개발/배포 상관없이 환경 변수가 없으면 기본적으로 S3 버킷 주소를 바라보도록 수정
const S3_BUCKET_FALLBACK =
  window.location.protocol === 'https:'
    ? 'https://finalproject-s3-bucket-243050855199-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com'
    : 'http://finalproject-s3-bucket-243050855199-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com';

export const SERVER_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_SERVER_BASE_URL) ||
  trimTrailingSlash(API_BASE_URL.replace(/\/api$/, '')) ||
  S3_BUCKET_FALLBACK;

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws-connect`;

export const S3_ASSET_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_S3_ASSET_BASE_URL) || '';

export const resolveAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
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
