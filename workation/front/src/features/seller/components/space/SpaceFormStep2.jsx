import { useRef, useState } from 'react';
import styled from 'styled-components';
import { Upload, X, Star, ChevronUp, ChevronDown, ZoomIn } from 'lucide-react';

const ACCENT = '#3ec9a7';

export const INIT_CATEGORIES = [
  { key: 'EXTERIOR', label: '외부/전경' },
  { key: 'ROOM',     label: '객실' },
  { key: 'BATHROOM', label: '욕실' },
  { key: 'FACILITY', label: '공용시설' },
  { key: 'AMENITY',  label: '부대시설' },
  { key: 'DINING',   label: '식음료' },
  { key: 'OFFICE',   label: '오피스' },
  { key: 'OTHERS',   label: '기타' },
].map((c) => ({ ...c, files: [] }));

/**
 * 공간 등록 Step2 — 카테고리별 사진 업로드
 *
 * categories:        Array<{ key, label, files: File[] }>  (순서 포함)
 * mainPhoto:         { categoryKey, fileIdx } | null        (대표 사진)
 * onCategoriesChange: (categories) => void
 * onMainPhotoChange:  (mainPhoto) => void
 */
export default function SpaceFormStep2({
  categories = INIT_CATEGORIES,
  mainPhoto = null,
  onCategoriesChange,
  onMainPhotoChange,
}) {
  const inputRefs = useRef({});
  const [preview, setPreview] = useState(null); // { src, name }

  /* ── 카테고리 순서 변경 ── */
  const moveCategoryUp = (idx) => {
    if (idx === 0) return;
    const next = [...categories];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onCategoriesChange(next);
  };

  const moveCategoryDown = (idx) => {
    if (idx === categories.length - 1) return;
    const next = [...categories];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onCategoriesChange(next);
  };

  /* ── 파일 추가 ── */
  const handleFileSelect = (catIdx, e) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    const next = categories.map((cat, i) =>
      i === catIdx ? { ...cat, files: [...cat.files, ...selected] } : cat
    );
    onCategoriesChange(next);
    e.target.value = '';
  };

  /* ── 파일 제거 ── */
  const handleRemove = (catIdx, fileIdx) => {
    const cat = categories[catIdx];
    // 대표 사진이 제거되면 해제
    if (mainPhoto?.categoryKey === cat.key && mainPhoto?.fileIdx === fileIdx) {
      onMainPhotoChange(null);
    } else if (mainPhoto?.categoryKey === cat.key && mainPhoto?.fileIdx > fileIdx) {
      onMainPhotoChange({ ...mainPhoto, fileIdx: mainPhoto.fileIdx - 1 });
    }
    const next = categories.map((c, i) =>
      i === catIdx ? { ...c, files: c.files.filter((_, fi) => fi !== fileIdx) } : c
    );
    onCategoriesChange(next);
  };

  /* ── 카테고리 내 사진 순서 변경 ── */
  const movePhotoUp = (catIdx, fileIdx) => {
    if (fileIdx === 0) return;
    const cat = categories[catIdx];
    const newFiles = [...cat.files];
    [newFiles[fileIdx - 1], newFiles[fileIdx]] = [newFiles[fileIdx], newFiles[fileIdx - 1]];

    // 대표 사진 인덱스 보정
    if (mainPhoto?.categoryKey === cat.key) {
      if (mainPhoto.fileIdx === fileIdx) onMainPhotoChange({ ...mainPhoto, fileIdx: fileIdx - 1 });
      else if (mainPhoto.fileIdx === fileIdx - 1) onMainPhotoChange({ ...mainPhoto, fileIdx });
    }

    onCategoriesChange(categories.map((c, i) => (i === catIdx ? { ...c, files: newFiles } : c)));
  };

  const movePhotoDown = (catIdx, fileIdx) => {
    const cat = categories[catIdx];
    if (fileIdx === cat.files.length - 1) return;
    const newFiles = [...cat.files];
    [newFiles[fileIdx], newFiles[fileIdx + 1]] = [newFiles[fileIdx + 1], newFiles[fileIdx]];

    if (mainPhoto?.categoryKey === cat.key) {
      if (mainPhoto.fileIdx === fileIdx) onMainPhotoChange({ ...mainPhoto, fileIdx: fileIdx + 1 });
      else if (mainPhoto.fileIdx === fileIdx + 1) onMainPhotoChange({ ...mainPhoto, fileIdx });
    }

    onCategoriesChange(categories.map((c, i) => (i === catIdx ? { ...c, files: newFiles } : c)));
  };

  /* ── 대표 사진 설정/해제 ── */
  const toggleMain = (catKey, fileIdx) => {
    if (mainPhoto?.categoryKey === catKey && mainPhoto?.fileIdx === fileIdx) {
      onMainPhotoChange(null);
    } else {
      onMainPhotoChange({ categoryKey: catKey, fileIdx });
    }
  };

  const isMain = (catKey, fileIdx) =>
    mainPhoto?.categoryKey === catKey && mainPhoto?.fileIdx === fileIdx;

  const totalCount = categories.reduce((s, c) => s + c.files.length, 0);

  return (
    <Wrap>
      <TopInfo>
        <InfoText>카테고리별로 사진을 업로드하세요. ↕ 버튼으로 순서를 변경하고, ★ 버튼으로 대표 사진을 지정하세요.</InfoText>
        {totalCount > 0 && <TotalBadge>총 {totalCount}장</TotalBadge>}
      </TopInfo>

      <CategoryList>
        {categories.map((cat, catIdx) => (
          <CategoryZone key={cat.key}>
            {/* 카테고리 헤더 */}
            <ZoneHeader>
              <ZoneLeft>
                <ZoneLabel>{cat.label}</ZoneLabel>
                {cat.files.length > 0 && <ZoneCount>{cat.files.length}장</ZoneCount>}
              </ZoneLeft>
              <ZoneActions>
                <OrderBtn
                  type="button"
                  onClick={() => moveCategoryUp(catIdx)}
                  disabled={catIdx === 0}
                  title="위로"
                >
                  <ChevronUp size={14} />
                </OrderBtn>
                <OrderBtn
                  type="button"
                  onClick={() => moveCategoryDown(catIdx)}
                  disabled={catIdx === categories.length - 1}
                  title="아래로"
                >
                  <ChevronDown size={14} />
                </OrderBtn>
              </ZoneActions>
            </ZoneHeader>

            {/* 업로드 버튼 */}
            <DropZone onClick={() => inputRefs.current[cat.key]?.click()}>
              <Upload size={16} color="#94a3b8" />
              <DropText>사진 추가</DropText>
              <input
                ref={(el) => (inputRefs.current[cat.key] = el)}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(catIdx, e)}
              />
            </DropZone>

            {/* 사진 목록 */}
            {cat.files.length > 0 && (
              <PhotoList>
                {cat.files.map((file, fileIdx) => {
                  const main = isMain(cat.key, fileIdx);
                  const src = URL.createObjectURL(file);
                  return (
                    <PhotoRow key={`${file.name}-${fileIdx}`} $main={main}>
                      {/* 사진 클릭 → 미리보기 */}
                      <ThumbBtn
                        type="button"
                        onClick={() => setPreview({ src, name: file.name })}
                        title="미리보기"
                      >
                        <ThumbImg src={src} alt={file.name} />
                        <OrderBadge>{fileIdx + 1}</OrderBadge>
                        <PreviewOverlay><ZoomIn size={16} color="white" /></PreviewOverlay>
                      </ThumbBtn>

                      {/* 파일명 */}
                      <PhotoName>{file.name}</PhotoName>

                      {/* 대표 설정 */}
                      <StarBtn
                        type="button"
                        $active={main}
                        onClick={() => toggleMain(cat.key, fileIdx)}
                        title={main ? '대표 해제' : '대표로 설정'}
                      >
                        <Star size={14} fill={main ? '#f59e0b' : 'none'} />
                        {main && <MainLabel>대표</MainLabel>}
                      </StarBtn>

                      {/* 순서 변경 */}
                      <PhotoOrderBtns>
                        <SmallBtn
                          type="button"
                          onClick={() => movePhotoUp(catIdx, fileIdx)}
                          disabled={fileIdx === 0}
                          title="위로"
                        >
                          <ChevronUp size={13} />
                        </SmallBtn>
                        <SmallBtn
                          type="button"
                          onClick={() => movePhotoDown(catIdx, fileIdx)}
                          disabled={fileIdx === cat.files.length - 1}
                          title="아래로"
                        >
                          <ChevronDown size={13} />
                        </SmallBtn>
                      </PhotoOrderBtns>

                      {/* 제거 */}
                      <RemoveBtn
                        type="button"
                        onClick={() => handleRemove(catIdx, fileIdx)}
                        title="제거"
                      >
                        <X size={13} />
                      </RemoveBtn>
                    </PhotoRow>
                  );
                })}
              </PhotoList>
            )}
          </CategoryZone>
        ))}
      </CategoryList>

      {/* 미리보기 모달 */}
      {preview && (
        <PreviewOverlayBg onClick={() => setPreview(null)}>
          <PreviewModal onClick={(e) => e.stopPropagation()}>
            <PreviewImg src={preview.src} alt={preview.name} />
            <PreviewName>{preview.name}</PreviewName>
            <ClosePreviewBtn type="button" onClick={() => setPreview(null)}>
              <X size={18} />
            </ClosePreviewBtn>
          </PreviewModal>
        </PreviewOverlayBg>
      )}
    </Wrap>
  );
}

