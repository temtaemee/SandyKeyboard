// components/mypage/MemberEditForm.jsx

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useMypage from '../hooks/useMypage';
import { editMyInfo } from '../api/mypageApi';
import AddressSearchModal from '../../../../home/components/AddressSearchModal';

function MemberEditForm({ setEditMode }) {
  const { memberInfo, loading } = useMypage();
  const [vo, setVo] = useState({
    name: '',
    email: '',
    phone: '',
    preferredArea: '',
    zonecode: '',
    address: '',
    addressDetail: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (memberInfo) {
      setVo({
        name: memberInfo.name || '',
        email: memberInfo.email || '',
        phone: memberInfo.phone || '',
        preferredArea: memberInfo.preferredArea || '',
        zonecode: memberInfo.zonecode || '',
        address: memberInfo.address || '',
        addressDetail: memberInfo.addressDetail || '',
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
  const handleAddressSelect = (selectedAddress) => {
    setVo((prev) => ({
      ...prev,
      zonecode: selectedAddress.zonecode,
      address: selectedAddress.address,
    }));
  };

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
        <Label>주소</Label>
        <AddressRow>
          <Input
            type="text"
            name="zonecode"
            value={vo.zonecode}
            placeholder="우편번호"
            readOnly
          />
          <AddressButton type="button" onClick={() => setIsModalOpen(true)}>
            주소 검색
          </AddressButton>
        </AddressRow>

        <Input
          type="text"
          name="address"
          value={vo.address}
          placeholder="기본 주소"
          readOnly
          style={{ marginTop: '10px' }}
        />

        <Input
          type="text"
          name="addressDetail"
          value={vo.addressDetail}
          placeholder="상세 주소를 입력하세요"
          onChange={handleChange}
          style={{ marginTop: '10px' }}
        />
      </InputGroup>

      {/* 💡 공용 우편번호 모달 부착 */}
      {isModalOpen && (
        <AddressSearchModal
          onClose={() => setIsModalOpen(false)}
          onSelect={handleAddressSelect}
        />
      )}

      <InputGroup>
        <Label>선호 지역</Label>

        <Select
          name="preferredArea"
          value={vo.preferredArea}
          onChange={handleChange}
        >
          {/* 💡 유저 정보가 없을 때(빈 문자열일 때) 화면에 띄워줄 기본 껍데기 */}
          <option value="" disabled>
            지역을 선택해주세요
          </option>
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
// 💡 주소 정렬용 행 레이아웃
const AddressRow = styled.div`
  display: flex;
  gap: 12px;
`;

// 💡 마이페이지 시그니처 컬러(#3f6971)를 매칭한 검색 버튼 디자인
const AddressButton = styled.button`
  width: 130px;
  height: 52px;
  border: 1px solid #3f6971;
  border-radius: 14px;
  background-color: transparent;
  color: #3f6971;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s;

  &:hover {
    background-color: #f3f6f8;
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
