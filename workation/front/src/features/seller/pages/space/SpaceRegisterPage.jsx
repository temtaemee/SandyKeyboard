import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { spaceApi } from '../../api/spaceApi';
import SpaceFormStepper from '../../components/space/SpaceFormStepper';
import SpaceFormStep1 from '../../components/space/SpaceFormStep1';
import SpaceFormStep2, { INIT_CATEGORIES } from '../../components/space/SpaceFormStep2';
import SpaceFormStep3 from '../../components/space/SpaceFormStep3';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ACCENT = '#3ec9a7';

const INIT_STEP1 = {
  name: '', phone: '', email: '', summary: '',
  description: '', address1: '', address2: '',
  latitude: '', longitude: '', area: '',
};

function validateStep1(data) {
  const errs = {};

  if (!data.name?.trim()) errs.name = '공간명을 입력하세요';

  if (!data.phone?.trim()) {
    errs.phone = '전화번호를 입력하세요';
  } else {
    const digits = data.phone.replace(/\D/g, '');
    if (!/^\d[\d\-]{6,12}$/.test(data.phone.trim())) {
      errs.phone = '올바른 전화번호를 입력하세요 (예: 02-1234-5678, 010-1234-5678)';
    } else if (digits.length < 9 || digits.length > 11) {
      errs.phone = '전화번호는 9~11자리 숫자여야 합니다';
    }
  }

  if (!data.email?.trim()) {
    errs.email = '이메일을 입력하세요';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errs.email = '올바른 이메일 주소를 입력하세요';
  }

  if (!data.summary?.trim()) errs.summary = '한줄 소개를 입력하세요';
  if (!data.description?.trim()) errs.description = '상세 설명을 입력하세요';

  // 주소: 검색 버튼으로 주소를 선택해야 좌표가 세팅됨
  if (!data.address1?.trim()) {
    errs.address1 = '주소 검색 버튼으로 주소를 검색해주세요';
  } else if (!data.latitude || !data.longitude) {
    errs.address1 = '주소 검색 버튼으로 주소를 다시 검색해주세요 (좌표 미확인)';
  }

  if (!data.area) errs.area = '지역을 선택하세요';
  return errs;
}

