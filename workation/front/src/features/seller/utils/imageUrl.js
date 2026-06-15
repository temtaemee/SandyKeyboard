import api from '../../../app/api/axios';
import { resolveAssetUrl } from '../../../app/config/env';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

function getApiOrigin() {
  const fallback = typeof window !== 'undefined' ? window.location.origin : '';
  try {
    return new URL(api.defaults.baseURL ?? '', fallback).origin;
  } catch {
    return fallback;
  }
}

export function resolveSellerImageUrl(filePath) {
  if (!filePath) return filePath;

  const value = String(filePath);
  if (value.startsWith('blob:') || value.startsWith('data:')) return value;

  const apiOrigin = getApiOrigin();

  if (value.startsWith('/')) {
    return `${apiOrigin}${value}`;
  }

  try {
    const url = new URL(value);
    if (LOCAL_HOSTS.has(url.hostname)) {
      return `${apiOrigin}${url.pathname}${url.search}${url.hash}`;
    }
    return value;
  } catch {
    if (value.startsWith('dummy-images/') || value.startsWith('uploads/')) {
      return resolveAssetUrl(value);
    }
    return value;
  }
}
