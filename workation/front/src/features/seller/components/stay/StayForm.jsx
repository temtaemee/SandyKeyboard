import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, X } from 'lucide-react';
import PriceWeekGrid from './PriceWeekGrid';
import OptionSelector from './OptionSelector';
import ExtraPriceForm from './ExtraPriceForm';
import LoadingSpinner from '../common/LoadingSpinner';

const ACCENT = '#3ec9a7';

const INIT_PRICES = {
  monPrice: '',
  tuePrice: '',
  wedPrice: '',
  thuPrice: '',
  friPrice: '',
  satPrice: '',
  sunPrice: '',
  holidayPrice: '',
};

function validate(data) {
  const errs = {};
  if (data.mode === 'create' && !data.spaceId) errs.spaceId = '공간을 선택하세요';
  if (!data.name?.trim()) errs.name = '스테이명을 입력하세요';
  if (!data.summary?.trim()) errs.summary = '한줄 소개를 입력하세요';
  if (!data.description?.trim()) errs.description = '상세 설명을 입력하세요';
  if (!data.capacity || Number(data.capacity) < 1) errs.capacity = '기본 인원(1명 이상)을 입력하세요';
  if (!data.maxCapa || Number(data.maxCapa) < 1) errs.maxCapa = '최대 인원(1명 이상)을 입력하세요';
  if (Number(data.maxCapa) < Number(data.capacity)) {
    errs.maxCapa = '최대 인원은 기본 인원 이상이어야 합니다';
  }
  if (!data.checkInTime) errs.checkInTime = '체크인 시간을 입력하세요';
  if (!data.checkOutTime) errs.checkOutTime = '체크아웃 시간을 입력하세요';
  const priceKeys = ['monPrice', 'tuePrice', 'wedPrice', 'thuPrice', 'friPrice', 'satPrice', 'sunPrice', 'holidayPrice'];
  priceKeys.forEach((k) => {
    if (data[k] === '' || data[k] == null) {
      errs[k] = '필수';
    }
  });
  return errs;
}

/**
 * 스테이 등록/수정 공통 폼
 * @param {object} initialData 초기 데이터 (수정 시 기존 값)
 * @param {array} spaces SpaceResDto[] (드롭다운용, create 모드에서 사용)
 * @param {function} onSubmit (formData: FormData | dto, files: File[]) => void
 * @param {boolean} loading
 * @param {'create'|'edit'} mode
 */
