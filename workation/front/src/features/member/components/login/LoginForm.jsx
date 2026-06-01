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
            <FindLink
              onClick={() => {
                navi(`/find-id`);
              }}
            >
              아이디 찾기
            </FindLink>

            <DividerText>|</DividerText>

            <FindLink
              onClick={() => {
                navi(`/find-password`);
              }}
            >
              비밀번호 찾기
            </FindLink>
          </FindArea>
        </OptionArea>
        {/* 2. 에러가 존재할 때 로그인 버튼 바로 위에 컴포넌트 노출 ✨ */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <LoginButton type="submit">로그인 →</LoginButton>
      </Form>

      <Divider>
        <span>간편 로그인</span>
      </Divider>

      <SocialLoginButtons />

      <SignupArea>
        계정이 없으신가요?
        <SignupLink
          onClick={() => {
            navi(`/join`);
          }}
        >
          회원가입
        </SignupLink>
      </SignupArea>
    </Card>
  );
}

export default LoginForm;

const ErrorMessage = styled.div`
  color: #dc2626; /* 선명한 빨간색 */
  background-color: #fef2f2; /* 부드러운 분홍빛 패널 배경 */
  border: 1px solid #fee2e2;
  font-size: 13px;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  text-align: left;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Card = styled.section`
  width: 100%;
  max-width: 430px;

  background-color: white;

  border-radius: 28px;

  padding: 48px 42px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const TitleArea = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #3a4a57;

  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #7b8794;
  line-height: 1.6;
`;

const Form = styled.form`
  margin-bottom: 32px;
`;

const InputWrapper = styled.div`
  margin-bottom: 22px;
`;

const Label = styled.label`
  display: block;

  font-size: 14px;
  color: #4b5563;

  margin-bottom: 10px;
`;

const InputBox = styled.div`
  width: 100%;
  height: 56px;

  border: 1px solid #d5dce1;
  border-radius: 12px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  background-color: #fff;
`;

const Icon = styled.div`
  margin-right: 12px;
  font-size: 16px;
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

  margin-bottom: 24px;
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 13px;
  color: #6b7280;

  cursor: pointer;
`;

const FindPassword = styled.div`
  font-size: 13px;
  color: #5f7d8b;

  cursor: pointer;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 56px;

  border: none;
  border-radius: 12px;

  background-color: #4f6f78;
  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
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
  font-size: 12px;
  color: #cbd5e1;
`;

const Divider = styled.div`
  position: relative;

  text-align: center;

  margin-bottom: 28px;

  span {
    position: relative;
    z-index: 2;

    background-color: white;

    padding: 0 14px;

    font-size: 13px;
    color: #9ca3af;
  }

  &::before {
    content: '';

    position: absolute;
    top: 50%;
    left: 0;

    width: 100%;
    height: 1px;

    background-color: #e5e7eb;
  }
`;

const SignupArea = styled.div`
  margin-top: 32px;

  text-align: center;

  font-size: 14px;
  color: #6b7280;
`;

const SignupLink = styled.span`
  margin-left: 6px;

  color: #5f7d8b;
  font-weight: 600;

  cursor: pointer;
`;
