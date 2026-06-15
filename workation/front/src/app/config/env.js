const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

export const API_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_API_BASE_URL) || '/api';

export const SERVER_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_SERVER_BASE_URL) || '';

export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  (import.meta.env.DEV
    ? 'ws://localhost:8001/ws-connect'
    : `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws-connect`);

export const S3_ASSET_BASE_URL =
  trimTrailingSlash(import.meta.env.VITE_S3_ASSET_BASE_URL) || '';

export const resolveAssetUrl = (path) => {
  if (!path) return null;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/api/')) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, '');
  if (
    S3_ASSET_BASE_URL &&
    (cleanPath.startsWith('dummy-images/') || cleanPath.startsWith('uploads/'))
  ) {
    return `${S3_ASSET_BASE_URL}/${cleanPath}`;
  }

  if (SERVER_BASE_URL) {
    return `${SERVER_BASE_URL}/${cleanPath}`;
  }

  return path.startsWith('/') ? path : `/${path}`;
};

export const resolveS3AssetUrl = (keyOrUrl) => {
  if (!keyOrUrl) return null;
  if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
    return keyOrUrl;
  }
  return S3_ASSET_BASE_URL
    ? `${S3_ASSET_BASE_URL}/${keyOrUrl.replace(/^\/+/, '')}`
    : resolveAssetUrl(keyOrUrl);
};
