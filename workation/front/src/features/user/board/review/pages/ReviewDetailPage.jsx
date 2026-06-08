import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReviewDetail } from '../hooks/useReviewDetail';
import {
  Stars,
  Star,
  AvatarCircle,
  Wrapper,
  LoadingWrapper,
  Header,
  HeaderLeft,
  MetaRow,
  Writer,
  Dot,
  DateText,
  ActionButtons,
  EditBtn,
  DeleteBtn,
  ImageGrid,
  ImageItem,
  MoreOverlay,
  TagPill,
  TagDot,
  Body,
  BackRow,
  BackBtn,
  CommentSection,
  CommentHeader,
  CommentTitle,
  CommentBadge,
  CommentList,
  CommentCard,
  CommentCardTop,
  CommentWriter,
  OwnerBadge,
  CommentMeta,
  CommentDate,
  CommentDelBtn,
  CommentBody,
  EmptyComment,
  CommentInputBox,
  CommentInputTop,
  CommentInputLabel,
  CommentInputRow,
  CommentTextArea,
  CommentSubmitBtn,
  LightboxOverlay,
  LightboxImg,
  LightboxClose,
  LightboxPrev,
  LightboxNext,
  ModalOverlay,
  Modal,
  ModalText,
  ModalButtons,
  ModalCancel,
  ModalDelete,
} from '../styles/ReviewDetailPage.styles';

function StarRating({ rating, onChange, size = 20 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          $filled={n <= (hovered || rating)}
          $interactive={!!onChange}
          $size={size}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
        >
          ★
        </Star>
      ))}
    </Stars>
  );
}

function Avatar({ name, isOwner }) {
  const initial = name?.charAt(0) ?? '?';
  return <AvatarCircle $isOwner={isOwner}>{initial}</AvatarCircle>;
}

export default function ReviewDetailPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const {
    review,
    comments,
    loading,
    commentInput,
    setCommentInput,
    commentRating,
    setCommentRating,
    showConfirm,
    setShowConfirm,
    deleteCommentId,
    setDeleteCommentId,
    lightboxIdx,
    setLightboxIdx,
    handleDelete,
    handleCommentSubmit,
    handleCommentDelete,
  } = useReviewDetail(reviewId);

  if (loading) return <LoadingWrapper>불러오는 중...</LoadingWrapper>;
  if (!review)
    return <LoadingWrapper>존재하지 않는 후기입니다.</LoadingWrapper>;

  const images = review.images ?? [];

  return (
    <Wrapper>
      {/* ── 헤더 ── */}
      <Header>
        <HeaderLeft>
          <StarRating rating={review.rating} size={20} />
          <MetaRow>
            <Avatar name={review.writer} />
            <Writer>{review.writer}</Writer>
            <Dot>·</Dot>
            <DateText>
              {new Date(review.createdAt).toLocaleDateString('ko-KR')}
            </DateText>
          </MetaRow>
        </HeaderLeft>
        <ActionButtons>
          <EditBtn
            onClick={() => navigate(`/review/edit/${reviewId}`)}
          >
            수정
          </EditBtn>
          <DeleteBtn onClick={() => setShowConfirm(true)}>삭제</DeleteBtn>
        </ActionButtons>
      </Header>

      {/* ── 이미지 그리드 ── */}
      {images.length > 0 && (
        <ImageGrid $count={Math.min(images.length, 4)}>
          {images.slice(0, 4).map((img, i) => (
            <ImageItem key={img.id} onClick={() => setLightboxIdx(i)}>
              <img src={img.s3Key} alt={img.originalFileName} />
              {i === 3 && images.length > 4 && (
                <MoreOverlay>+{images.length - 4}</MoreOverlay>
              )}
            </ImageItem>
          ))}
        </ImageGrid>
      )}

      {/* ── 태그 ── */}
      {review.tag && (
        <TagPill>
          <TagDot />
          {review.tag}
        </TagPill>
      )}

      {/* ── 본문 ── */}
      <Body>{review.content}</Body>

      {/* ── 목록으로 ── */}
      <BackRow>
        <BackBtn onClick={() => navigate('/board/review')}>
          ← 목록으로
        </BackBtn>
      </BackRow>

      {/* ── 댓글 섹션 ── */}
      <CommentSection>
        <CommentHeader>
          <CommentTitle>댓글</CommentTitle>
          <CommentBadge>{comments.length}</CommentBadge>
        </CommentHeader>

        <CommentList>
          {comments.length === 0 && (
            <EmptyComment>첫 번째 댓글을 남겨보세요</EmptyComment>
          )}
          {comments.map((c) => (
            <CommentCard key={c.id} $isOwner={c.ownerYn === 'Y'}>
              <CommentCardTop>
                <Avatar name={c.writer} isOwner={c.ownerYn === 'Y'} />
                <CommentWriter $isOwner={c.ownerYn === 'Y'}>
                  {c.writer}
                </CommentWriter>
                {c.ownerYn === 'Y' && <OwnerBadge>운영자</OwnerBadge>}
                {c.ownerYn !== 'Y' && c.rating && (
                  <StarRating rating={c.rating} size={13} />
                )}
                <CommentMeta>
                  <CommentDate>
                    {new Date(c.createdAt).toLocaleDateString('ko-KR')}
                  </CommentDate>
                  <CommentDelBtn onClick={() => setDeleteCommentId(c.id)}>
                    삭제
                  </CommentDelBtn>
                </CommentMeta>
              </CommentCardTop>
              <CommentBody>{c.content}</CommentBody>
            </CommentCard>
          ))}
        </CommentList>

        {/* ── 댓글 입력 ── */}
        <CommentInputBox>
          <CommentInputTop>
            <CommentInputLabel>별점</CommentInputLabel>
            <StarRating
              rating={commentRating}
              onChange={setCommentRating}
              size={18}
            />
          </CommentInputTop>
          <CommentInputRow>
            <CommentTextArea
              placeholder="댓글을 입력하세요"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
            />
            <CommentSubmitBtn onClick={handleCommentSubmit}>
              등록
            </CommentSubmitBtn>
          </CommentInputRow>
        </CommentInputBox>
      </CommentSection>

      {/* ── 라이트박스 ── */}
      {lightboxIdx !== null && (
        <LightboxOverlay onClick={() => setLightboxIdx(null)}>
          <LightboxImg
            src={images[lightboxIdx]?.s3Key}
            alt="확대"
            onClick={(e) => e.stopPropagation()}
          />
          <LightboxClose onClick={() => setLightboxIdx(null)}>✕</LightboxClose>
          {lightboxIdx > 0 && (
            <LightboxPrev
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx - 1);
              }}
            >
              ‹
            </LightboxPrev>
          )}
          {lightboxIdx < images.length - 1 && (
            <LightboxNext
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx + 1);
              }}
            >
              ›
            </LightboxNext>
          )}
        </LightboxOverlay>
      )}

      {/* ── 후기 삭제 모달 ── */}
      {showConfirm && (
        <ModalOverlay>
          <Modal>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowConfirm(false)}>
                취소
              </ModalCancel>
              <ModalDelete onClick={handleDelete}>삭제</ModalDelete>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}

      {/* ── 댓글 삭제 모달 ── */}
      {deleteCommentId && (
        <ModalOverlay>
          <Modal>
            <ModalText>댓글을 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setDeleteCommentId(null)}>
                취소
              </ModalCancel>
              <ModalDelete onClick={() => handleCommentDelete(deleteCommentId)}>
                삭제
              </ModalDelete>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}
