// components/mypage/MemberEditForm.jsx

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useMypage from '../hooks/useMypage';
import { editMyInfo } from '../api/mypageApi';

function MemberEditForm({ setEditMode }) {
  const { memberInfo, loading } = useMypage();
  const [vo, setVo] = useState({
    name: '',
    email: '',
    phone: '',
    preferredArea: '',
  });
  useEffect(() => {
    if (memberInfo) {
      setVo({
        name: memberInfo.name,
        email: memberInfo.email,
        phone: memberInfo.phone,
        preferredArea: memberInfo.preferredArea,
      });
    }
  }, [memberInfo]);

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
      await editMyInfo(vo);
      alert('회원 정보가 수정되었습니다.');
      setEditMode(false);
    } catch (err) {
      console.error(err);

      alert('회원 정보 수정에 실패했습니다.');
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Label>이름</Label>

        <Input
          type="text"
          name="name"
          value={vo.name}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup>
        <Label>이메일</Label>

        <Input
          type="email"
          name="email"
          value={vo.email}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup>
        <Label>연락처</Label>

        <Input
          type="text"
          name="phone"
          value={vo.phone}
          onChange={handleChange}
        />
      </InputGroup>

      <InputGroup>
        <Label>선호 지역</Label>

        <Select
          name="preferredArea"
          value={vo.preferredArea}
          onChange={handleChange}
        >
          <option value="SEOUL">서울</option>
          <option value="GYEONGGI">경기</option>
          <option value="GANGWON">강원</option>
          <option value="CHUNGNAM">충남</option>
          <option value="CHUNGBUK">충북</option>
          <option value="GYEONGNAM">경남</option>
          <option value="GYEONGBUK">경북</option>
          <option value="JEONNAM">전남</option>
          <option value="JEONBUK">전북</option>
          <option value="JEJU">제주</option>
        </Select>
      </InputGroup>

      <ButtonArea>
        <CancelButton type="button" onClick={() => setEditMode(false)}>
          취소
        </CancelButton>

        <SubmitButton type="submit">저장하기</SubmitButton>
      </ButtonArea>
    </Form>
  );
}

export default MemberEditForm;

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
`;

const Select = styled.select`
  width: 100%;
  height: 52px;

  border: 1px solid #dbe2e8;
  border-radius: 14px;

  padding: 0 16px;

  font-size: 14px;

  outline: none;

  background-color: white;

  transition: 0.2s;

  &:focus {
    border-color: #3f6971;
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
