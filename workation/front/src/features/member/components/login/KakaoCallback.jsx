import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axios';
// 💡 유저님이 작성하신 커스텀 axios 인스턴스(api)를 import 합니다.
// 파일 위치(경로)는 프로젝트 구조에 맞게 수정해주세요! (예: '../../api/axios')

function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 카카오가 주소창 뒤에 붙여준 인가 코드(?code=xxxxxx)를 추출
    console.log(KAKAO_AUTH_URL);
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      console.log('카카오 인가 코드 획득 완료:', code);

      // 2. 커스텀 api 인스턴스를 사용하여 백엔드로 코드 토스
      // baseURL이 세팅되어 있으므로 '/auth/kakao'로만 요청을 보냅니다.
      api
        .post('/guest/kakao', { code: code })
        .then((response) => {
          // 3. 백엔드가 가입/로그인 처리 후 쥐어준 우리 서비스 전용 JWT 토큰
          // (백엔드 리턴 구조가 { token: '...' } 일 경우)
          const jwtToken = response.data.token;

          // 4. 기존 프로젝트의 토큰 저장 키 값인 'accessToken'으로 저장합니다.
          localStorage.setItem('accessToken', jwtToken);

          alert('카카오 로그인 성공!');
          navigate('/'); // 메인 페이지로 이동
        })
        .catch((error) => {
          console.error('백엔드로 코드 전송 중 에러 발생:', error);
          alert('로그인 처리 중 오류가 발생했습니다.');
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
      <h3>모래묻은 키보드에 연결 중입니다... 🦀</h3>
    </div>
  );
}

export default KakaoCallback;
