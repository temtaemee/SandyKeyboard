import { useRef, useState } from 'react';
import styled from 'styled-components';
import { Upload, X, Star, ChevronUp, ChevronDown, ZoomIn, GripVertical } from 'lucide-react';

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

export default function SpaceFormStep2({
  categories = INIT_CATEGORIES,
  mainPhoto = null,
  onCategoriesChange,
  onMainPhotoChange,
}) {
  const inputRefs = useRef({});
  const dragItem  = useRef(null); // { catIdx, fileIdx }
  const [dragOver, setDragOver] = useState(null); // { catIdx, fileIdx }
  const [preview, setPreview]   = useState(null);

  /* ── 카테고리 순서 ── */
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
    if (mainPhoto?.categoryKey === cat.key && mainPhoto?.fileIdx === fileIdx) {
      onMainPhotoChange(null);
    } else if (mainPhoto?.categoryKey === cat.key && mainPhoto?.fileIdx > fileIdx) {
      onMainPhotoChange({ ...mainPhoto, fileIdx: mainPhoto.fileIdx - 1 });
    }
    onCategoriesChange(categories.map((c, i) =>
      i === catIdx ? { ...c, files: c.files.filter((_, fi) => fi !== fileIdx) } : c
    ));
  };

  /* ── 드래그앤드롭 (카테고리 내) ── */
  const handleDragStart = (catIdx, fileIdx) => {
    dragItem.current = { catIdx, fileIdx };
  };
  const handleDragOver = (e, catIdx, fileIdx) => {
    e.preventDefault();
    setDragOver({ catIdx, fileIdx });
  };
  const handleDrop = (catIdx, fileIdx) => {
    if (!dragItem.current) return;
    const { catIdx: fromCat, fileIdx: fromFile } = dragItem.current;
    if (fromCat !== catIdx || fromFile === fileIdx) { setDragOver(null); return; }

    const cat = categories[catIdx];
    const newFiles = [...cat.files];
    const [removed] = newFiles.splice(fromFile, 1);
    newFiles.splice(fileIdx, 0, removed);

    // 대표 인덱스 보정
    if (mainPhoto?.categoryKey === cat.key) {
      let mi = mainPhoto.fileIdx;
      if (mi === fromFile) mi = fileIdx;
      else if (fromFile < fileIdx && mi > fromFile && mi <= fileIdx) mi--;
      else if (fromFile > fileIdx && mi < fromFile && mi >= fileIdx) mi++;
      onMainPhotoChange({ ...mainPhoto, fileIdx: mi });
    }

    onCategoriesChange(categories.map((c, i) => i === catIdx ? { ...c, files: newFiles } : c));
    dragItem.current = null;
    setDragOver(null);
  };
  const handleDragEnd = () => { dragItem.current = null; setDragOver(null); };

  /* ── 대표 설정 ── */
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
        <InfoText>카테고리별로 사진을 업로드하세요. 드래그로 순서를 변경하고, ★ 버튼으로 대표 사진을 지정하세요.</InfoText>
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
                <OrderBtn type="button" onClick={() => moveCategoryUp(catIdx)} disabled={catIdx === 0} title="위로">
                  <ChevronUp size={14} />
                </OrderBtn>
                <OrderBtn type="button" onClick={() => moveCategoryDown(catIdx)} disabled={catIdx === categories.length - 1} title="아래로">
                  <ChevronDown size={14} />
                </OrderBtn>
              </ZoneActions>
            </ZoneHeader>

            {/* 업로드 버튼 */}
            <DropZone onClick={() => inputRefs.current[cat.key]?.click()}>
              <Upload size={15} color="#94a3b8" />
              <DropText>사진 추가</DropText>
              <input
                ref={(el) => (inputRefs.current[cat.key] = el)}
                type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(catIdx, e)}
              />
            </DropZone>

            {/* 사진 가로 그리드 — 드래그앤드롭 */}
            {cat.files.length > 0 && (
              <PhotoGrid>
                {cat.files.map((file, fileIdx) => {
                  const main = isMain(cat.key, fileIdx);
                  const src = URL.createObjectURL(file);
                  const isOver = dragOver?.catIdx === catIdx && dragOver?.fileIdx === fileIdx;
                  return (
                    <PhotoCard
                      key={`${file.name}-${fileIdx}`}
                      $main={main}
                      $dragOver={isOver}
                      draggable
                      onDragStart={() => handleDragStart(catIdx, fileIdx)}
                      onDragOver={(e) => handleDragOver(e, catIdx, fileIdx)}
                      onDrop={() => handleDrop(catIdx, fileIdx)}
                      onDragEnd={handleDragEnd}
                    >
                      {/* 순서 + 드래그 핸들 */}
                      <CardTop>
                        <GripVertical size={11} color="#94a3b8" />
                        <OrderNum>{fileIdx + 1}</OrderNum>
                      </CardTop>

                      {/* 썸네일 */}
                      <ThumbBtn type="button" onClick={() => setPreview({ src, name: file.name, catKey: cat.key, catIdx, fileIdx })}>
                        <ThumbImg src={src} alt={file.name} />
                        {main && <MainBadge>대표</MainBadge>}
                        <ZoomLayer><ZoomIn size={14} color="white" /></ZoomLayer>
                      </ThumbBtn>

                      {/* 하단 버튼 */}
                      <CardBottom>
                        <StarBtn
                          type="button" $active={main}
                          onClick={() => toggleMain(cat.key, fileIdx)}
                          title={main ? '대표 해제' : '대표로 설정'}
                        >
                          <Star size={12} fill={main ? '#f59e0b' : 'none'} />
                        </StarBtn>
                        <DelBtn type="button" onClick={() => handleRemove(catIdx, fileIdx)} title="제거">
                          <X size={12} />
                        </DelBtn>
                      </CardBottom>
                    </PhotoCard>
                  );
                })}
              </PhotoGrid>
            )}
          </CategoryZone>
        ))}
      </CategoryList>

      {/* 미리보기 모달 */}
      {preview && (() => {
        const previewMain = isMain(preview.catKey, preview.fileIdx);
        const cat = categories[preview.catIdx];
        return (
          <PreviewOverlayBg onClick={() => setPreview(null)}>
            <PreviewModal onClick={(e) => e.stopPropagation()}>
              <PreviewTopRight>
                <PreviewStarBtn
                  type="button"
                  $active={previewMain}
                  onClick={() => toggleMain(preview.catKey, preview.fileIdx)}
                  title={previewMain ? '대표 해제' : '대표로 설정'}
                >
                  <Star size={16}
                    fill={previewMain ? '#f59e0b' : 'none'}
                    color={previewMain ? '#f59e0b' : 'white'}
                  />
                  {previewMain && <PreviewMainLabel>대표</PreviewMainLabel>}
                </PreviewStarBtn>
                <ClosePreviewBtn type="button" onClick={() => setPreview(null)}><X size={18} /></ClosePreviewBtn>
              </PreviewTopRight>
              <PreviewImg src={preview.src} alt={preview.name} />
              <PreviewBottom>
                <PreviewInfo>
                  <PreviewCat>{cat?.label}</PreviewCat>
                  <PreviewName>{preview.name}</PreviewName>
                </PreviewInfo>
                <PreviewOrderWrap>
                  <PreviewOrderLabel>{preview.fileIdx + 1} / {cat?.files.length} —</PreviewOrderLabel>
                  <PreviewOrderInput
                    key={`${preview.catIdx}-${preview.fileIdx}`}
                    type="number" min={1} max={cat?.files.length}
                    defaultValue={preview.fileIdx + 1}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value);
                      const toIdx = Math.max(0, Math.min(cat.files.length - 1, val - 1));
                      if (toIdx === preview.fileIdx) return;
                      const newFiles = [...cat.files];
                      const [removed] = newFiles.splice(preview.fileIdx, 1);
                      newFiles.splice(toIdx, 0, removed);
                      if (mainPhoto?.categoryKey === cat.key) {
                        let mi = mainPhoto.fileIdx;
                        if (mi === preview.fileIdx) mi = toIdx;
                        else if (preview.fileIdx < toIdx && mi > preview.fileIdx && mi <= toIdx) mi--;
                        else if (preview.fileIdx > toIdx && mi < preview.fileIdx && mi >= toIdx) mi++;
                        onMainPhotoChange({ ...mainPhoto, fileIdx: mi });
                      }
                      onCategoriesChange(categories.map((c, i) => i === preview.catIdx ? { ...c, files: newFiles } : c));
                      setPreview(prev => ({ ...prev, fileIdx: toIdx }));
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }}
                  />
                  <PreviewOrderLabel>번으로 이동</PreviewOrderLabel>
                </PreviewOrderWrap>
              </PreviewBottom>
            </PreviewModal>
          </PreviewOverlayBg>
        );
      })()}
    </Wrap>
  );
}

