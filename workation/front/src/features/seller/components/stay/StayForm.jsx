import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Upload, X, Star, ZoomIn, GripVertical } from 'lucide-react';
import PriceWeekGrid from './PriceWeekGrid';
import OptionSelector from './OptionSelector';
import ExtraPriceForm from './ExtraPriceForm';
import LoadingSpinner from '../common/LoadingSpinner';
import { resolveSellerImageUrl } from '../../utils/imageUrl';

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
  if (!['Y', 'N'].includes(data.workationYn)) errs.workationYn = '워케이션 여부를 선택하세요';
  const priceKeys = ['monPrice', 'tuePrice', 'wedPrice', 'thuPrice', 'friPrice', 'satPrice', 'sunPrice', 'holidayPrice'];
  priceKeys.forEach((k) => {
    if (data[k] === '' || data[k] == null) {
      errs[k] = '단가를 입력하세요';
    } else if (Number(data[k]) <= 0) {
      errs[k] = '1원 이상 입력하세요';
    }
  });

  // 특별 단가 검증
  const extras = data.extraPriceList ?? [];
  extras.forEach((ep, i) => {
    if (!ep.startDate && !ep.endDate) return; // 빈 항목 무시
    if (!ep.startDate) errs[`extra_${i}_date`] = `#${i + 1}: 시작일을 입력하세요`;
    else if (!ep.endDate) errs[`extra_${i}_date`] = `#${i + 1}: 종료일을 입력하세요`;
    else if (ep.startDate > ep.endDate) errs[`extra_${i}_date`] = `#${i + 1}: 시작일이 종료일보다 늦습니다`;
  });

  // 특별 단가 기간 겹침 체크
  const validExtras = extras
    .map((ep, i) => ({ ...ep, _i: i }))
    .filter(ep => ep.startDate && ep.endDate && ep.startDate <= ep.endDate);
  outer: for (let i = 0; i < validExtras.length; i++) {
    for (let j = i + 1; j < validExtras.length; j++) {
      const a = validExtras[i], b = validExtras[j];
      if (a.startDate <= b.endDate && b.startDate <= a.endDate) {
        errs[`extra_${a._i}_date`] = `#${a._i + 1} 기간이 #${b._i + 1}과 겹칩니다`;
        errs[`extra_${b._i}_date`] = `#${b._i + 1} 기간이 #${a._i + 1}과 겹칩니다`;
        break outer;
      }
    }
  }

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
  const dragIdx      = useRef(null);

  const MAX_PHOTOS = 50;

  // 통합 사진 state — create: 빈 배열, edit: 기존 사진으로 초기화
  const [photos, setPhotos] = useState(() =>
    (initialData?.pictures ?? []).map(p => ({
      type: 'existing',
      id: p.id,
      previewUrl: resolveSellerImageUrl(p.filePath),
      isMain: p.mainYn === 'Y',
    }))
  );
  const [dragOver, setDragOver] = useState(null);
  const [preview, setPreview]   = useState(null);

  const handleDragStart = (idx) => { dragIdx.current = idx; };
  const handleDragOver  = (e, idx) => { e.preventDefault(); setDragOver(idx); };
  const handleDrop      = (idx) => {
    if (dragIdx.current === null || dragIdx.current === idx) { setDragOver(null); return; }
    setPhotos(prev => {
      const arr = [...prev];
      const [removed] = arr.splice(dragIdx.current, 1);
      arr.splice(idx, 0, removed);
      return arr;
    });
    dragIdx.current = null; setDragOver(null);
  };
  const handleDragEnd = () => { dragIdx.current = null; setDragOver(null); };

  const handleAddPhotos = (fileList) => {
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) { alert('사진은 최대 50장까지 등록할 수 있습니다.'); return; }
    const toAdd = Array.from(fileList).slice(0, remaining);
    if (fileList.length > remaining) alert(`최대 ${MAX_PHOTOS}장까지 등록할 수 있습니다. ${remaining}장만 추가되었습니다.`);
    setPhotos(prev => [...prev, ...toAdd.map(file => ({
      type: 'new',
      tempId: `new-${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      isMain: false,
    }))]);
  };

  const picturesChanged = () => {
    const origPics = initialData?.pictures ?? [];
    const origMainId = origPics.find(p => p.mainYn === 'Y')?.id ?? null;
    const existingPhotos = photos.filter(p => p.type === 'existing');
    const newPhotos = photos.filter(p => p.type === 'new');
    const mainPhoto = photos.find(p => p.isMain);
    const currentMainId = mainPhoto?.type === 'existing' ? mainPhoto.id : null;
    return (
      origPics.some(p => !existingPhotos.find(ep => ep.id === p.id)) ||
      newPhotos.length > 0 ||
      currentMainId !== origMainId || (!!mainPhoto && mainPhoto.type === 'new') ||
      existingPhotos.some((p, idx) => origPics.findIndex(op => op.id === p.id) !== idx)
    );
  };

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
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate({ ...data, mode });
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrKey = Object.keys(errs)[0];
      const firstErrEl = document.querySelector(`[data-error-field="${firstErrKey}"]`);
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

    const existingPhotos = photos.filter(p => p.type === 'existing');
    const newPhotos = photos.filter(p => p.type === 'new');
    const mainPhoto = photos.find(p => p.isMain);

    let pictureChanges = null;
    if (mode === 'edit' && picturesChanged()) {
      pictureChanges = {
        keepPictureIds: existingPhotos.map(p => p.id),
        mainPictureId: mainPhoto?.type === 'existing' ? mainPhoto.id : null,
        newPictures: newPhotos.map(p => ({ mainYn: p.isMain ? 'Y' : 'N' })),
        newFiles: newPhotos.map(p => p.file),
      };
    }

    // create 모드: 모든 사진이 new
    const allNewFiles = mode === 'create' ? newPhotos.map(p => p.file) : [];
    onSubmit(dto, allNewFiles, pictureChanges);
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
              {spaces.filter(s => s.approvalStatus === 'APPROVED').map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
              {spaces.some(s => s.approvalStatus !== 'APPROVED') && (
                <option disabled>── 승인 대기/반려된 공간 (등록 불가) ──</option>
              )}
              {spaces.filter(s => s.approvalStatus !== 'APPROVED').map((s) => (
                <option key={s.id} value={s.id} disabled>
                  {s.name} ({s.approvalStatus === 'PENDING' ? '승인 대기중' : '반려됨'})
                </option>
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
          {errors.workationYn && <ErrorMsg>{errors.workationYn}</ErrorMsg>}
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
      <Section data-error-field="monPrice">
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
        <SectionTitle>사진 {mode === 'edit' ? '관리' : '등록'} <Optional>(선택)</Optional></SectionTitle>

        {/* 통합 사진 리스트 */}
        {photos.length > 0 && (
          <>
            <PicSubLabel>사진 ({photos.length}장 / 최대 {MAX_PHOTOS}장) — 드래그하여 순서 변경</PicSubLabel>
            <ExistingGrid>
              {photos.map((photo, idx) => {
                const key = photo.type === 'existing' ? photo.id : photo.tempId;
                return (
                  <ExistingItem
                    key={key}
                    $main={photo.isMain}
                    $dragOver={dragOver === idx}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={() => handleDrop(idx)}
                    onDragEnd={handleDragEnd}
                  >
                    <DragHandle><GripVertical size={11} /><span>{idx + 1}</span></DragHandle>
                    <ExistingThumbBtn type="button" onClick={() => setPreview({ src: photo.previewUrl, idx })}>
                      <ExistingImg src={photo.previewUrl} alt="" onError={e => { e.target.style.display = 'none'; }} />
                      <ZoomOverlay><ZoomIn size={13} color="white" /></ZoomOverlay>
                      {photo.isMain && <MainPinBadge>대표</MainPinBadge>}
                      {photo.type === 'new' && <NewPinBadge>NEW</NewPinBadge>}
                    </ExistingThumbBtn>
                    <ExistingMeta>
                      <StarBtn type="button" $active={photo.isMain}
                        onClick={() => setPhotos(prev => prev.map((p, i) => ({ ...p, isMain: i === idx ? !photo.isMain : false })))}>
                        <Star size={12} fill={photo.isMain ? '#f59e0b' : 'none'} />
                      </StarBtn>
                      <DelBtn type="button" onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}>
                        <X size={12} />
                      </DelBtn>
                    </ExistingMeta>
                  </ExistingItem>
                );
              })}
            </ExistingGrid>
          </>
        )}

        {/* 사진 추가 드롭존 */}
        {photos.length < MAX_PHOTOS && (
          <DropZone onClick={() => fileInputRef.current?.click()}>
            <Upload size={24} color="#94a3b8" />
            <DropText>클릭하여 사진 선택</DropText>
            <DropSub>JPG, PNG, WebP · 여러 장 선택 가능</DropSub>
            <input ref={fileInputRef} type="file" accept="image/*" multiple
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files?.length) handleAddPhotos(e.target.files); e.target.value = ''; }}
            />
          </DropZone>
        )}
      </Section>

      {/* 미리보기 모달 */}
      {preview && (
        <PreviewBg onClick={() => setPreview(null)}>
          <PreviewBox onClick={e => e.stopPropagation()}>
            <PreviewTopRight>
              <PreviewStarBtn type="button"
                $active={photos[preview.idx]?.isMain}
                onClick={() => setPhotos(prev => prev.map((p, i) => ({ ...p, isMain: i === preview.idx ? !p.isMain : false })))}>
                <Star size={15}
                  fill={photos[preview.idx]?.isMain ? '#f59e0b' : 'none'}
                  color={photos[preview.idx]?.isMain ? '#f59e0b' : 'white'} />
              </PreviewStarBtn>
              <PreviewCloseBtn type="button" onClick={() => setPreview(null)}><X size={15} /></PreviewCloseBtn>
            </PreviewTopRight>
            <PreviewBigImg src={preview.src} alt="" />
            <PreviewBottom>
              <PreviewOrderWrap>
                <span>{preview.idx + 1} / {photos.length}</span>
                <PreviewOrderInput
                  key={`preview-${preview.idx}`}
                  type="number" min={1} max={photos.length}
                  defaultValue={preview.idx + 1}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value);
                    const toIdx = Math.max(0, Math.min(photos.length - 1, val - 1));
                    if (toIdx === preview.idx) return;
                    setPhotos(prev => {
                      const arr = [...prev];
                      const [r] = arr.splice(preview.idx, 1);
                      arr.splice(toIdx, 0, r);
                      return arr;
                    });
                    setPreview(prev => ({ ...prev, idx: toIdx }));
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
                />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>번으로 이동</span>
              </PreviewOrderWrap>
            </PreviewBottom>
          </PreviewBox>
        </PreviewBg>
      )}

      {/* Section 7: 특별 단가 */}
      <Section>
        <ExtraPriceForm
          extraPriceList={data.extraPriceList}
          onChange={(list) => set('extraPriceList', list)}
          errors={errors}
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

/* ── 기존 사진 관리 (edit 모드) ── */
const PicSubLabel = styled.p`
  font-size: 13px; font-weight: 600; color: ${({ theme }) => theme.colors.adminTextDark};
`;
const ExistingGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;
`;
const ExistingItem = styled.div`
  border: 2px solid ${({ $main, $dragOver }) => $dragOver ? ACCENT : $main ? '#f59e0b' : 'transparent'};
  border-radius: 8px; overflow: hidden;
  background: ${({ theme }) => theme.colors.bgSection};
  opacity: ${({ $dragOver }) => ($dragOver ? 0.7 : 1)};
  cursor: grab; &:active { cursor: grabbing; }
`;
const DragHandle = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 2px;
  padding: 3px 0; font-size: 10px; font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const ExistingThumbBtn = styled.button`
  position: relative; display: block; width: 100%; height: 70px; cursor: pointer;
  &:hover > div { opacity: 1; }
`;
const ExistingImg = styled.img`width: 100%; height: 100%; object-fit: cover; display: block;`;
const ZoomOverlay = styled.div`
  position: absolute; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.15s;
`;
const NewPinBadge = styled.div`
  position: absolute; bottom: 4px; right: 4px;
  background: #6366f1; color: white;
  font-size: 9px; font-weight: 700;
  padding: 1px 4px; border-radius: 3px;
`;

const MainPinBadge = styled.div`
  position: absolute; top: 3px; left: 3px;
  background: #f59e0b; color: white; font-size: 9px; font-weight: 700;
  padding: 1px 4px; border-radius: 3px;
`;
const ExistingMeta = styled.div`
  display: flex; align-items: center; justify-content: flex-end; gap: 2px; padding: 4px 6px;
`;
const StarBtn = styled.button`
  width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  color: ${({ $active }) => ($active ? '#f59e0b' : '#94a3b8')};
  border: 1px solid ${({ $active }) => ($active ? '#f59e0b' : '#e2e8f0')};
  cursor: pointer; transition: all 0.15s;
  &:hover { color: #f59e0b; border-color: #f59e0b; }
`;
const DelBtn = styled.button`
  width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  color: #94a3b8; cursor: pointer; transition: background 0.15s, color 0.15s;
  &:hover { background: #fee2e2; color: #ef4444; }
`;

/* ── 미리보기 모달 ── */
const PreviewBg = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 24px;
`;
const PreviewBox = styled.div`
  position: relative; max-width: 88vw; max-height: 90vh;
  border-radius: 10px; overflow: hidden; display: flex; flex-direction: column;
`;
const PreviewBigImg = styled.img`
  max-width: 88vw; max-height: calc(90vh - 52px); object-fit: contain; display: block; background: #111;
`;
const PreviewTopRight = styled.div`
  position: absolute; top: 10px; right: 10px;
  display: flex; align-items: center; gap: 6px; z-index: 10;
`;
const PreviewStarBtn = styled.button`
  width: 32px; height: 32px; border-radius: 50%;
  background: ${({ $active }) => ($active ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.5)')};
  border: 1.5px solid ${({ $active }) => ($active ? '#f59e0b' : 'transparent')};
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  &:hover { background: rgba(245,158,11,0.3); border-color: #f59e0b; }
`;
const PreviewCloseBtn = styled.button`
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(0,0,0,0.5); color: white;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
`;
const PreviewBottom = styled.div`
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; padding: 10px 16px;
`;
const PreviewOrderWrap = styled.div`
  display: flex; align-items: center; gap: 8px;
  color: rgba(255,255,255,0.7); font-size: 13px;
`;
const PreviewOrderInput = styled.input`
  width: 48px; height: 28px;
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px; text-align: center;
  font-size: 13px; font-weight: 600; color: white; font-family: inherit; outline: none;
  &:focus { border-color: ${ACCENT}; }
`;
