import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useReviewDetail } from '../hooks/useReviewDetail';

function StarRating({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          $filled={n <= (hovered || rating)}
          $interactive={!!onChange}
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

  if (loading)
    return (
      <Wrapper>
        <p>불러오는 중...</p>
      </Wrapper>
    );
  if (!review)
    return (
      <Wrapper>
        <p>존재하지 않는 후기입니다.</p>
      </Wrapper>
    );

  const images = review.images ?? [];

  return (
    <Wrapper>
      <Header>
        <HeaderLeft>
          <StarRating rating={review.rating} />
          <MetaRow>
            <Writer>{review.writer}</Writer>
            <Dot>·</Dot>
            <DateText>
              {new Date(review.createdAt).toLocaleDateString('ko-KR')}
            </DateText>
          </MetaRow>
        </HeaderLeft>
        <ActionButtons>
          <EditButton
            onClick={() => navigate(`/board/review/write?id=${reviewId}`)}
          >
            수정
          </EditButton>
          <DeleteButton onClick={() => setShowConfirm(true)}>삭제</DeleteButton>
        </ActionButtons>
      </Header>

      {images.length > 0 && (
        <ImageGrid>
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

      {review.tag && <TagLine>{review.tag}</TagLine>}
      <Body>{review.content}</Body>
      <BackButton onClick={() => navigate('/board/review/list')}>
        ← 목록으로
      </BackButton>

      <CommentSection>
        <CommentTitle>
          댓글 <CommentCount>{comments.length}</CommentCount>
        </CommentTitle>
        <CommentList>
          {comments.map((c) => (
            <CommentItem key={c.id} $isOwner={c.ownerYn === 'Y'}>
              <CommentTop>
                <CommentWriter $isOwner={c.ownerYn === 'Y'}>
                  {c.writer}
                </CommentWriter>
                {c.ownerYn !== 'Y' && c.rating && (
                  <StarRating rating={c.rating} />
                )}
                <CommentRight>
                  <CommentDate>
                    {new Date(c.createdAt).toLocaleDateString('ko-KR')}
                  </CommentDate>
                  <CommentDeleteBtn onClick={() => setDeleteCommentId(c.id)}>
                    삭제
                  </CommentDeleteBtn>
                </CommentRight>
              </CommentTop>
              <CommentBody>{c.content}</CommentBody>
            </CommentItem>
          ))}
          {comments.length === 0 && (
            <EmptyComment>첫 번째 댓글을 남겨보세요 💬</EmptyComment>
          )}
        </CommentList>

        <CommentInputBox>
          <CommentInputTop>
            <CommentInputLabel>별점</CommentInputLabel>
            <StarRating rating={commentRating} onChange={setCommentRating} />
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

      {lightboxIdx !== null && (
        <Overlay onClick={() => setLightboxIdx(null)}>
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
        </Overlay>
      )}

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

const Wrapper = styled.div``;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;
const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const Writer = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;
const Dot = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 13px;
`;
const DateText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;
const EditButton = styled.button`
  padding: 8px 20px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;
const DeleteButton = styled.button`
  padding: 8px 20px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;
const Stars = styled.div`
  display: flex;
  gap: 2px;
`;
const Star = styled.span`
  font-size: 22px;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#e2e8f0')};
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  transition: color 0.1s;
  line-height: 1;
`;
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const ImageItem = styled.div`
  aspect-ratio: 4/3;
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  cursor: pointer;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
  }
  &:hover img {
    transform: scale(1.04);
  }
`;
const MoreOverlay = styled.div`
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: white;
`;
const TagLine = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  font-weight: 500;
`;
const Body = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 16px;
  white-space: pre-line;
`;
const BackButton = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 48px;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;
const CommentSection = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
  padding-top: 32px;
`;
const CommentTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.textDark};
`;
const CommentCount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;
const CommentList = styled.div`
  margin-bottom: 32px;
`;
const CommentItem = styled.div`
  padding: 20px ${({ $isOwner }) => ($isOwner ? '16px' : '0')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  background: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.bgSection : 'transparent'};
  border-radius: ${({ $isOwner, theme }) => ($isOwner ? theme.radius.sm : '0')};
  margin-bottom: ${({ $isOwner }) => ($isOwner ? '8px' : '0')};
`;
const CommentTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;
const CommentWriter = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary : theme.colors.textDark};
`;
const CommentRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const CommentDate = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-left: auto;
`;
const CommentBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.7;
`;
const CommentDeleteBtn = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  &:hover {
    color: #ef4444;
  }
`;
const EmptyComment = styled.div`
  padding: 32px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
`;
const CommentInputBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;
  background: ${({ theme }) => theme.colors.bgSection};
`;
const CommentInputTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;
const CommentInputLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;
const CommentInputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;
const CommentTextArea = styled.textarea`
  flex: 1;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textDark};
  resize: none;
  height: 68px;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.base};
  background: white;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const CommentSubmitBtn = styled.button`
  padding: 0 22px;
  height: 68px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
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
  font-size: 28px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;
const LightboxPrev = styled.button`
  position: fixed;
  left: 24px;
  font-size: 52px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;
const LightboxNext = styled.button`
  position: fixed;
  right: 24px;
  font-size: 52px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;
const Modal = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
`;
const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;
const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;
const ModalCancel = styled.button`
  padding: 12px 28px;
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
  padding: 12px 28px;
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
