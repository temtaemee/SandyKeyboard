// components/login/LoginForm.jsx
import styled from 'styled-components';
import SocialLoginButtons from './SocialLoginButtons';
import useLogin from '../../hooks/useLogin';
import { useEffect, useState } from 'react';

function LoginForm() {
  const { fetchLogin, navi, error } = useLogin();
  const [vo, setVo] = useState({
    username: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setVo((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  function handleCheckboxChange(e) {
    setRememberMe(e.target.checked);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setVo((prev) => ({ ...prev, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('savedUsername', vo.username);
    } else {
      localStorage.removeItem('savedUsername');
    }
    fetchLogin(vo);
  }

  return (
    <Card>
      <TitleArea>
        <Title>반가워요!</Title>
        <SubTitle>몰입과 휴식이 공존하는 공간으로의 로그인</SubTitle>
      </TitleArea>

      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>아이디</Label>
          <InputBox>
            <Icon>✉</Icon>
            <Input
              type="text"
              name="username"
              placeholder="ID입력"
              value={vo.username}
              onChange={handleChange}
            />
          </InputBox>
        </InputWrapper>

        <InputWrapper>
          <Label>비밀번호</Label>
          <InputBox>
            <Icon>🔒</Icon>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </InputBox>
        </InputWrapper>

        <OptionArea>
          <RememberMe>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleCheckboxChange}
            />
            <span>아이디 저장</span>
          </RememberMe>

          <FindArea>
            <FindLink onClick={() => navi(`/find-id`)}>아이디 찾기</FindLink>
            <DividerText>|</DividerText>
            <FindLink onClick={() => navi(`/find-password`)}>
              비밀번호 찾기
            </FindLink>
          </FindArea>
        </OptionArea>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        <LoginButton type="submit">로그인 →</LoginButton>
      </Form>

      <Divider>
        <span>간편 로그인</span>
      </Divider>

      {/* 🚀 소셜 컴포넌트가 아래 영역을 100% 채우도록 배치 */}
      <SocialLoginButtons />

      <SignupArea>
        계정이 없으신가요?
        <SignupLink onClick={() => navi(`/join`)}>회원가입</SignupLink>
      </SignupArea>
    </Card>
  );
}

export default LoginForm;

/* ─── Styled Components 영역 (밸런스 패치) ─── */

const Card = styled.section`
  width: 100%;
  max-width: 450px; /* 가로 정렬의 여유감을 위해 20px 늘림 */
  background-color: white;
  border-radius: 28px;
  padding: 54px 44px; /* 내부 여백 균형 조정 */
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
`;

const TitleArea = styled.div`
  text-align: center;
  margin-bottom: 36px;
`;

const Title = styled.h2`
  font-size: 22px; /* 폰트 시인성 증가 */
  font-weight: 700;
  color: #3a4a57;
  margin-bottom: 12px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #7b8794;
  line-height: 1.5;
`;

const Form = styled.form`
  margin-bottom: 36px; /* 하단 폼과의 격리 확장 */
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600; /* 조금 더 명확하게 변경 */
  color: #4b5563;
  margin-bottom: 8px;
`;

const InputBox = styled.div`
  width: 100%;
  height: 52px; /* 콤팩트한 비율 조절 */
  border: 1px solid #d5dce1;
  border-radius: 26px; /* ✨ 중요: 소셜 버튼 둥글기와 일체감 형성 (height의 절반) */
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #4f6f78; /* 인풋 클릭 시 메인 테마 컬러 매칭 */
  }
`;

const Icon = styled.div`
  margin-right: 12px;
  font-size: 15px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #374151;
  background-color: transparent;

  &::placeholder {
    color: #a0aab4;
  }
`;

const OptionArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 26px;
  padding: 0 4px;
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;

  input {
    cursor: pointer;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 26px; /* ✨ 중요: 전체 테두리 감각 통일 */
  background-color: #4f6f78;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover {
    background-color: #3f5a62;
  }

  &:active {
    transform: scale(0.99);
  }
`;

const FindArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FindLink = styled.div`
  font-size: 13px;
  color: #5f7d8b;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: #3f6971;
  }
`;

const DividerText = styled.span`
  font-size: 11px;
  color: #cbd5e1;
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin-bottom: 24px;

  span {
    position: relative;
    z-index: 2;
    background-color: white;
    padding: 0 16px;
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #eaedf0; /* 부드러운 실선 변경 */
  }
`;

const SignupArea = styled.div`
  margin-top: 36px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
`;

const SignupLink = styled.span`
  margin-left: 8px;
  color: #4f6f78; /* 메인 테마 스킨 컬러 적용 */
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  font-size: 13px;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  text-align: left;
`;
