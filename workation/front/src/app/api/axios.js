import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:80/api',
  timeout: 5000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, //성공함수
  (error) => {
    return Promise.reject(error);
  } // 실패함수
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  }, //성공함수
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('accessToken');

      // 현재 주소가 관리자 페이지(/admin)인 경우 로그인 페이지로 리다이렉트
      if (window.location.pathname.startsWith('/admin')) {
        alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  } //실패함수
);

export default api;