/* ── Styled Components ── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  flex: 1;
`;

const TotalBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(62, 201, 167, 0.12);
  color: #0d9488;
  white-space: nowrap;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategoryZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.bgSection};
`;

const ZoneHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ZoneLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ZoneLabel = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const ZoneCount = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 999px;
  background: ${ACCENT};
  color: white;
`;

const ZoneActions = styled.div`
  display: flex;
  gap: 4px;
`;

const OrderBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.borderLight}; color: ${({ theme }) => theme.colors.adminTextDark}; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const DropZone = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: white;
  &:hover { border-color: ${ACCENT}; background: rgba(62, 201, 167, 0.03); }
`;

const DropText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PhotoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: white;
  border: 1.5px solid ${({ $main }) => ($main ? '#f59e0b' : 'transparent')};
  box-shadow: ${({ $main }) => ($main ? '0 0 0 2px rgba(245,158,11,0.15)' : 'none')};
  transition: border-color 0.15s;
`;

const ThumbBtn = styled.button`
  position: relative;
  width: 56px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  &:hover > div { opacity: 1; }
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const OrderBadge = styled.div`
  position: absolute;
  bottom: 3px;
  left: 3px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.62);
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  pointer-events: none;
`;

const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
`;

const PhotoName = styled.p`
  flex: 1;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMid};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StarBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#f59e0b' : '#94a3b8')};
  background: ${({ $active }) => ($active ? 'rgba(245,158,11,0.1)' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? '#f59e0b' : '#e2e8f0')};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
  &:hover { color: #f59e0b; border-color: #f59e0b; background: rgba(245,158,11,0.08); }
`;

const MainLabel = styled.span`
  font-size: 11px;
`;

const PhotoOrderBtns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
`;

const SmallBtn = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.borderLight}; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

const RemoveBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
  &:hover { background: #fee2e2; color: #ef4444; }
`;

/* ── 미리보기 모달 ── */

const PreviewOverlayBg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const PreviewModal = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
`;

const PreviewImg = styled.img`
  max-width: 90vw;
  max-height: calc(90vh - 48px);
  object-fit: contain;
  display: block;
`;

const PreviewName = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 10px 16px;
  background: white;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ClosePreviewBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(0, 0, 0, 0.75); }
`;
