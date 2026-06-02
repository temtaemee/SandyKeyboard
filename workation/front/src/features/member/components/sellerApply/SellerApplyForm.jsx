import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axios';

function SellerApplyForm() {
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({
    businessNumber: '',
    companyName: '',
    accountNumber: '',
    bankId: '',
    accountHolder: '',
  });

  // 1. 은행 목록 로드
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        // interceptor가 토큰을 자동으로 실어주므로 경로만 호출
        const res = await api.get('/user/banks');
        setBanks(res.data);
      } catch (err) {
        console.error('은행 목록 로딩 실패:', err);
      }
    };
    fetchBanks();
  }, []);

  // 2. 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. 신청 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessNumRegex = /^[0-9]{10}$/;
    if (!businessNumRegex.test(formData.businessNumber)) {
      alert('사업자 등록번호 10자리를 정확히 입력해주세요. (숫자만 입력)');
      return; // 🚀 여기서 차단하여 백엔드로 허수 데이터가 가는 것을 방지!
    }

    try {
      // 주소 중복을 피하기 위해 baseURL 이후의 경로만 작성
      const response = await api.post('/user/seller', formData);

      if (response.status === 201) {
        alert('판매자 신청이 완료되었습니다!');
        navigate('/mypage'); // 마이페이지 등으로 리다이렉트
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '신청 중 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

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
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Label>사업자 등록번호</Label>
          <Input
            name="businessNumber"
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="'-' 제외하고 숫자 10자리만 입력 (법인번호 X)"
            onChange={handleChange}
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Label>정산 은행</Label>
          <Select name="bankId" onChange={handleChange} required>
            <option value="">은행을 선택해주세요</option>
            {banks.map((bank) => (
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
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Label>예금주</Label>
          <Input
            name="accountHolder"
            placeholder="성함을 입력하세요"
            onChange={handleChange}
            required
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

/* ── Styled Components ── */
// 스타일 코드는 기존과 동일하되, Select와 Input의 중복 스타일은
// 나중에 공통 컴포넌트로 빼면 더 좋습니다.

const Card = styled.section`
  width: 100%;
  max-width: 460px;
  background-color: white;
  border-radius: 28px;
  padding: 48px 42px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin: 0 auto;
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

const commonInputStyle = `
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

const Input = styled.input`
  ${commonInputStyle}
`;
const Select = styled.select`
  ${commonInputStyle}
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
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;
