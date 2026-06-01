import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/memberApi';

function useLogin() {
  const navi = useNavigate();
  // 1. 에러 메시지를 담을 리액트 상태(State)를 생성합니다. ✨
  const [error, setError] = useState('');

  async function fetchLogin(vo) {
    try {
      setError(''); // 로그인 시도를 새로 할 때마다 기존 에러 메시지를 깔끔하게 지웁니다.

      // 실제 백엔드에 로그인을 요청하여 응답(data)을 받아옵니다.
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
      } else {
        // 백엔드에서 200 OK를 주면서 내부 응답값으로 실패를 보냈을 경우의 방어 코드
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 실패', err);

      // 2. catch에 잡힌 시스템 error를 분석하여 친절한 한글 메시지로 가공합니다. ✨
      if (err.response && err.response.status === 401) {
        // 백엔드 시큐리티가 인증 실패(401 Unauthorized)를 던졌을 때
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (err.response && err.response.status === 403) {
        // 권한이 막혔거나 정지된 유저일 때
        setError('접근 권한이 없는 계정입니다.');
      } else {
        // 서버가 다운되었거나 네트워크가 단절되었을 때 (500 Error 등)
        setError('서버와의 통신이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.');
      }
    }
  }

  // 3. LoginForm에서 컴포넌트가 error 상태를 구독할 수 있도록 함께 리턴합니다. ✨
  return { fetchLogin, navi, error };
}

export default useLogin;