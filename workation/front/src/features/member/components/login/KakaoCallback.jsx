// src/features/member/components/login/KakaoCallback.jsx 생성
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axios';

function KakaoCallback() {
  const navigate = useNavigate();
  const isProcessed = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code'); // 카카오가 던져준 인가 코드

    if (isProcessed.current) return;

    if (code) {
      isProcessed.current = true; // 🔒 중복 요청 방지 락

      // 백엔드 통합 DTO 스펙에 맞춰 code 전송 (카카오는 state가 없으므로 생략)
      api
        .post('/guest/kakao', { code: code, state: null })
        .then((response) => {
          const targetData = response.data ? response.data : response;
          const { token, isNewUser, email, profileImageUrl } = targetData;

          if (isNewUser) {
            // 💡 1번 방식 반영: 신규 유저면 추가 가입 양식으로 가되, 발급된 토큰을 주소창에 숨겨서 이동!
            alert(
              '카카오 연동을 위해 추가 회원 정보 입력 페이지로 이동합니다.'
            );
            const photoParam = profileImageUrl
              ? `&profileImageUrl=${encodeURIComponent(profileImageUrl)}`
              : '';
            navigate(`/join?type=social&email=${email}&tempToken=${token}`);
          } else {
            // 기존 연동 유저라면 즉시 로그인 처리 후 홈으로 프리패스
            localStorage.setItem('accessToken', token);
            alert('카카오 계정으로 로그인 성공!');
            navigate('/');
          }
        })
        .catch((error) => {
          console.error('카카오 로그인 처리 중 에러:', error);
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
      <h3>카카오 계정으로 모래묻은 키보드에 연결 중... 🟨</h3>
    </div>
  );
}

export default KakaoCallback;
