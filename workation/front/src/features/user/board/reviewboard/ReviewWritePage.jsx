import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useReviewWrite } from '../hooks/useReviewWrite';

function StarRating({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          $filled={n <= (hovered || rating)}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
        >
          ★
        </Star>
      ))}
    </Stars>
  );
}

export default function ReviewWritePage() {
  const navigate = useNavigate();
  const {
    isEdit,
    title,
    setTitle,
    content,
    setContent,
    tag,
    setTag,
    rating,
    setRating,
    images,
    existingImages,
    totalImageCount,
    submitting,
    loadingEdit,
    handleFileChange,
    handleRemoveNewImage,
    handleRemoveExistingImage,
    handleSubmit,
  } = useReviewWrite();

  if (loadingEdit)
    return (
      <Wrapper>
        <p>불러오는 중...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <PageTitle>{isEdit ? '후기 수정' : '후기 등록'}</PageTitle>
      <Board>
        <Row>
          <Label>제목</Label>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Row>
        <Row>
          <Label>별점</Label>
          <StarRating rating={rating} onChange={setRating} />
        </Row>
        <Row>
          <Label>한줄 태그</Label>
          <Input
            placeholder="예) 제주 바다뷰 스튜디오 — 뷰 최고!"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </Row>
        <Row $alignTop>
          <Label>내용</Label>
          <TextArea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Row>
        <Row $alignTop>
          <Label>이미지</Label>
          <FileArea>
            <FileHint>
              JPG, PNG, GIF, WEBP / 최대 10장
              {isEdit && images.length > 0 && (
                <span> · 새 이미지를 추가하면 기존 이미지가 교체됩니다</span>
              )}
            </FileHint>
            <PreviewGrid>
              {existingImages.map((img, i) => (
                <PreviewItem key={`existing-${img.id}`}>
                  <PreviewImg src={img.s3Key} alt={img.originalFileName} />
                  <ExistingBadge>기존</ExistingBadge>
                  <RemoveOverlay onClick={() => handleRemoveExistingImage(i)}>
                    ✕
                  </RemoveOverlay>
                </PreviewItem>
              ))}
              {images.map((img, i) => (
                <PreviewItem key={`new-${i}`}>
                  <PreviewImg src={img.previewUrl} alt={`새 이미지 ${i + 1}`} />
                  <PreviewIndex>{existingImages.length + i + 1}</PreviewIndex>
                  <RemoveOverlay onClick={() => handleRemoveNewImage(i)}>
                    ✕
                  </RemoveOverlay>
                </PreviewItem>
              ))}
              {totalImageCount < 10 && (
                <AddButton htmlFor="review-image-upload">
                  <AddIcon>📷</AddIcon>
                  <AddText>{totalImageCount}/10</AddText>
                  <HiddenInput
                    id="review-image-upload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                  />
                </AddButton>
              )}
            </PreviewGrid>
          </FileArea>
        </Row>
      </Board>
      <ButtonGroup>
        <CancelButton onClick={() => navigate('/board/review/list')}>
          취소
        </CancelButton>
        <SubmitButton onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? isEdit
              ? '수정 중...'
              : '등록 중...'
            : isEdit
              ? '수정 완료'
              : '등록'}
        </SubmitButton>
      </ButtonGroup>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 20px;
`;
const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
  margin-bottom: 32px;
`;
const Row = styled.div`
  display: flex;
  align-items: ${({ $alignTop }) => ($alignTop ? 'flex-start' : 'center')};
  padding: 20px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 24px;
`;
const Label = styled.div`
  width: 80px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  padding-top: 2px;
`;
const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.base};
  background: transparent;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;
const TextArea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.base};
  background: transparent;
  resize: none;
  min-height: 200px;
  line-height: 1.7;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;
const Stars = styled.div`
  display: flex;
  gap: 4px;
`;
const Star = styled.span`
  font-size: 28px;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#e2e8f0')};
  cursor: pointer;
  transition: color 0.1s;
`;
const FileArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const FileHint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;
const PreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const PreviewItem = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  &:hover > div {
    opacity: 1;
  }
`;
const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
const RemoveOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
  cursor: pointer;
`;
const ExistingBadge = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  padding: 2px 5px;
`;
const PreviewIndex = styled.div`
  position: absolute;
  bottom: 4px;
  left: 6px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
`;
const AddButton = styled.label`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSection};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentBlue};
  }
`;
const AddIcon = styled.span`
  font-size: 22px;
`;
const AddText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
`;
const HiddenInput = styled.input`
  display: none;
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
const CancelButton = styled.button`
  padding: 11px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;
const SubmitButton = styled.button`
  padding: 11px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
