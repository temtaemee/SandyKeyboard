// components/login/LoginForm.jsx
import styled from "styled-components";
import SocialLoginButtons from "./SocialLoginButtons";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navi = useNavigate();
  return (
    <Card>
      <TitleArea>
        <Title>반가워요!</Title>

        <SubTitle>몰입과 휴식이 공존하는 공간으로의 로그인</SubTitle>
      </TitleArea>

      <Form>
        <InputWrapper>
          <Label>이메일 주소</Label>

          <InputBox>
            <Icon>✉</Icon>

            <Input type="email" placeholder="example@keyboard.com" />
          </InputBox>
        </InputWrapper>

        <InputWrapper>
          <Label>비밀번호</Label>

          <InputBox>
            <Icon>🔒</Icon>

            <Input type="password" placeholder="••••••••" />
          </InputBox>
        </InputWrapper>

        <OptionArea>
          <RememberMe>
            <input type="checkbox" />
            <span>로그인 유지</span>
          </RememberMe>

          <FindPassword>비밀번호 찾기</FindPassword>
        </OptionArea>

        <LoginButton>로그인 →</LoginButton>
      </Form>

      <Divider>
        <span>간편 로그인</span>
      </Divider>

      <SocialLoginButtons />

      <SignupArea>
        계정이 없으신가요?
        <SignupLink
          onClick={() => {
            navi(`/user/join`);
          }}
        >
          회원가입
        </SignupLink>
      </SignupArea>
    </Card>
  );
}

export default LoginForm;

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

const Form = styled.div`
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
    content: "";

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
