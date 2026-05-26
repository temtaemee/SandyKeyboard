// features/member/components/login/GoogleCallback.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axios';

function GoogleCallback() {
  const navigate = useNavigate();
  const isProcessed = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code'); // 구글이 준 인가 코드

    if (isProcessed.current) return;

    if (code) {
      isProcessed.current = true;

      // 🔵 우리가 통합한 SocialLoginReqDto 규격에 맞춰 code 전송 (구글은 state가 없으므로 생략)
      api
        .post('/guest/google', { code: code })
        .then((response) => {
          const targetData = response.data ? response.data : response;
          const { token, isNewUser, email } = targetData;

          if (isNewUser) {
            alert('구글 연동을 위해 추가 회원 정보 입력 페이지로 이동합니다.');
            navigate(`/join?type=social&email=${email}&tempToken=${token}`);
          } else {
            localStorage.setItem('accessToken', token);
            alert('구글 계정으로 로그인 성공!');
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('구글 로그인 처리 중 에러:', error);
          isProcessed.current = false;
          navigate('/login');
        });
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#3a4a57',
      }}
    >
      <h3>구글 계정으로 모래묻은 키보드에 연결 중... 🔵</h3>
    </div>
  );
}

export default GoogleCallback;
