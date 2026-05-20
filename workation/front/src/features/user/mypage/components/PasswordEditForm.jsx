// components/mypage/PasswordEditForm.jsx

import { useState } from 'react';
import styled from 'styled-components';
import { updatePassword } from '../api/mypageApi';

function PasswordEditForm({ setPasswordEditMode }) {
  const [vo, setVo] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordCheck: '',
  });

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
      await updatePassword(vo);

      alert('비밀번호가 변경되었습니다.');

      setPasswordEditMode(false);
    } catch (err) {
      console.error(err);

      alert('비밀번호 변경에 실패했습니다.');
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Label>현재 비밀번호</Label>

        <Input
          type="password"
          name="currentPassword"
          placeholder="현재 비밀번호 입력"
          value={vo.currentPassword}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup>
        <Label>새 비밀번호</Label>

        <Input
          type="password"
          name="newPassword"
          placeholder="새 비밀번호 입력"
          value={vo.newPassword}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup>
        <Label>새 비밀번호 확인</Label>

        <Input
          type="password"
          name="newPasswordCheck"
          placeholder="새 비밀번호 다시 입력"
          value={vo.newPasswordCheck}
          onChange={handleChange}
        />
      </InputGroup>

      <ButtonArea>
        <CancelButton type="button" onClick={() => setPasswordEditMode(false)}>
          취소
        </CancelButton>

        <SubmitButton type="submit">비밀번호 변경</SubmitButton>
      </ButtonArea>
    </Form>
  );
}

export default PasswordEditForm;

/* ================= styled ================= */

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  color: #6b7280;

  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 52px;

  border: 1px solid #dbe2e8;
  border-radius: 14px;

  padding: 0 16px;

  font-size: 14px;

  outline: none;

  transition: 0.2s;

  &:focus {
    border-color: #3f6971;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  margin-top: 8px;
`;

const CancelButton = styled.button`
  height: 44px;

  padding: 0 20px;

  border-radius: 12px;
  border: 1px solid #d1d5db;

  background-color: white;
  color: #374151;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
`;

const SubmitButton = styled.button`
  height: 44px;

  padding: 0 20px;

  border: none;
  border-radius: 12px;

  background-color: #3f6971;
  color: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;
