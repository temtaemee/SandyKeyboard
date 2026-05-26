import { useNavigate } from 'react-router-dom';
import { login } from '../api/memberApi';

function useLogin() {
  const navi = useNavigate();

  async function fetchLogin(vo) {
    if (data.result === 'success') {
      localStorage.setItem('accessToken', data.token);
      console.log('로그인 성공');

      try {
        // JWT 토큰 디코딩하여 payload 추출
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const roles = payload.roles || [];

        // ADMIN 권한이 있는 경우 대시보드로 리다이렉트
        if (roles.includes('ADMIN')) {
          navi('/admin/dashboard');
        } else {
          navi(`/`);
        }
      } catch (decodeError) {
        console.error('토큰 디코딩 에러:', decodeError);
        navi(`/`);
      }
    }
  }

  return { fetchLogin, navi };
}

export default useLogin;
