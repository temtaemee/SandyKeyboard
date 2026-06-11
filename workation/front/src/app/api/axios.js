import axios from 'axios';
import { API_BASE_URL } from '../config/env';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('accessToken');

      if (window.location.pathname.startsWith('/admin')) {
        alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
