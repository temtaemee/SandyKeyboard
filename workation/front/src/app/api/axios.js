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
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  } //실패함수
);

export default api;
