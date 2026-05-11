// components/signup/SignupForm.jsx
import { useState } from 'react';
import styled from 'styled-components';
import useJoin from '../../hooks/useJoin';

function SignupForm() {
  const { fetchJoin, navi } = useJoin();
  const [vo, setVo] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    email: '',
  });

  const [passwordCheck, setPasswordCheck] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setVo((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (vo.password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    await fetchJoin(vo);
  }

  return (
    <Card>
      <Title>계정 만들기</Title>

      <SubTitle>모래묻은 키보드에 오신 것을 환영합니다!</SubTitle>

      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>이름</Label>

          <Input
            type="text"
            name="name"
            value={vo.name}
            placeholder="홍길동"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>아이디</Label>

          <Input
            type="text"
            name="username"
            placeholder="ID입력"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>비밀번호</Label>

          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>비밀번호 확인</Label>

          <Input
            type="password"
            name="password2"
            placeholder="••••••••"
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>연락처</Label>

          <Input
            type="number"
            name="phone"
            placeholder="숫자만 입력"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>이메일</Label>

          <Input
            type="email"
            name="email"
            placeholder="example@naver.com"
            onChange={handleChange}
          />
        </InputWrapper>

        <AgreeArea>
          <input type="checkbox" />

          <span>이용약관 및 개인정보처리방침에 동의합니다.</span>
        </AgreeArea>

        <SignupButton type="submit">가입하기</SignupButton>
      </Form>

      <LoginText>
        이미 계정이 있으신가요?
        <LoginLink>로그인</LoginLink>
      </LoginText>

      <Divider>
        <span>간편 가입</span>
      </Divider>

      <SocialArea>
        <SocialButton>🟨</SocialButton>

        <SocialButton>🔵</SocialButton>
      </SocialArea>
    </Card>
  );
}

export default SignupForm;

const Card = styled.section`
  width: 100%;
  max-width: 460px;

  background-color: white;

  border-radius: 28px;

  padding: 48px 42px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 42px;
  font-weight: 700;

  color: #3d4d54;

  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: 15px;
  color: #7b8794;

  margin-bottom: 38px;
`;

const Form = styled.form``;

const InputWrapper = styled.div`
  margin-bottom: 22px;
`;

const Label = styled.label`
  display: block;

  font-size: 14px;
  color: #6b7280;

  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 54px;

  border: 1px solid #d6dde2;
  border-radius: 12px;

  padding: 0 16px;

  font-size: 14px;

  outline: none;

  transition: 0.2s;

  &:focus {
    border-color: #4d6c75;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const AgreeArea = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 13px;
  color: #6b7280;

  margin-bottom: 24px;

  cursor: pointer;
`;

const SignupButton = styled.button`
  width: 100%;
  height: 54px;

  border: none;
  border-radius: 12px;

  background-color: #4d6c75;
  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const LoginText = styled.div`
  margin-top: 28px;

  text-align: center;

  font-size: 14px;
  color: #6b7280;
`;

const LoginLink = styled.span`
  margin-left: 6px;

  color: #4d6c75;
  font-weight: 600;

  cursor: pointer;
`;

const Divider = styled.div`
  position: relative;

  text-align: center;

  margin: 36px 0 26px;

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

const SocialArea = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
`;

const SocialButton = styled.button`
  width: 52px;
  height: 52px;

  border-radius: 50%;

  border: 1px solid #d1d5db;

  background-color: white;

  font-size: 18px;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;
