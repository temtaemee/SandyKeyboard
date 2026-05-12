import axios from 'axios';
import { useState, useEffect } from 'react'; // 1. useEffect 추가
import styled from 'styled-components';

function SellerApplyForm() {
  const [banks, setBanks] = useState([]); // 2. banks 상태 변수 추가
  const [formData, setFormData] = useState({
    businessNumber: '',
    companyName: '',
    accountNumber: '',
    bankId: '', // 3. 백엔드 DTO(bankId)와 이름 맞춤
    accountHolder: '', // 4. 백엔드 DTO(accountHolder)와 이름 맞춤
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // 로컬스토리지에서 토큰 꺼내기

    axios
      .get('http://127.0.0.1:80/api/user/banks', {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 실어줘야 "아, 너 유저구나!" 하고 통과시켜줌
        },
      })
      .then((res) => {
        setBanks(res.data);
      })
      .catch((err) => console.error('은행 목록 로딩 실패', err));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    // 헤더에 토큰 실어서 보내기 (로컬스토리지 토큰 가정)
    const token = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        'http://127.0.0.1:80/api/user/seller',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert('판매자 신청이 완료되었습니다!');
        // 성공 시 페이지 이동 로직 추가
      }
    } catch (error) {
      alert('신청 중 오류가 발생했습니다.');
    }
  }

  return (
    <Card>
      <Title>판매자 신청</Title>
      <SubTitle>워케이션 호스트가 되어 전국을 연결해주세요!</SubTitle>

      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>업체명</Label>
          <Input
            name="companyName"
            placeholder="예: 모래묻은 게스트하우스"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>사업자 등록번호</Label>
          <Input
            name="businessNumber"
            placeholder="'-' 제외하고 숫자만 입력"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>정산 은행</Label>
          <Select name="bankId" onChange={handleChange} required>
            <option value="">은행을 선택해주세요</option>
            {banks?.map((bank) => (
              <option key={bank.bankId} value={bank.bankId}>
                {bank.bankName}
              </option>
            ))}
          </Select>
        </InputWrapper>

        <InputWrapper>
          <Label>정산 계좌번호</Label>
          <Input
            name="accountNumber"
            placeholder="'-' 제외하고 숫자만 입력"
            onChange={handleChange}
          />
        </InputWrapper>

        {/* 예금주 필드 추가 (DTO에 있으므로) */}
        <InputWrapper>
          <Label>예금주</Label>
          <Input
            name="accountHolder"
            placeholder="성함을 입력하세요"
            onChange={handleChange}
          />
        </InputWrapper>

        <AgreeArea>
          <input type="checkbox" required />
          <span>판매자 이용약관 및 개인정보 수집·이용에 동의합니다.</span>
        </AgreeArea>

        <SubmitButton type="submit">신청하기</SubmitButton>
      </Form>
    </Card>
  );
}

export default SellerApplyForm;

// Select 전용 스타일 추가
const Select = styled.select`
  width: 100%;
  height: 54px;
  border: 1px solid #d6dde2;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  background-color: white;
  &:focus {
    border-color: #4d6c75;
  }
`;

// ... 기존 Styled Components (Input, Label 등) 동일하게 유지

// Styled Components (SignupForm에서 사용된 스타일 재활용)
const Card = styled.section`
  width: 100%;
  max-width: 460px;
  background-color: white;
  border-radius: 28px;
  padding: 48px 42px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 32px;
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
  &:focus {
    border-color: #4d6c75;
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

const SubmitButton = styled.button`
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 12px;
  background-color: #4d6c75;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