/* ── Styled Components ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 20px;`;

const TopInfo = styled.div`display: flex; align-items: center; gap: 12px; flex-wrap: wrap;`;

const InfoText = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textMuted}; flex: 1;`;

const TotalBadge = styled.span`
  font-size: 12px; font-weight: 600; padding: 3px 10px;
  border-radius: 999px; background: rgba(62,201,167,0.12); color: #0d9488; white-space: nowrap;
`;

const CategoryList = styled.div`display: flex; flex-direction: column; gap: 12px;`;

const CategoryZone = styled.div`
  display: flex; flex-direction: column; gap: 10px; padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; background: ${({ theme }) => theme.colors.bgSection};
`;

const ZoneHeader = styled.div`display: flex; align-items: center; justify-content: space-between;`;

const ZoneLeft = styled.div`display: flex; align-items: center; gap: 8px;`;

const ZoneLabel = styled.p`font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.adminTextDark};`;

const ZoneCount = styled.span`
  font-size: 11px; font-weight: 600; padding: 1px 7px;
  border-radius: 999px; background: ${ACCENT}; color: white;
`;

const ZoneActions = styled.div`display: flex; gap: 4px;`;

const OrderBtn = styled.button`
  width: 28px; height: 28px; border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white; color: ${({ theme }) => theme.colors.textMuted};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.15s;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.borderLight}; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const DropZone = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  border: 1.5px dashed ${({ theme }) => theme.colors.border};
  border-radius: 8px; cursor: pointer; background: white;
  transition: border-color 0.15s, background 0.15s;
  &:hover { border-color: ${ACCENT}; background: rgba(62,201,167,0.03); }
`;

const DropText = styled.span`font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};`;

/* 가로 사진 그리드 */
const PhotoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PhotoCard = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  border: 2px solid ${({ $main, $dragOver }) =>
    $dragOver ? ACCENT : $main ? '#f59e0b' : 'transparent'};
  box-shadow: ${({ $main }) => $main ? '0 0 0 2px rgba(245,158,11,0.15)' : '0 1px 3px rgba(0,0,0,0.08)'};
  opacity: ${({ $dragOver }) => ($dragOver ? 0.6 : 1)};
  transition: border-color 0.15s, opacity 0.15s;
  cursor: grab;
  &:active { cursor: grabbing; }
