import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReviewWrite } from '../hooks/useReviewWrite';
import {
  Wrapper,
  PageTitle,
  Board,
  Row,
  Label,
  Input,
  TextArea,
  Stars,
  Star,
  FileArea,
  FileHint,
  PreviewGrid,
  PreviewItem,
  PreviewImg,
  RemoveOverlay,
  ExistingBadge,
  PreviewIndex,
  AddButton,
  AddIcon,
  AddText,
  HiddenInput,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from '../styles/ReviewWritePage.styles';

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
