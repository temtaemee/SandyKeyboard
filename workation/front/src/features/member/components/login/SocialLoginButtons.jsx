// components/login/SocialLoginButtons.jsx
import styled from 'styled-components';

function SocialLoginButtons() {
  const CLIENT_ID = 'He0BQFaYRyk5Zk2p_Kdy';
  const REDIRECT_URI = 'http://localhost:5173/oauth/callback/naver';

  // 네이버는 보안을 위해 'state'라는 랜덤 문자열(상태 토큰)을 필수로 요구합니다. 임의로 적어줍니다.
  const STATE = 'mo_rae_key_board_state';

  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
  // 🔵 구글 설정 추가 (방금 구글 콘솔에서 발급받은 ID 입력)
  const GOOGLE_CLIENT_ID =
    '636736190970-kr8td75eis24br9sdgbqq8kentqno1td.apps.googleusercontent.com';
  const GOOGLE_REDIRECT_URI = 'http://localhost:5173/oauth/callback/google';

  // 구글은 필수 스코프(이메일, 프로필)를 URL에 명시해줍니다.
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;

  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  // 🔵 구글 로그인 핸들러
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <Wrapper>
      {/* 카카오는 임시 비활성화 */}
      <SocialButton
        bg="#FEE500"
        style={{ opacity: 0.5, cursor: 'not-allowed' }}
      >
        🟨
      </SocialButton>

      {/* 네이버 로그인 활성화! 🟩 */}
      <SocialButton bg="#03C75A" onClick={handleNaverLogin}>
        🟩
      </SocialButton>

      <SocialButton bg="#FFFFFF" border onClick={handleGoogleLogin}>
        🌐
      </SocialButton>
    </Wrapper>
  );
}

export default SocialLoginButtons;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
`;

const SocialButton = styled.button`
  width: 72px;
  height: 46px;

  border-radius: 10px;

  border: ${(props) => (props.$border ? '1px solid #d1d5db' : 'none')};

  background-color: ${(props) => props.bg};

  font-size: 18px;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;
