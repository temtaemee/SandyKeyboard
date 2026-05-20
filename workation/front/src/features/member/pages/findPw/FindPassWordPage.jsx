// pages/auth/FindPasswordPage.jsx

import { useState } from 'react';
import styled from 'styled-components';
import { resetPassword, sendEmailCode, verifyCode } from '../../api/memberApi';

function FindPasswordPage() {
  const [step, setStep] = useState(1);

  // STEP 1
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
  });

  // STEP 2
  const [authCode, setAuthCode] = useState('');

  // STEP 3
  const [passwordVo, setPasswordVo] = useState({
    newPassword: '',
    newPasswordCheck: '',
  });

  function handleUserInfoChange(e) {
    const { name, value } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;

    setPasswordVo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // 인증코드 발송
  async function handleSendCode() {
    try {
      await sendEmailCode(userInfo);

      alert('인증코드가 발송되었습니다.');

      setStep(2);
    } catch (error) {
      console.error(error);

      alert('일치하는 회원 정보를 찾을 수 없습니다.');
    }
  }

  // 인증코드 확인
  async function handleVerifyCode() {
    try {
      TODO: await verifyCode({
        email: userInfo.email,
        code: authCode,
      });

      alert('이메일 인증이 완료되었습니다.');

      setStep(3);
    } catch (error) {
      console.error(error);

      alert('인증코드가 올바르지 않습니다.');
    }
  }

  // 비밀번호 변경
  async function handleResetPassword(e) {
    e.preventDefault();

    if (passwordVo.newPassword !== passwordVo.newPasswordCheck) {
      alert('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await resetPassword({
        username: userInfo.username,
        email: userInfo.email,
        newPassword: passwordVo.newPassword,
        newPasswordCheck: passwordVo.newPasswordCheck,
      });

      alert('비밀번호가 변경되었습니다.');

      location.href = '/login';
    } catch (error) {
      console.error(error);

      alert('비밀번호 변경 실패');
    }
  }

  return (
    <Wrapper>
      <Card>
        <TitleArea>
          <Title>비밀번호 찾기</Title>

          <SubTitle>이메일 인증 후 새로운 비밀번호를 설정해주세요.</SubTitle>
        </TitleArea>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <InputWrapper>
              <Label>아이디</Label>

              <Input
                type="text"
                name="username"
                placeholder="아이디 입력"
                value={userInfo.username}
                onChange={handleUserInfoChange}
              />
            </InputWrapper>

            <InputWrapper>
              <Label>이메일</Label>

              <Input
                type="email"
                name="email"
                placeholder="example@naver.com"
                value={userInfo.email}
                onChange={handleUserInfoChange}
              />
            </InputWrapper>

            <PrimaryButton onClick={handleSendCode}>
              인증코드 발송
            </PrimaryButton>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <InfoText>입력하신 이메일로 인증코드가 발송되었습니다.</InfoText>

            <InputWrapper>
              <Label>인증코드</Label>

              <Input
                type="text"
                placeholder="인증코드 입력"
                value={authCode}
                onChange={(e) => {
                  setAuthCode(e.target.value);
                }}
              />
            </InputWrapper>

            <PrimaryButton onClick={handleVerifyCode}>인증 확인</PrimaryButton>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Form onSubmit={handleResetPassword}>
            <InputWrapper>
              <Label>새 비밀번호</Label>

              <Input
                type="password"
                name="newPassword"
                placeholder="새 비밀번호 입력"
                value={passwordVo.newPassword}
                onChange={handlePasswordChange}
              />
            </InputWrapper>

            <InputWrapper>
              <Label>새 비밀번호 확인</Label>

              <Input
                type="password"
                name="newPasswordCheck"
                placeholder="새 비밀번호 확인"
                value={passwordVo.newPasswordCheck}
                onChange={handlePasswordChange}
              />
            </InputWrapper>

            <PrimaryButton type="submit">비밀번호 변경</PrimaryButton>
          </Form>
        )}
      </Card>
    </Wrapper>
  );
}

export default FindPasswordPage;

/* ================= styled ================= */

const Wrapper = styled.main`
  width: 100%;
  min-height: calc(100vh - 160px);

  background-color: #f4f7f8;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 60px 20px;
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
  font-size: 26px;
  font-weight: 700;

  color: #3a4a57;

  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #7b8794;

  line-height: 1.6;
`;

const Form = styled.form``;

const InputWrapper = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;

  font-size: 14px;
  color: #4b5563;

  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 56px;

  border: 1px solid #d5dce1;
  border-radius: 12px;

  padding: 0 16px;

  font-size: 14px;

  outline: none;

  transition: 0.2s;

  &:focus {
    border-color: #4f6f78;
  }

  &::placeholder {
    color: #a0aab4;
  }
`;

const PrimaryButton = styled.button`
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

const InfoText = styled.div`
  margin-bottom: 24px;

  font-size: 14px;
  color: #64748b;

  line-height: 1.6;
`;
