import { useNavigate } from 'react-router-dom';
import { login } from '../api/memberApi';

function useLogin() {
  const navi = useNavigate();

  async function fetchLogin(vo) {
    try {
      // 💡 중요: 실제 백엔드에 로그인을 요청하여 응답(data)을 받아옵니다.
      const data = await login(vo);

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
          navi(`/`); // 파싱 에러 발생 시 홈으로 안전하게 이동
        }
      }
    } catch (err) {
      console.error('로그인 실패', err);
    }
  }

  return { fetchLogin, navi };
}

export default useLogin;
