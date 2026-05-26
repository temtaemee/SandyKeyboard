import { useState, useEffect } from 'react'; // 💡 useEffect 추가
import { useSearchParams } from 'react-router-dom'; // 💡 쿼리 스트링 파싱용 추가
import styled from 'styled-components';
import useJoin from '../../hooks/useJoin';
import AddressSearchModal from '../../../../home/components/AddressSearchModal';
import api from '../../../../app/api/axios';

function SignupForm() {
  const { fetchJoin, navi } = useJoin();
  // 💡 주소창의 ?type=social&email=xxx 값을 읽어오기 위한 훅
  const [searchParams] = useSearchParams();
  const isSocial = searchParams.get('type') === 'social';
  const socialEmail = searchParams.get('email') || '';

  const [vo, setVo] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    preferredArea: '',
    zonecode: '',
    address: '',
    addressDetail: '',
  });

  const [passwordCheck, setPasswordCheck] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💡 소셜 로그인으로 강제 이동해온 경우, 이메일과 유저네임을 미리 주입해줍니다.
  useEffect(() => {
    if (isSocial && socialEmail) {
      setVo((prev) => ({
        ...prev,
        username: socialEmail, // 백엔드 username 컬럼에 이메일 저장 규격 매칭
        email: socialEmail,
        password: 'SOCIAL_AUTHENTICATED_BY_NAVER', // 백엔드 필수 제약 조건 통과용 더미 값
      }));
      setPasswordCheck('SOCIAL_AUTHENTICATED_BY_NAVER');
    }
  }, [isSocial, socialEmail]);

  function handleChange(e) {
    const { name, value } = e.target;
    setVo((prev) => ({ ...prev, [name]: value }));
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
    if (isSocial) {
      // 🟩 소셜 유저라면 비밀번호 검증을 패스하고 전용 API로 발송!
      try {
        await api.post('/guest/social-join', vo);
        alert(
          '회원가입이 완료되었습니다! 다시 한번 네이버 로그인을 진행해주세요.'
        );
        navi('/login');
      } catch (error) {
        console.error(error);
        alert('소셜 회원정보 저장 중 오류가 발생했습니다.');
      }
    } else {
      // ⬜️ 일반 유저 가입 로직 기존 유지
      if (vo.password !== passwordCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      await fetchJoin(vo);
    }
  }

  return (
    <Card>
      <Title>{isSocial ? '프로필 완성하기' : '계정 만들기'}</Title>
      <SubTitle>
        {isSocial
          ? '안전한 거래를 위해 추가 정보를 입력해주세요!'
          : '모래묻은 키보드에 오신 것을 환영합니다!'}
      </SubTitle>

      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>이름</Label>
          <Input
            type="text"
            name="name"
            value={vo.name}
            placeholder="홍길동"
            onChange={handleChange}
            required
          />
        </InputWrapper>

        {/* 🚨 소셜 가입 모드가 아닐 때만 아이디/비밀번호 칸을 보여줍니다! */}
        {!isSocial && (
          <>
            <InputWrapper>
              <Label>아이디</Label>
              <Input
                type="text"
                name="username"
                value={vo.username}
                placeholder="ID입력"
                onChange={handleChange}
                required
              />
            </InputWrapper>

            <InputWrapper>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </InputWrapper>

            <InputWrapper>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                name="password2"
                placeholder="••••••••"
                onChange={(e) => setPasswordCheck(e.target.value)}
                required
              />
            </InputWrapper>
          </>
        )}

        <InputWrapper>
          <Label>연락처</Label>
          <Input
            type="number"
            name="phone"
            value={vo.phone}
            placeholder="숫자만 입력"
            onChange={handleChange}
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Label>이메일</Label>
          <Input
            type="email"
            name="email"
            value={vo.email}
            placeholder="example@naver.com"
            onChange={handleChange}
            disabled={isSocial} // 소셜 계정은 이메일 수정 불가 처리
            required
          />
        </InputWrapper>

        <InputWrapper>
          <Label>주소</Label>
          <AddressRow>
            <Input
              type="text"
              name="zonecode"
              value={vo.zonecode}
              placeholder="우편번호"
              readOnly
              required
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
            required
          />
          <Input
            type="text"
            name="addressDetail"
            value={vo.addressDetail}
            placeholder="상세 주소를 입력하세요"
            onChange={handleChange}
            style={{ marginTop: '10px' }}
            required
          />
        </InputWrapper>

        {isModalOpen && (
          <AddressSearchModal
            onClose={() => setIsModalOpen(false)}
            onSelect={handleAddressSelect}
          />
        )}

        <InputWrapper>
          <Label>선호 지역</Label>
          <Select
            name="preferredArea"
            value={vo.preferredArea}
            onChange={handleChange}
            required
          >
            <option value="">지역 선택</option>
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
        </InputWrapper>

        <AgreeArea>
          <input type="checkbox" required />
          <span>이용약관 및 개인정보처리방침에 동의합니다.</span>
        </AgreeArea>

        <SignupButton type="submit">
          {isSocial ? '연동 완료하기' : '가입하기'}
        </SignupButton>
      </Form>

      {/* 소셜 가입자에게 하단 간편로그인 유도는 불필요하므로 숨김 */}
      {!isSocial && (
        <>
          <LoginText>
            이미 계정이 있으신가요?
            <LoginLink onClick={() => navi('/login')}>로그인</LoginLink>
          </LoginText>
          <Divider>
            <span>간편 가입</span>
          </Divider>
          <SocialArea>
            <SocialButton type="button">🟨</SocialButton>
            <SocialButton type="button">🔵</SocialButton>
          </SocialArea>
        </>
      )}
    </Card>
  );
}

export default SignupForm;

// 이하 스타일 코드는 기존과 완벽히 동일하므로 생략합니다.

const Card = styled.section`
  width: 100%;
  max-width: 460px;

  background-color: white;

  border-radius: 28px;

  padding: 48px 42px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;
const Select = styled.select`
  width: 100%;
  height: 54px;

  border: 1px solid #d6dde2;
  border-radius: 12px;

  padding: 0 16px;

  font-size: 14px;

  outline: none;

  background-color: white;

  transition: 0.2s;

  &:focus {
    border-color: #4d6c75;
  }
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
const AddressRow = styled.div`
  display: flex;
  gap: 10px;
`;

const AddressButton = styled.button`
  width: 120px;
  height: 54px;
  border: 1px solid #4d6c75;
  border-radius: 12px;
  background-color: transparent;
  color: #4d6c75;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s;

  &:hover {
    background-color: #f4f7f8;
  }
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
