import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const dummyData = {
  1: {
    title: '제주 워케이션 후기',
    writer: 'user01',
    date: '2026.05.07',
    content:
      '정말 좋은 공간이었습니다. 뷰도 좋고 인터넷 속도도 빨라서 작업하기 최고였어요!',
  },
  2: {
    title: '부산 여행 후기',
    writer: 'user02',
    date: '2026.05.06',
    content: '바다 뷰가 너무 아름다웠습니다. 다음에 또 오고 싶어요.',
  },
  3: {
    title: '서울 스튜디오 이용 후기',
    writer: 'user03',
    date: '2026.05.05',
    content: '접근성이 뛰어나고 시설이 깔끔했습니다. 강력 추천합니다!',
  },
};

const initialComments = [
  {
    id: 1,
    writer: 'user99',
    date: '2026.05.08',
    content: '저도 다녀왔는데 정말 좋더라고요! 강추합니다 😊',
  },
];

export default function ReviewDetailPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const review = dummyData[reviewId];

  const [showConfirm, setShowConfirm] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);

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
        date: new Date()
          .toLocaleDateString('ko-KR')
          .replace(/\. /g, '.')
          .slice(0, 10),
        content: commentInput.trim(),
      },
    ]);
    setCommentInput('');
  }

  function handleCommentDelete(id) {
    setComments((prev) => prev.filter((c) => c.id !== id));
    setDeleteCommentId(null);
  }

  return (
    <Wrapper>
      <DetailTitle>{review.title}</DetailTitle>

      <Meta>
        <MetaItem>
          <MetaLabel>작성자</MetaLabel>
          <MetaValue>{review.writer}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>작성일</MetaLabel>
          <MetaValue>{review.date}</MetaValue>
        </MetaItem>
      </Meta>

      <Divider />
      <Body>{review.content}</Body>

      <ActionRow>
        <BackButton onClick={() => navigate('/board/review/list')}>
          ← 목록으로
        </BackButton>
        <RightButtons>
          <EditButton onClick={() => navigate('/board/review/write')}>
            수정
          </EditButton>
          <DeleteButton onClick={() => setShowConfirm(true)}>삭제</DeleteButton>
        </RightButtons>
      </ActionRow>

      {/* 댓글 섹션 */}
      <CommentSection>
        <CommentTitle>
          댓글 <CommentCount>{comments.length}</CommentCount>
        </CommentTitle>

        <CommentList>
          {comments.map((c) => (
            <CommentItem key={c.id}>
              <CommentTop>
                <CommentWriter>{c.writer}</CommentWriter>
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
      </CommentSection>

      {/* 게시글 삭제 모달 */}
      {showConfirm && (
        <Overlay>
          <Modal>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowConfirm(false)}>
                취소
              </ModalCancel>
              <ModalDelete onClick={handleDelete}>삭제</ModalDelete>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}

      {/* 댓글 삭제 모달 */}
      {deleteCommentId && (
        <Overlay>
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
        </Overlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Meta = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetaLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const MetaValue = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 32px;
`;

const Body = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 48px;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 64px;
`;

const RightButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const BackButton = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

const EditButton = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #dc2626;
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
  padding: 20px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`;

const CommentTop = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
`;

const CommentWriter = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
`;

const CommentDate = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const CommentBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.7;
`;

const CommentDeleteBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 10px;
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

const CommentInputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const CommentTextArea = styled.textarea`
  flex: 1;
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textDark};
  resize: none;
  height: 72px;
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
  padding: 0 24px;
  height: 72px;
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

/* 모달 */

const Overlay = styled.div`
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
