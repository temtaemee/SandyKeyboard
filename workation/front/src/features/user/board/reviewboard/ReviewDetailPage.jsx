import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 예시 이미지 (Unsplash 무료 이미지)
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=450&fit=crop',
];

const dummyData = {
  1: {
    title: '제주 워케이션 후기',
    writer: 'user01',
    date: '2개월 전',
    rating: 5,
    tag: '제주 바다뷰 스튜디오 — 인터넷 빵빵하고 뷰 최고!',
    content: `길동역 주변에 위치한 마리호텔은 접근성이 뛰어나고 주차장이 넓어서 참 좋습니다. 지하주차장에 주차하고 엘리베이터 타고 프론트에서 체크인 하고 로비에 커피머신이 있어 아메리노 내려서 객실로 입실하니 객실은 조금 작지만 아담하고 인테리어는 심플하고 깔끔합니다.

침구류도 깨끗하게 세팅되어 있어 기분 좋습니다. 냉장고 안에 생수도 훌륭해요. 일회용품은 프론트에서 2000원에 구입해야 하고 충전기도 대여해 줍니다. 화장실도 무선 비데 설치로 편리하고 뷰도 아주 좋았습니다.`,
    images: SAMPLE_IMAGES,
  },
  2: {
    title: '부산 여행 후기',
    writer: 'user02',
    date: '1개월 전',
    rating: 4,
    tag: '부산 해운대 숙소 — 바다뷰 너무 좋아요',
    content: `바다 뷰가 너무 아름다웠습니다. 창문을 열면 파도 소리가 들려서 힐링이 되었어요. 조식도 맛있고 직원분들도 친절하셨습니다. 다음에 또 오고 싶어요.`,
    images: SAMPLE_IMAGES,
  },
  3: {
    title: '서울 스튜디오 이용 후기',
    writer: 'user03',
    date: '3주 전',
    rating: 5,
    tag: '서울 강남 스튜디오 — 접근성 최고!',
    content: `접근성이 뛰어나고 시설이 깔끔했습니다. 지하철역 바로 앞이라 이동이 너무 편했어요. 넓은 책상과 빠른 와이파이 덕분에 업무도 잘 됐습니다. 강력 추천합니다!`,
    images: SAMPLE_IMAGES,
  },
};

const initialComments = [
  {
    id: 1,
    writer: '제휴점 답변',
    date: '2개월 전',
    content:
      '저희 숙소를 이용해주셔서 진심으로 감사드립니다. 자주 오셔서 편히 쉬시다 가실 수 있도록 항상 꼼꼼하게 객실 관리를 해놓겠습니다. 앞으로도 많은 이용 부탁드리겠습니다',
    isOwner: true,
  },
];

/* ── 별점 컴포넌트 ── */
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
  const review = dummyData[reviewId];

  const [showConfirm, setShowConfirm] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (!review)
    return (
      <Wrapper>
        <p>존재하지 않는 후기입니다.</p>
      </Wrapper>
    );

  function handleDelete() {
    setShowConfirm(false);
    navigate('/board/review/list');
  }

  function handleCommentSubmit() {
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        writer: 'user01',
        date: '방금 전',
        rating: commentRating,
        content: commentInput.trim(),
        isOwner: false,
      },
    ]);
    setCommentInput('');
    setCommentRating(5);
  }

  function handleCommentDelete(id) {
    setComments((prev) => prev.filter((c) => c.id !== id));
    setDeleteCommentId(null);
  }

  return (
    <Wrapper>
      {/* ── 헤더: 별점 + 작성자 + 수정/삭제 ── */}
      <Header>
        <HeaderLeft>
          <StarRating rating={review.rating} />
          <MetaRow>
            <Writer>{review.writer}</Writer>
            <Dot>·</Dot>
            <DateText>{review.date}</DateText>
          </MetaRow>
        </HeaderLeft>
        <ActionButtons>
          <EditButton onClick={() => navigate('/board/review/write')}>
            수정
          </EditButton>
          <DeleteButton onClick={() => setShowConfirm(true)}>삭제</DeleteButton>
        </ActionButtons>
      </Header>

      {/* ── 사진 4장 그리드 ── */}
      {review.images?.length > 0 && (
        <ImageGrid>
          {review.images.slice(0, 4).map((src, i) => (
            <ImageItem key={i} onClick={() => setLightboxIdx(i)}>
              <img src={src} alt={`후기 이미지 ${i + 1}`} />
              {/* 4번째 사진이 더 있을 때 +N 표시 */}
              {i === 3 && review.images.length > 4 && (
                <MoreOverlay>+{review.images.length - 4}</MoreOverlay>
              )}
            </ImageItem>
          ))}
        </ImageGrid>
      )}

      {/* ── 태그 ── */}
      {review.tag && <TagLine>{review.tag}</TagLine>}

      {/* ── 본문 ── */}
      <Body>{review.content}</Body>

      {/* ── 목록으로 ── */}
      <BackButton onClick={() => navigate('/board/review/list')}>
        ← 목록으로
      </BackButton>

      {/* ── 댓글 섹션 ── */}
      <CommentSection>
        <CommentTitle>
          댓글 <CommentCount>{comments.length}</CommentCount>
        </CommentTitle>

        <CommentList>
          {comments.map((c) => (
            <CommentItem key={c.id} $isOwner={c.isOwner}>
              <CommentTop>
                <CommentWriter $isOwner={c.isOwner}>{c.writer}</CommentWriter>
                {!c.isOwner && c.rating && <StarRating rating={c.rating} />}
                <CommentDate>{c.date}</CommentDate>
              </CommentTop>
              <CommentBody>{c.content}</CommentBody>
              <CommentDeleteBtn onClick={() => setDeleteCommentId(c.id)}>
                삭제
              </CommentDeleteBtn>
            </CommentItem>
          ))}
          {comments.length === 0 && (
            <EmptyComment>첫 번째 댓글을 남겨보세요 💬</EmptyComment>
          )}
        </CommentList>

        {/* 댓글 입력 */}
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

      {/* ── 라이트박스 ── */}
      {lightboxIdx !== null && (
        <Overlay onClick={() => setLightboxIdx(null)}>
          <LightboxImg
            src={review.images[lightboxIdx]}
            alt="확대 이미지"
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
          {lightboxIdx < review.images.length - 1 && (
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

      {/* ── 게시글 삭제 모달 ── */}
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

/* ── Styled Components ── */

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
  background: ${({ theme }) => theme.colors.white};
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
  transition: background 0.15s;
  &:hover {
    background: #dc2626;
  }
`;

/* 별점 */
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

/* 사진 4장 그리드 */
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
  position: absolute;
  inset: 0;
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
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 48px;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

/* 댓글 */
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
  position: absolute;
  top: 20px;
  right: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  background: none;
  border: none;
  cursor: pointer;
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
  line-height: 1.6;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.base};
  background: ${({ theme }) => theme.colors.white};
  transition: border-color 0.15s;
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
  white-space: nowrap;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

/* 라이트박스 */
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

/* 모달 */
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
  background: ${({ theme }) => theme.colors.white};
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
  background: ${({ theme }) => theme.colors.white};
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