export default function StayForm({
  initialData = {},
  spaces = [],
  onSubmit,
  loading = false,
  mode = 'create',
}) {
  const fileInputRef = useRef(null);

  const [data, setData] = useState({
    spaceId: initialData.spaceId ?? '',
    name: initialData.name ?? '',
    summary: initialData.summary ?? '',
    description: initialData.description ?? '',
    capacity: initialData.capacity ?? '',
    maxCapa: initialData.maxCapa ?? '',
    checkInTime: initialData.checkInTime?.slice(0, 5) ?? '', // "HH:mm:ss" → "HH:mm"
    checkOutTime: initialData.checkOutTime?.slice(0, 5) ?? '',
    workationYn: initialData.workationYn ?? 'N',
    monPrice: initialData.monPrice ?? '',
    tuePrice: initialData.tuePrice ?? '',
    wedPrice: initialData.wedPrice ?? '',
    thuPrice: initialData.thuPrice ?? '',
    friPrice: initialData.friPrice ?? '',
    satPrice: initialData.satPrice ?? '',
    sunPrice: initialData.sunPrice ?? '',
    holidayPrice: initialData.holidayPrice ?? '',
    optionList: initialData.options ?? initialData.optionList ?? [],
    extraPriceList: initialData.extraPriceList ?? [],
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = '';
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate({ ...data, mode });
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // 첫 번째 에러로 스크롤
      const firstErrEl = document.querySelector('[data-error-field]');
      firstErrEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const dto = {
      ...(mode === 'create' && { spaceId: Number(data.spaceId) }),
      name: data.name.trim(),
      summary: data.summary.trim(),
      description: data.description.trim(),
      capacity: Number(data.capacity),
      maxCapa: Number(data.maxCapa),
      checkInTime: data.checkInTime + ':00',  // "HH:mm" → "HH:mm:ss"
      checkOutTime: data.checkOutTime + ':00',
      workationYn: data.workationYn,
      monPrice: Number(data.monPrice),
      tuePrice: Number(data.tuePrice),
      wedPrice: Number(data.wedPrice),
      thuPrice: Number(data.thuPrice),
      friPrice: Number(data.friPrice),
      satPrice: Number(data.satPrice),
      sunPrice: Number(data.sunPrice),
      holidayPrice: Number(data.holidayPrice),
      optionList: data.optionList,
      extraPriceList: data.extraPriceList
        .filter((ep) => ep.startDate && ep.endDate)
        .map((ep) => ({
          startDate: ep.startDate + 'T00:00:00',
          endDate: ep.endDate + 'T00:00:00',
          monPrice: Number(ep.monPrice) || 0,
          tuePrice: Number(ep.tuePrice) || 0,
          wedPrice: Number(ep.wedPrice) || 0,
          thuPrice: Number(ep.thuPrice) || 0,
          friPrice: Number(ep.friPrice) || 0,
          satPrice: Number(ep.satPrice) || 0,
          sunPrice: Number(ep.sunPrice) || 0,
          holidayPrice: Number(ep.holidayPrice) || 0,
        })),
    };

    onSubmit(dto, files);
  };

  const priceErrors = ['monPrice', 'tuePrice', 'wedPrice', 'thuPrice', 'friPrice', 'satPrice', 'sunPrice', 'holidayPrice'];
  const hasPriceError = priceErrors.some((k) => !!errors[k]);

  return (
    <Form onSubmit={handleSubmit}>
      {/* Section 1: 기본정보 */}
      <Section>
        <SectionTitle>기본정보</SectionTitle>

        {mode === 'create' && (
          <Field data-error-field="spaceId">
            <Label>공간 선택 <Req>*</Req></Label>
            <Select
              value={data.spaceId}
              onChange={(e) => set('spaceId', e.target.value)}
              $error={!!errors.spaceId}
            >
              <option value="">공간을 선택하세요</option>
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>
            {errors.spaceId && <ErrorMsg>{errors.spaceId}</ErrorMsg>}
          </Field>
        )}

        {mode === 'edit' && (
          <InfoBox>
            <InfoLabel>소속 공간</InfoLabel>
            <InfoValue>
              {spaces.find((s) => s.id === initialData.spaceId)?.name
                ?? `공간 #${initialData.spaceId}`}
              <InfoNote>(수정 불가)</InfoNote>
            </InfoValue>
          </InfoBox>
        )}

        <Field data-error-field="name">
          <Label>스테이명 <Req>*</Req></Label>
          <Input
            value={data.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="스테이 이름"
            $error={!!errors.name}
          />
          {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
        </Field>

        <Field data-error-field="summary">
          <Label>한줄 소개 <Req>*</Req></Label>
          <Input
            value={data.summary}
            onChange={(e) => set('summary', e.target.value)}
            placeholder="스테이를 한 문장으로 소개해주세요"
            maxLength={255}
            $error={!!errors.summary}
          />
          {errors.summary && <ErrorMsg>{errors.summary}</ErrorMsg>}
        </Field>

        <Field data-error-field="description">
          <Label>상세 설명 <Req>*</Req></Label>
          <Textarea
            value={data.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="스테이 상세 설명"
            rows={4}
            $error={!!errors.description}
          />
          {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
        </Field>

        <Field>
          <Label>워케이션 여부 <Req>*</Req></Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                value="Y"
                checked={data.workationYn === 'Y'}
                onChange={() => set('workationYn', 'Y')}
              />
              워케이션 패키지
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                value="N"
                checked={data.workationYn === 'N'}
                onChange={() => set('workationYn', 'N')}
              />
              일반 숙박
            </RadioLabel>
          </RadioGroup>
        </Field>
      </Section>

      {/* Section 2: 인원 */}
      <Section>
        <SectionTitle>인원 설정</SectionTitle>
        <Row>
          <Field data-error-field="capacity">
            <Label>기본 인원 <Req>*</Req></Label>
            <Input
              type="number"
              min={1}
              value={data.capacity}
              onChange={(e) => set('capacity', e.target.value)}
              placeholder="기본 인원수"
              $error={!!errors.capacity}
            />
            {errors.capacity && <ErrorMsg>{errors.capacity}</ErrorMsg>}
          </Field>
          <Field data-error-field="maxCapa">
            <Label>최대 인원 <Req>*</Req></Label>
            <Input
              type="number"
              min={1}
              value={data.maxCapa}
              onChange={(e) => set('maxCapa', e.target.value)}
              placeholder="최대 수용 인원"
              $error={!!errors.maxCapa}
            />
            {errors.maxCapa && <ErrorMsg>{errors.maxCapa}</ErrorMsg>}
          </Field>
        </Row>
      </Section>

      {/* Section 3: 요일별 단가 */}
      <Section>
        <SectionTitle>요일별 단가 <Req>*</Req></SectionTitle>
        {hasPriceError && (
          <ErrorMsg>모든 요일 단가를 입력하세요</ErrorMsg>
        )}
        <PriceWeekGrid
          prices={{
            monPrice: data.monPrice,
            tuePrice: data.tuePrice,
            wedPrice: data.wedPrice,
            thuPrice: data.thuPrice,
            friPrice: data.friPrice,
            satPrice: data.satPrice,
            sunPrice: data.sunPrice,
            holidayPrice: data.holidayPrice,
          }}
          onChange={(key, value) => set(key, value)}
        />
      </Section>

      {/* Section 4: 체크인/아웃 */}
      <Section>
        <SectionTitle>체크인 / 체크아웃 시간</SectionTitle>
        <Row>
          <Field data-error-field="checkInTime">
            <Label>체크인 시간 <Req>*</Req></Label>
            <Input
              type="time"
              value={data.checkInTime}
              onChange={(e) => set('checkInTime', e.target.value)}
              $error={!!errors.checkInTime}
            />
            {errors.checkInTime && <ErrorMsg>{errors.checkInTime}</ErrorMsg>}
          </Field>
          <Field data-error-field="checkOutTime">
            <Label>체크아웃 시간 <Req>*</Req></Label>
            <Input
              type="time"
              value={data.checkOutTime}
              onChange={(e) => set('checkOutTime', e.target.value)}
              $error={!!errors.checkOutTime}
            />
            {errors.checkOutTime && <ErrorMsg>{errors.checkOutTime}</ErrorMsg>}
          </Field>
        </Row>
      </Section>

      {/* Section 5: 옵션 */}
      <Section>
        <SectionTitle>편의 옵션 <Optional>(선택)</Optional></SectionTitle>
        <OptionSelector
          selected={data.optionList}
          onChange={(opts) => set('optionList', opts)}
        />
      </Section>

      {/* Section 6: 사진 */}
      <Section>
        <SectionTitle>사진 등록 <Optional>(선택)</Optional></SectionTitle>
        <DropZone onClick={() => fileInputRef.current?.click()}>
          <Upload size={24} color="#94a3b8" />
          <DropText>클릭하여 사진 선택</DropText>
          <DropSub>JPG, PNG, WebP · 여러 장 선택 가능</DropSub>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </DropZone>

        {files.length > 0 && (
          <PreviewGrid>
            {files.map((file, idx) => (
              <PreviewItem key={`${file.name}-${idx}`}>
                <PreviewImg src={URL.createObjectURL(file)} alt={file.name} />
                {idx === 0 && <MainTag>대표</MainTag>}
                <RemoveBtn type="button" onClick={() => removeFile(idx)}>
                  <X size={11} />
                </RemoveBtn>
              </PreviewItem>
            ))}
          </PreviewGrid>
        )}
      </Section>

      {/* Section 7: 특별 단가 */}
      <Section>
        <ExtraPriceForm
          extraPriceList={data.extraPriceList}
          onChange={(list) => set('extraPriceList', list)}
        />
      </Section>

      {/* 제출 버튼 */}
      <SubmitRow>
        <SubmitBtn type="submit" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : (mode === 'create' ? '스테이 등록' : '수정 완료')}
        </SubmitBtn>
      </SubmitRow>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  & > * { flex: 1; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const Req = styled.span`
  color: #ef4444;
  margin-left: 2px;
`;

const Optional = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: 4px;
`;

const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }
`;

const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
`;

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#ef4444' : theme.colors.border)};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  outline: none;
  resize: vertical;
  line-height: 1.6;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  cursor: pointer;
  input { cursor: pointer; accent-color: ${ACCENT}; }
`;

const ErrorMsg = styled.p`
  font-size: 12px;
  color: #ef4444;
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const InfoLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoNote = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 400;
`;

const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 24px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    border-color: ${ACCENT};
    background: rgba(62, 201, 167, 0.03);
  }
`;

const DropText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const DropSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

const PreviewItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
`;

const MainTag = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background: ${ACCENT};
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #ef4444; }
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: ${ACCENT};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
