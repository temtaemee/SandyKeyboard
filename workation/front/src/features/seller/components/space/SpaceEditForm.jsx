import { useState, useRef } from 'react';
import styled from 'styled-components';
import { X, Star, Upload, ZoomIn } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { INIT_CATEGORIES } from './SpaceFormStep2';

const EDIT_ACCENT = '#3ec9a7';

const CATEGORY_LABEL = Object.fromEntries(
  INIT_CATEGORIES.map(c => [c.key, c.label])
);

const AREA_OPTIONS = [
  { value: 'SEOUL', label: '서울' },
  { value: 'GYEONGGI', label: '경기' },
  { value: 'GANGWON', label: '강원' },
  { value: 'CHUNGNAM', label: '충남' },
  { value: 'CHUNGBUK', label: '충북' },
  { value: 'GYEONGNAM', label: '경남' },
  { value: 'GYEONGBUK', label: '경북' },
  { value: 'JEONNAM', label: '전남' },
  { value: 'JEONBUK', label: '전북' },
  { value: 'JEJU', label: '제주' },
];

function validate(data) {
  const errs = {};
  if (!data.name?.trim()) errs.name = '공간명을 입력하세요';
  if (!data.phone?.trim()) {
    errs.phone = '전화번호를 입력하세요';
  } else {
    const digits = data.phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 12) errs.phone = '전화번호는 9~12자리 숫자여야 합니다';
  }
  if (!data.email?.trim()) {
    errs.email = '이메일을 입력하세요';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errs.email = '올바른 이메일 주소를 입력하세요';
  }
  if (!data.summary?.trim()) errs.summary = '한줄 소개를 입력하세요';
  if (!data.description?.trim()) errs.description = '상세 설명을 입력하세요';
  if (!data.address1?.trim()) errs.address1 = '주소를 입력하세요';
  if (!data.area) errs.area = '지역을 선택하세요';
  return errs;
}

/**
 * 공간 수정 폼
 * @param {object} space SpaceResDto (pictures 포함)
 * @param {function} onSubmit (dto, pictureChanges | null) => void
 * @param {boolean} loading
 */
