import styled from 'styled-components';
import kakaoImg from '../../img/kakao.png';
import naverImg from '../../img/naver.png';

function SocialLoginButtons() {
<<<<<<< HEAD
  // //로컬용
  // const NAVER_REDIRECT_URI = 'http://localhost:5173/oauth/callback/naver';
  // const KAKAO_REDIRECT_URI = 'http://localhost:5173/oauth/callback/kakao';
  // const GOOGLE_REDIRECT_URI = 'http://localhost:5173/oauth/callback/google';
  // const KAKAO_REST_API_KEY = 'd9a689a25f662f9366b1e782bce9d86e';

  // // 🚀 [AWS 배포용] - 배포 시 활성화
  const NAVER_REDIRECT_URI = 'https://sandykey.shop/oauth/callback/naver';
  const GOOGLE_REDIRECT_URI = 'https://sandykey.shop/oauth/callback/google';
  const KAKAO_REDIRECT_URI = 'https://sandykey.shop/oauth/callback/kakao';
  const KAKAO_REST_API_KEY = '178dc23fcf097631447fd66642773f8b';
=======
  //로컬용
  const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;

  const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

  const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
>>>>>>> 78d4c110c13cb2cff9e7cbb18717f3e7b04a59fa

  const STATE = 'mo_rae_key_board_state';
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;

  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <ContainerWrapper>
      {/* 1. 카카오 로그인 버튼 (이미지 통으로 매핑) */}
      <ImageLoginButton onClick={handleKakaoLogin}>
        <img src={kakaoImg} alt="Login with Kakao" />
      </ImageLoginButton>

      {/* 2. 네이버 로그인 버튼 (이미지 통으로 매핑) */}
      <ImageLoginButton onClick={handleNaverLogin}>
        <img src={naverImg} alt="Log in with NAVER" />
      </ImageLoginButton>

      {/* 3. 구글 로그인 버튼 (SVG 코드로 네이버/카카오 양끝 라운드 완벽 동기화) */}
      <GoogleLoginButton onClick={handleGoogleLogin}>
        <svg
          className="google-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24c0-1.65-.15-3.22-.42-4.75H24v9h12.75c-.55 3-2.25 5.5-4.81 7.22l7.47 5.78c4.36-4.03 6.91-9.97 6.91-17.25z"
          />
          <path
            fill="#FBBC05"
            d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.47-5.78c-2.07 1.42-4.73 2.27-8.42 2.27-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
        </svg>
        <span className="btn-text">Sign in with Google</span>
      </GoogleLoginButton>
    </ContainerWrapper>
  );
}

export default SocialLoginButtons;

/* ─── Styled Components 영역 ─── */

// 세로로 1열 배치하고 간격을 벌려주는 감싸는 컨테이너
const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column; /* 👈 세로 정렬 핵심 */
  align-items: center;
  width: 100%;
  max-width: 360px; /* 카카오/네이버 기본 권장 가로 규격 */
  margin: 0 auto;
  gap: 12px; /* 버튼 사이의 세로 간격 */
`;

// 카카오, 네이버 이미지를 사용하는 버튼 스타일
// SocialLoginButtons.jsx 맨 아래의 ImageLoginButton 수정

const ImageLoginButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  height: 48px;
  cursor: pointer;
  transition: transform 0.2s ease;
  overflow: hidden; /* 👈 혹시나 이미지가 박스 밖으로 튀어나가는 것 방지 */
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    /* 🚨 핵심: 카카오 이미지에만 미세하게 들어간 상하 투명 여백을 
       강제로 확대해서 네이버와 겉보기 크기를 일치시킵니다. */
    transform: scale(1.05);
    object-fit: cover; /* contain 대신 cover로 꽉 채우기 */
  }

  &:hover {
    /* 기존 호버 기능과 확대 기능이 충돌하지 않도록 조정 */
    transform: translateY(-2px);
  }
`;

// 구글 커스텀 버튼 스타일 (카카오/네이버 공식 이미지 모양과 100% 일치)
const GoogleLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px; /* 높이 일치 */

  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 24px; /* 👈 중요: 이미지들과 완벽히 매칭되는 완전 라운드 둥글기 */

  font-family: 'Roboto', 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #1f1f1f;

  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08); /* 미묘한 입체감 추가 */
  padding: 0 16px;

  .google-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }

  .btn-text {
    display: inline-block;
    vertical-align: middle;
  }

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;