`;

const CardTop = styled.div`
  display: flex; align-items: center; justify-content: center; gap: 3px;
  padding: 3px 6px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const OrderNum = styled.span`
  font-size: 10px; font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ThumbBtn = styled.button`
  position: relative; display: block; width: 100%; height: 72px;
  cursor: pointer;
  &:hover > div { opacity: 1; }
`;

const ThumbImg = styled.img`width: 100%; height: 100%; object-fit: cover; display: block;`;

const MainBadge = styled.div`
  position: absolute; top: 4px; left: 4px;
  background: #f59e0b; color: white;
  font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px;
`;

const ZoomLayer = styled.div`
  position: absolute; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.15s;
`;

const CardBottom = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 6px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const StarBtn = styled.button`
  width: 24px; height: 24px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: ${({ $active }) => ($active ? '#f59e0b' : '#94a3b8')};
  border: 1px solid ${({ $active }) => ($active ? '#f59e0b' : '#e2e8f0')};
  cursor: pointer; transition: all 0.15s;
  &:hover { color: #f59e0b; border-color: #f59e0b; }
`;

const DelBtn = styled.button`
  width: 24px; height: 24px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: #94a3b8; cursor: pointer; transition: background 0.15s, color 0.15s;
  &:hover { background: #fee2e2; color: #ef4444; }
`;

/* 미리보기 */
const PreviewOverlayBg = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px;
`;

const PreviewModal = styled.div`
  position: relative; max-width: 90vw; max-height: 90vh;
  background: white; border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column; box-shadow: 0 25px 50px rgba(0,0,0,0.4);
`;

const PreviewImg = styled.img`
  max-width: 90vw; max-height: calc(90vh - 48px); object-fit: contain; display: block;
`;

const PreviewName = styled.p`
  font-size: 12px; color: ${({ theme }) => theme.colors.textMuted};
  padding: 10px 16px; background: white;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const PreviewTopRight = styled.div`
  position: absolute; top: 10px; right: 10px;
  display: flex; align-items: center; gap: 6px; z-index: 10;
`;

const PreviewStarBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 20px;
  background: ${({ $active }) => ($active ? 'rgba(245,158,11,0.25)' : 'rgba(0,0,0,0.5)')};
  border: 1.5px solid ${({ $active }) => ($active ? '#f59e0b' : 'transparent')};
  color: white; cursor: pointer; transition: all 0.15s;
  &:hover { background: rgba(245,158,11,0.3); border-color: #f59e0b; }
`;

const PreviewMainLabel = styled.span`
  font-size: 12px; font-weight: 700; color: #f59e0b;
`;

const ClosePreviewBtn = styled.button`
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(0,0,0,0.5); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.15s;
  &:hover { background: rgba(0,0,0,0.75); }
`;

const PreviewBottom = styled.div`
  background: white;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: 10px 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
`;

const PreviewInfo = styled.div`
  display: flex; align-items: center; gap: 8px;
`;

const PreviewCat = styled.span`
  font-size: 11px; font-weight: 600; padding: 1px 8px;
  border-radius: 999px; background: rgba(62,201,167,0.12); color: #0d9488;
`;

const PreviewOrderWrap = styled.div`
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
`;

const PreviewOrderInput = styled.input`
  width: 44px; height: 28px; text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px; font-size: 13px; font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit; outline: none;
  &:focus { border-color: ${ACCENT}; }
`;

const PreviewOrderLabel = styled.span`
  font-size: 12px; color: ${({ theme }) => theme.colors.textMuted};
`;