export default function SpaceEditForm({ space, onSubmit, loading }) {
  const inputRefs = useRef({});
  const [preview, setPreview] = useState(null);

  const [data, setData] = useState({
    name: space?.name ?? '',
    phone: space?.phone ?? '',
    email: space?.email ?? '',
    summary: space?.summary ?? '',
    description: space?.description ?? '',
    address1: space?.address1 ?? '',
    address2: space?.address2 ?? '',
    latitude: space?.latitude ?? '',
    longitude: space?.longitude ?? '',
    area: space?.area ?? '',
  });
  const [errors, setErrors] = useState({});

  // 사진 편집 상태
  const [keptPictures, setKeptPictures] = useState(space?.pictures ?? []);
  const [mainPictureId, setMainPictureId] = useState(
    space?.pictures?.find(p => p.mainYn === 'Y')?.id ?? null
  );
  const [newCategories, setNewCategories] = useState(
    INIT_CATEGORIES.map(c => ({ ...c, files: [] }))
  );
  const [newMainPhoto, setNewMainPhoto] = useState(null);

  const picturesChanged = () => {
    const origIds = new Set((space?.pictures ?? []).map(p => p.id));
    const keptIds = new Set(keptPictures.map(p => p.id));
    const hasDeleted = [...origIds].some(id => !keptIds.has(id));
    const hasNew = newCategories.some(c => c.files.length > 0);
    const origMainId = space?.pictures?.find(p => p.mainYn === 'Y')?.id ?? null;
    const mainChanged = mainPictureId !== origMainId;
    return hasDeleted || hasNew || mainChanged;
  };

  const set = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const dto = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      summary: data.summary.trim(),
      description: data.description.trim(),
      address1: data.address1.trim(),
      address2: data.address2?.trim() || null,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
      area: data.area,
    };

    let pictureChanges = null;
    if (picturesChanged()) {
      const allNewFiles = [];
      const newPictures = [];
      newCategories.forEach(cat => {
        cat.files.forEach((file, idx) => {
          const isMain = newMainPhoto?.categoryKey === cat.key && newMainPhoto?.fileIdx === idx;
          allNewFiles.push(file);
          newPictures.push({ mainYn: isMain ? 'Y' : 'N', sortOrder: allNewFiles.length - 1, category: cat.key });
        });
      });

      // 기존 사진 중 mainYn 업데이트 반영
      const keptWithMain = keptPictures.map(p => ({
        ...p,
        mainYn: p.id === mainPictureId ? 'Y' : 'N',
      }));

      // 새 사진에도 main 없고 기존도 없으면 첫 kept를 main으로
      if (!keptWithMain.some(p => p.mainYn === 'Y') && !newPictures.some(p => p.mainYn === 'Y') && keptWithMain.length > 0) {
        keptWithMain[0].mainYn = 'Y';
      }

      pictureChanges = {
        keepPictureIds: keptWithMain.map(p => p.id),
        newPictures,
        files: allNewFiles,
      };
    }

    onSubmit(dto, pictureChanges);
  };

  const field = (name) => ({
    value: data[name] ?? '',
    onChange: (e) => set(name, e.target.value),
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Field>
          <Label>공간명 <Req>*</Req></Label>
          <Input {...field('name')} $error={!!errors.name} />
          {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
        </Field>
        <Field>
          <Label>지역 <Req>*</Req></Label>
          <Select
            value={data.area}
            onChange={(e) => set('area', e.target.value)}
            $error={!!errors.area}
          >
            <option value="">지역 선택</option>
            {AREA_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
          {errors.area && <ErrorMsg>{errors.area}</ErrorMsg>}
        </Field>
      </Row>

      <Row>
        <Field>
          <Label>전화번호 <Req>*</Req></Label>
          <Input {...field('phone')} maxLength={15} $error={!!errors.phone} />
          {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
        </Field>
        <Field>
          <Label>이메일 <Req>*</Req></Label>
          <Input {...field('email')} type="email" $error={!!errors.email} />
          {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
        </Field>
      </Row>

      <Field>
        <Label>한줄 소개 <Req>*</Req></Label>
        <Input {...field('summary')} maxLength={255} $error={!!errors.summary} />
        {errors.summary && <ErrorMsg>{errors.summary}</ErrorMsg>}
      </Field>

      <Field>
        <Label>상세 설명 <Req>*</Req></Label>
        <Textarea {...field('description')} rows={5} $error={!!errors.description} />
        {errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
      </Field>

      <Row>
        <Field style={{ flex: 2 }}>
          <Label>주소 <Req>*</Req></Label>
          <Input {...field('address1')} $error={!!errors.address1} />
          {errors.address1 && <ErrorMsg>{errors.address1}</ErrorMsg>}
        </Field>
        <Field>
          <Label>상세 주소</Label>
          <Input {...field('address2')} />
        </Field>
      </Row>

      <Row>
        <Field>
          <Label>위도</Label>
          <Input {...field('latitude')} type="number" step="any" />
        </Field>
        <Field>
          <Label>경도</Label>
          <Input {...field('longitude')} type="number" step="any" />
        </Field>
      </Row>

      {/* ── 사진 편집 섹션 ── */}
      <SectionDivider>
        <SectionTitle>사진 관리</SectionTitle>
        <SectionSub>기존 사진을 삭제하거나 새 사진을 추가할 수 있습니다</SectionSub>
      </SectionDivider>

      {/* 기존 사진 목록 */}
      {keptPictures.length > 0 ? (
        <div>
          <PicSubLabel>현재 사진 ({keptPictures.length}장)</PicSubLabel>
          <ExistingGrid>
            {keptPictures.map(pic => {
              const isMain = pic.id === mainPictureId;
              return (
                <ExistingItem key={pic.id} $main={isMain}>
                  <ExistingThumbBtn
                    type="button"
                    onClick={() => setPreview({ src: pic.filePath, name: pic.filePath })}
                  >
                    <ExistingImg src={pic.filePath} alt="" onError={e => { e.target.style.display='none'; }} />
                    <ZoomOverlay><ZoomIn size={14} color="white" /></ZoomOverlay>
                  </ExistingThumbBtn>
                  <ExistingMeta>
                    <CategoryTag>{CATEGORY_LABEL[pic.category] ?? pic.category}</CategoryTag>
                    <ExistingActions>
                      <StarBtn
                        type="button"
                        $active={isMain}
                        onClick={() => setMainPictureId(isMain ? null : pic.id)}
                        title={isMain ? '대표 해제' : '대표로 설정'}
                      >
                        <Star size={13} fill={isMain ? '#f59e0b' : 'none'} />
                        {isMain && <span>대표</span>}
                      </StarBtn>
                      <DeletePicBtn
                        type="button"
                        onClick={() => {
                          setKeptPictures(prev => prev.filter(p => p.id !== pic.id));
                          if (mainPictureId === pic.id) setMainPictureId(null);
                        }}
                        title="삭제"
                      >
                        <X size={13} />
                      </DeletePicBtn>
                    </ExistingActions>
                  </ExistingMeta>
                </ExistingItem>
              );
            })}
          </ExistingGrid>
        </div>
      ) : (
        <NoPicMsg>등록된 사진이 없습니다.</NoPicMsg>
      )}

      {/* 새 사진 추가 */}
      <div>
        <PicSubLabel>새 사진 추가 (카테고리별)</PicSubLabel>
        <NewPicGrid>
          {newCategories.map((cat, catIdx) => (
            <NewCatZone key={cat.key}>
              <NewCatHeader>
                <NewCatLabel>{cat.label}</NewCatLabel>
                {cat.files.length > 0 && <CountBadge>{cat.files.length}장</CountBadge>}
              </NewCatHeader>
              <NewDropZone onClick={() => inputRefs.current[cat.key]?.click()}>
                <Upload size={14} color="#94a3b8" />
                <span>추가</span>
                <input
                  ref={el => (inputRefs.current[cat.key] = el)}
                  type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => {
                    const files = Array.from(e.target.files ?? []);
                    if (!files.length) return;
                    setNewCategories(prev => prev.map((c, i) =>
                      i === catIdx ? { ...c, files: [...c.files, ...files] } : c
                    ));
                    e.target.value = '';
                  }}
                />
              </NewDropZone>
              {cat.files.length > 0 && (
                <NewThumbRow>
                  {cat.files.map((file, fileIdx) => {
                    const src = URL.createObjectURL(file);
                    const isMain = newMainPhoto?.categoryKey === cat.key && newMainPhoto?.fileIdx === fileIdx;
                    return (
                      <NewThumbWrap key={`${file.name}-${fileIdx}`} $main={isMain}>
                        <NewThumb
                          type="button"
                          onClick={() => setPreview({ src, name: file.name })}
                        >
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </NewThumb>
                        <NewThumbActions>
                          <MiniStarBtn
                            type="button"
                            $active={isMain}
                            onClick={() => setNewMainPhoto(isMain ? null : { categoryKey: cat.key, fileIdx })}
                          ><Star size={10} fill={isMain ? '#f59e0b' : 'none'} /></MiniStarBtn>
                          <MiniDelBtn
                            type="button"
                            onClick={() => {
                              setNewCategories(prev => prev.map((c, i) =>
                                i === catIdx ? { ...c, files: c.files.filter((_, fi) => fi !== fileIdx) } : c
                              ));
                              if (newMainPhoto?.categoryKey === cat.key && newMainPhoto?.fileIdx === fileIdx) {
                                setNewMainPhoto(null);
                              }
                            }}
                          ><X size={10} /></MiniDelBtn>
                        </NewThumbActions>
                      </NewThumbWrap>
                    );
                  })}
                </NewThumbRow>
              )}
            </NewCatZone>
          ))}
        </NewPicGrid>
      </div>

      <SubmitBtn type="submit" disabled={loading}>
        {loading ? <LoadingSpinner size="sm" /> : '수정 완료'}
      </SubmitBtn>

      {/* 미리보기 모달 */}
      {preview && (
        <PreviewBg onClick={() => setPreview(null)}>
          <PreviewBox onClick={e => e.stopPropagation()}>
            <PreviewImg src={preview.src} alt={preview.name} />
            <PreviewClose type="button" onClick={() => setPreview(null)}><X size={16} /></PreviewClose>
          </PreviewBox>
        </PreviewBg>
      )}
    </Form>
  );
}


const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  &:focus { border-color: ${EDIT_ACCENT}; }
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
  &:focus { border-color: ${EDIT_ACCENT}; }
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
  &:focus { border-color: ${EDIT_ACCENT}; }
`;

const ErrorMsg = styled.p`
  font-size: 12px;
  color: #ef4444;
`;

/* ── 사진 섹션 ── */
const SectionDivider = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;
const SectionSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;
const PicSubLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 10px;
`;
const ExistingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;
const ExistingItem = styled.div`
  border: 1.5px solid ${({ $main }) => ($main ? '#f59e0b' : 'transparent')};
  border-radius: 8px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgSection};
`;
const ExistingThumbBtn = styled.button`
  position: relative;
  display: block;
  width: 100%;
  height: 72px;
  cursor: pointer;
  &:hover > div { opacity: 1; }
`;
const ExistingImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
const ZoomOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
`;
const ExistingMeta = styled.div`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;
const CategoryTag = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ExistingActions = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`;
const StarBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#f59e0b' : '#94a3b8')};
  border: 1px solid ${({ $active }) => ($active ? '#f59e0b' : '#e2e8f0')};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { color: #f59e0b; border-color: #f59e0b; }
`;
const DeletePicBtn = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover { background: #fee2e2; color: #ef4444; }
`;
const NoPicMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 16px 0;
`;
const NewPicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;
const NewCatZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bgSection};
`;
const NewCatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const NewCatLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;
const CountBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 999px;
  background: ${EDIT_ACCENT};
  color: white;
`;
const NewDropZone = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 8px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: white;
  transition: border-color 0.15s;
  &:hover { border-color: ${EDIT_ACCENT}; }
`;
const NewThumbRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;
const NewThumbWrap = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  border: 1.5px solid ${({ $main }) => ($main ? '#f59e0b' : 'transparent')};
`;
const NewThumb = styled.button`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
const NewThumbActions = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  display: flex;
  flex-direction: column;
  gap: 1px;
`;
const MiniStarBtn = styled.button`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: rgba(0,0,0,0.5);
  color: ${({ $active }) => ($active ? '#f59e0b' : 'white')};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
`;
const MiniDelBtn = styled.button`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: rgba(0,0,0,0.5);
  color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  &:hover { background: #ef4444; }
`;
/* ── 미리보기 ── */
const PreviewBg = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 24px;
`;
const PreviewBox = styled.div`
  position: relative;
  max-width: 90vw; max-height: 90vh;
  background: white; border-radius: 12px; overflow: hidden;
`;
const PreviewImg = styled.img`
  max-width: 90vw; max-height: calc(90vh - 40px); object-fit: contain; display: block;
`;
const PreviewClose = styled.button`
  position: absolute; top: 8px; right: 8px;
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(0,0,0,0.5); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
`;

const SubmitBtn = styled.button`
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${EDIT_ACCENT};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
