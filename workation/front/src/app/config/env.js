const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

export const API_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL) || '/api';

// 개발/배포 상관없이 환경 변수가 없으면 기본적으로 S3 버킷 주소를 바라보도록 수정
const S3_BUCKET_FALLBACK =
  window.location.protocol === 'https:'
    ? 'https://finalproject-s3-bucket-243050855199-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com'
    : 'http://finalproject-s3-bucket-243050855199-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com';

export const SERVER_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_SERVER_BASE_URL) || S3_BUCKET_FALLBACK;

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws-connect`;

export const S3_ASSET_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_S3_ASSET_BASE_URL) || '';

export const resolveAssetUrl = (path) => {
  if (!path) return null;

  // 1. 만약 절대 경로(http/https)로 들어왔다면
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // 백엔드 도메인이 포함되어 있다면, 우리가 설정한 SERVER_BASE_URL(S3)로 강제 교체합니다.
    if (path.includes('api.sandykey.shop')) {
      return path.replace(
        /https?:\/\/api\.sandykey\.shop\/?/,
        `${SERVER_BASE_URL}/`
      );
    }
    // 다른 외부 link인 경우는 그대로 리턴
    return path;
  }

  // 2. 상대 경로(/dummy-images/...)로 들어온 경우는 기존처럼 처리
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
