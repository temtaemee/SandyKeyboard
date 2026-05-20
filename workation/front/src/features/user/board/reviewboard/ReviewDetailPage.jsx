import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useReviewDetail } from '../hooks/useReviewDetail';

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
            onClick={() => navigate(`/board/review/write?id=${reviewId}`)}
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
        <BackBtn onClick={() => navigate('/board/review/list')}>
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

/* ────────────────────────────────────────
   Styled Components
──────────────────────────────────────── */

const Wrapper = styled.div`
  max-width: 780px;
`;

const LoadingWrapper = styled.div`
  padding: 80px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
`;

/* ── 헤더 ── */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 28px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AvatarCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary + '20' : theme.colors.bgSection};
  color: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary : theme.colors.textMid};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Writer = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.border};
  font-size: 13px;
`;

const DateText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const EditBtn = styled.button`
  padding: 7px 18px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DeleteBtn = styled.button`
  padding: 7px 18px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid transparent;
  background: #fef2f2;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #ef4444;
    color: white;
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 1px;
`;

const Star = styled.span`
  font-size: ${({ $size }) => $size ?? 20}px;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#e2e8f0')};
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  transition: color 0.1s;
  line-height: 1;
`;

/* ── 이미지 ── */
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => Math.min($count, 4)}, 1fr);
  gap: 6px;
  margin-bottom: 24px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageItem = styled.div`
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: ${({ theme }) => theme.colors.bgSection};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.25s ease;
  }
  &:hover img {
    transform: scale(1.05);
  }
`;

const MoreOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
`;

/* ── 태그 ── */
const TagPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 5px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 20px;
`;

const TagDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

/* ── 본문 ── */
const Body = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 32px;
  white-space: pre-line;
`;

/* ── 목록으로 ── */
const BackRow = styled.div`
  margin-bottom: 48px;
`;

const BackBtn = styled.button`
  padding: 0;
  background: none;
  border: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s;
  &:hover {
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

/* ── 댓글 섹션 ── */
const CommentSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 32px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const CommentTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

const CommentBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}18;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 2px 8px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const CommentCard = styled.div`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.bgSection : 'white'};
`;

const CommentCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const CommentWriter = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary : theme.colors.textDark};
`;

const OwnerBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}18;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 2px 8px;
`;

const CommentMeta = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CommentDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const CommentDelBtn = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  &:hover {
    color: #ef4444;
  }
`;

const CommentBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.7;
  margin: 0;
`;

const EmptyComment = styled.div`
  padding: 32px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

/* ── 댓글 입력 ── */
const CommentInputBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;
  background: ${({ theme }) => theme.colors.bgSection};
`;

const CommentInputTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const CommentInputLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;

const CommentInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const CommentTextArea = styled.textarea`
  flex: 1;
  padding: 11px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textDark};
  resize: none;
  height: 64px;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.base};
  background: white;
  transition: border-color 0.15s;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CommentSubmitBtn = styled.button`
  padding: 0 20px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

/* ── 라이트박스 ── */
const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
`;

const LightboxImg = styled.img`
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const LightboxClose = styled.button`
  position: fixed;
  top: 24px;
  right: 32px;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: white;
  }
`;

const LightboxPrev = styled.button`
  position: fixed;
  left: 24px;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: white;
  }
`;

const LightboxNext = styled.button`
  position: fixed;
  right: 24px;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: white;
  }
`;

/* ── 모달 ── */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const Modal = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

const ModalText = styled.p`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalCancel = styled.button`
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

const ModalDelete = styled.button`
  padding: 11px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;