export default function SpaceRegisterPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(INIT_STEP1);
  const [step2Categories, setStep2Categories] = useState(INIT_CATEGORIES);
  const [step2MainPhoto, setStep2MainPhoto] = useState(null); // { categoryKey, fileIdx }
  const [step3Arcades, setStep3Arcades] = useState([]);
  const [step1Errors, setStep1Errors] = useState({});
  const [step2Error, setStep2Error] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const submitErrorRef = useRef(null);

  const handleStep1Change = (field, value) => {
    setStep1Data((prev) => ({ ...prev, [field]: value }));
    if (step1Errors[field]) {
      setStep1Errors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const goToStep2 = () => {
    const errs = validateStep1(step1Data);
    if (Object.keys(errs).length > 0) {
      setStep1Errors(errs);
      return;
    }
    setStep(2);
  };

  const goToStep3 = () => {
    const totalFiles = step2Categories.reduce((sum, cat) => sum + cat.files.length, 0);
    if (totalFiles === 0) {
      setStep2Error('사진을 1장 이상 등록해주세요');
      return;
    }
    setStep2Error(null);
    setStep(3);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // 카테고리 순서대로 flat 변환 + mainPhoto 반영
      const allFiles = [];
      const pictureList = [];
      step2Categories.forEach((cat) => {
        cat.files.forEach((file, fileIdx) => {
          const isMain =
            step2MainPhoto?.categoryKey === cat.key && step2MainPhoto?.fileIdx === fileIdx;
          allFiles.push(file);
          pictureList.push({
            mainYn: isMain ? 'Y' : 'N',
            sortOrder: allFiles.length - 1,
            category: cat.key,
          });
        });
      });
      // 대표 미지정 시 첫 번째 사진을 대표로
      if (pictureList.length > 0 && !pictureList.some((p) => p.mainYn === 'Y')) {
        pictureList[0].mainYn = 'Y';
      }

      const dto = {
        name: step1Data.name.trim(),
        phone: step1Data.phone.trim(),
        email: step1Data.email.trim(),
        summary: step1Data.summary.trim(),
        description: step1Data.description.trim(),
        address1: step1Data.address1.trim(),
        address2: step1Data.address2?.trim() || null,
        latitude: step1Data.latitude ? parseFloat(step1Data.latitude) : null,
        longitude: step1Data.longitude ? parseFloat(step1Data.longitude) : null,
        area: step1Data.area,
        arcadeIdList: step3Arcades,
        pictureList,
      };

      const formData = new FormData();
      formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      allFiles.forEach((file) => formData.append('files', file));

      const res = await spaceApi.create(formData);
      const newId = res.data;
      await spaceApi.requestApproval(newId).catch(() => {});
      navigate(`/seller/spaces/${newId}`);
    } catch (e) {
      const data = e.response?.data;
      // 서버 필드 에러가 있으면 Step1 에러로 매핑 후 Step1으로 이동
      if (data?.errors?.length > 0) {
        const serverErrs = {};
        data.errors.forEach(({ field, reason }) => { serverErrs[field] = reason; });
        setStep1Errors(serverErrs);
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const msg = data?.message ?? '공간 등록에 실패했습니다. 다시 시도해 주세요.';
        setSubmitError(msg);
        setTimeout(() => submitErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrap>
      {/* 헤더 */}
      <TopBar>
        <BackBtn
          type="button"
          onClick={() => (step > 1 ? setStep(step - 1) : navigate('/seller/spaces'))}
        >
          <ArrowLeft size={18} />
          {step > 1 ? '이전 단계' : '공간 목록'}
        </BackBtn>
        <TitleGroup>
          <PageTitle>공간 등록</PageTitle>
          <PageSub>3단계를 완료하면 공간이 등록됩니다</PageSub>
        </TitleGroup>
      </TopBar>

      {/* 스테퍼 */}
      <SpaceFormStepper currentStep={step} />

      {/* 폼 카드 */}
      <FormCard>
        {step === 1 && (
          <>
            <StepHeading>기본정보 입력</StepHeading>
            <SpaceFormStep1
              data={step1Data}
              onChange={handleStep1Change}
              errors={step1Errors}
            />
            <BtnRow>
              <NextBtn type="button" onClick={goToStep2}>
                다음 단계 &rarr;
              </NextBtn>
            </BtnRow>
          </>
        )}

        {step === 2 && (
          <>
            <StepHeading>사진 등록</StepHeading>
            <SpaceFormStep2
              categories={step2Categories}
              mainPhoto={step2MainPhoto}
              onCategoriesChange={(cats) => { setStep2Categories(cats); setStep2Error(null); }}
              onMainPhotoChange={setStep2MainPhoto}
            />
            {step2Error && <StepError>{step2Error}</StepError>}
            <BtnRow>
              <PrevBtn type="button" onClick={() => setStep(1)}>
                &larr; 이전
              </PrevBtn>
              <NextBtn type="button" onClick={goToStep3}>
                다음 단계 &rarr;
              </NextBtn>
            </BtnRow>
          </>
        )}

        {step === 3 && (
          <>
            <StepHeading>편의시설 선택</StepHeading>
            <SpaceFormStep3 arcadeIdList={step3Arcades} onChange={setStep3Arcades} />

            {submitError && <SubmitError ref={submitErrorRef}>⚠ {submitError}</SubmitError>}

            <BtnRow>
              <PrevBtn type="button" onClick={() => setStep(2)} disabled={submitting}>
                &larr; 이전
              </PrevBtn>
              <SubmitBtn type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <LoadingSpinner size="sm" /> : '등록 완료'}
              </SubmitBtn>
            </BtnRow>
          </>
        )}
      </FormCard>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 8px;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.adminTextDark}; }
  white-space: nowrap;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const PageSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FormCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StepHeading = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const BtnRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
`;

const PrevBtn = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMid};
  background: white;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const NextBtn = styled.button`
  margin-left: auto;
  padding: 10px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${ACCENT};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #31b08e; }
`;

const SubmitBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${ACCENT};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const StepError = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  border-radius: 8px;
`;

const SubmitError = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  padding: 14px 18px;
  border-radius: 8px;
  line-height: 1.5;
`;
