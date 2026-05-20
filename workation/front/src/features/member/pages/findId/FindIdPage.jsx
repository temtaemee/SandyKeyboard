import { useState } from 'react';
import styled from 'styled-components';
import { findUsername } from '../../api/memberApi';

function FindIdPage() {
  const [vo, setVo] = useState({
    name: '',
    email: '',
  });

  const [foundUsername, setFoundUsername] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;

    setVo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await findUsername(vo);

      setFoundUsername(data.username);
    } catch (error) {
      console.error(error);

      alert('일치하는 회원 정보를 찾을 수 없습니다.');
    }
  }

  return (
    <Wrapper>
      <Card>
        <TitleArea>
          <Title>아이디 찾기</Title>

          <SubTitle>가입 시 등록한 이름과 이메일을 입력해주세요.</SubTitle>
        </TitleArea>

        {!foundUsername ? (
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Label>이름</Label>

              <Input
                type="text"
                name="name"
                placeholder="홍길동"
                value={vo.name}
                onChange={handleChange}
              />
            </InputWrapper>

            <InputWrapper>
              <Label>이메일</Label>

              <Input
                type="email"
                name="email"
                placeholder="example@naver.com"
                value={vo.email}
                onChange={handleChange}
              />
            </InputWrapper>

            <FindButton type="submit">아이디 찾기</FindButton>
          </Form>
        ) : (
          <ResultArea>
            <ResultLabel>회원님의 아이디입니다.</ResultLabel>

            <ResultBox>{foundUsername}</ResultBox>

            <MoveButton
              onClick={() => {
                location.href = '/login';
              }}
            >
              로그인 하러가기
            </MoveButton>
          </ResultArea>
        )}
      </Card>
    </Wrapper>
  );
}

export default FindIdPage;

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

const FindButton = styled.button`
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

const ResultArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;
`;

const ResultLabel = styled.div`
  font-size: 15px;
  color: #64748b;
`;

const ResultBox = styled.div`
  width: 100%;

  background-color: #f8fafc;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  padding: 20px;

  text-align: center;

  font-size: 20px;
  font-weight: 700;

  color: #334155;
`;

const MoveButton = styled.button`
  width: 100%;
  height: 52px;

  border: none;
  border-radius: 12px;

  background-color: #e2e8f0;
  color: #334155;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
`;
