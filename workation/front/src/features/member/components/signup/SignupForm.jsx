import styled from 'styled-components';
import useJoin from '../../hooks/useJoin';
import AddressSearchModal from '../../../../home/components/AddressSearchModal';
import CompanySearchModal from './CompanySearchModal';

function SignupForm() {
  // 💡 커스텀 훅에서 필요한 인터페이스만 구조분해할당으로 깔끔하게 수급받습니다.
  const {
    isSocial,
    vo,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleAddressSelect,
    handleSubmit,
    setPasswordCheck,
    navi,
    isCompanyModalOpen,
    setIsCompanyModalOpen,
    selectedCompanyName,
    handleCompanySelect,
    handleClearCompany, // 💡 추가 수급
  } = useJoin();

  // 🛠️ 내부 서브 컴포넌트 1: 소셜 아바타 프리뷰 존
  const renderSocialAvatar = () => {
    if (!isSocial || !vo.profileImageUrl) return null;
    return (
      <PreviewAvatarZone>
        <img src={vo.profileImageUrl} alt="카카오 프로필 미리보기" />
        <span className="preview-label">카카오 프로필 사진 연동 완료</span>
      </PreviewAvatarZone>
    );
  };

  // 🛠️ 내부 서브 컴포넌트 2: 일반 회원 전용 크리덴셜 입력 필드
  const renderGeneralCredentials = () => {
    if (isSocial) return null;
    return (
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
    );
  };

  return (
    <Card>
      <Title>{isSocial ? '프로필 완성하기' : '계정 만들기'}</Title>
      <SubTitle>
        {isSocial
          ? '안전한 이용을 위해 추가 정보를 입력해주세요!'
          : '모래묻은 키보드에 오신 것을 환영합니다!'}
      </SubTitle>

      <Form onSubmit={handleSubmit}>
        {/* 🚀 소셜 가입자 전용: 카카오톡 프로필 사진 연동 완료 시각적 프리뷰 컴포넌트 탑재 */}
        {isSocial && vo.profileImageUrl && (
          <PreviewAvatarZone>
            <img src={vo.profileImageUrl} alt="카카오 프로필 미리보기" />
            <span className="preview-label">카카오 프로필 사진 연동 완료</span>
          </PreviewAvatarZone>
        )}

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
            disabled={isSocial}
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

        <InputWrapper>
          <Label>소속 기업 (선택)</Label>
          <AddressRow>
            <Input
              type="text"
              placeholder="오른쪽 버튼을 눌러 기업을 검색하세요"
              value={selectedCompanyName}
              readOnly // 💡 유저가 타이핑 오타 내지 못하게 차단
            />
            {selectedCompanyName ? (
              <AddressButton
                type="button"
                style={{ borderColor: '#ef4444', color: '#ef4444' }}
                onClick={handleClearCompany}
              >
                선택 취소
              </AddressButton>
            ) : (
              <AddressButton
                type="button"
                onClick={() => setIsCompanyModalOpen(true)}
              >
                기업 검색
              </AddressButton>
            )}
          </AddressRow>
        </InputWrapper>

        {/* 💡 기업 검색 모달 컴포넌트 하단에 조건부 배치 */}
        {isCompanyModalOpen && (
          <CompanySearchModal
            onClose={() => setIsCompanyModalOpen(false)}
            onSelect={handleCompanySelect}
          />
        )}

        <AgreeArea>
          <input type="checkbox" required />
          <span>이용약관 및 개인정보처리방침에 동의합니다.</span>
        </AgreeArea>

        <SignupButton type="submit">
          {isSocial ? '연동 완료하기' : '가입하기'}
        </SignupButton>
      </Form>

      {!isSocial && (
        <>
          <LoginText>
            이미 계정이 있으신가요?
            <LoginLink onClick={() => navi('/login')}>로그인</LoginLink>
          </LoginText>
        </>
      )}
    </Card>
  );
}

export default SignupForm;

/* ================= styled (새로운 프리뷰 컴포넌트 포함 전체 보존) ================= */

const Card = styled.section`
  width: 100%;
  max-width: 460px;
  background-color: white;
  border-radius: 28px;
  padding: 48px 42px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const PreviewAvatarZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
  padding: 18px;
  background-color: #f8fafc;
  border-radius: 16px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .preview-label {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
  }
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
