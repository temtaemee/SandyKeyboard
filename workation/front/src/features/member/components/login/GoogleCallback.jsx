// features/member/components/login/GoogleCallback.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axios';
import { restoreAccount } from '../../api/memberApi';

function GoogleCallback() {
  const navigate = useNavigate();
  const isProcessed = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code'); // 구글이 준 인가 코드

    if (isProcessed.current) return;

    if (code) {
      isProcessed.current = true;
      let googleEmail = '';

      // 🔵 우리가 통합한 SocialLoginReqDto 규격에 맞춰 code 전송 (구글은 state가 없으므로 생략)
      api
        .post('/guest/google', { code: code })
        .then((response) => {
          const targetData = response.data ? response.data : response;
          const { token, isNewUser, email } = targetData;
          googleEmail = email;
          if (isNewUser) {
            alert('구글 연동을 위해 추가 회원 정보 입력 페이지로 이동합니다.');
            navigate(`/join?type=social&email=${email}&tempToken=${token}`);
          } else {
            localStorage.setItem('accessToken', token);
            alert('구글 계정으로 로그인 성공!');
            navigate('/');
          }
        })
        .catch(async (error) => {
          // 🌟 비동기 처리를 위해 async 추가
          console.error('구글 로그인 처리 중 에러:', error);

          // 🌟 백엔드 시큐리티가 던진 401(탈퇴 유저) 에러인지 확인
          if (error.response && error.response.status === 401) {
            const serverMessage = error.response.data?.message;

            if (serverMessage && serverMessage.includes('탈퇴')) {
              // 1. 탈퇴 복구 의사 묻기
              const isRestore = window.confirm(
                '탈퇴한 계정입니다. 계정을 복구하고 다시 로그인하시겠습니까?'
              );

              if (isRestore) {
                try {
                  // 2. 소셜 가입은 이메일이나 소셜 ID가 username 역할을 하므로,
                  // 백엔드에서 에러와 함께 던져준 email이나 데이터를 활용해 복구 요청을 보냅니다.
                  // (만약 백엔드가 401 에러 바디에 email을 같이 안 준다면, 에러 발생 전 수신하려던 email 변수나 response 구조 확인 필요)
                  const userEmail = error.response.data?.email;

                  await restoreAccount({ username: userEmail });

                  alert(
                    '계정이 성공적으로 복구되었습니다! 다시 로그인을 시도해 주세요.'
                  );
                  navigate('/login'); // 복구 완료 후 로그인 페이지로 안전하게 이동
                  return;
                } catch (restoreErr) {
                  alert('계정 복구에 실패했습니다. 고객센터로 문의해 주세요.');
                }
              }
            }
          }

          // 일반 에러 시 기본 동작
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Google login failed.';
          alert(errorMessage);
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
