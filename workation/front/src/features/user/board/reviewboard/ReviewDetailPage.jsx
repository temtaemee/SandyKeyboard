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

// 예시 댓글 데이터
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

  if (!review) {
    return (
      <Wrapper>
        <p>존재하지 않는 후기입니다.</p>
      </Wrapper>
    );
  }

  function handleEdit() {
    navigate(`/board/review/write`);
  }

  function handleDelete() {
    setShowConfirm(false);
    navigate('/board/review/list');
  }

  function handleCommentSubmit() {
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      writer: 'user01', // 실제 연동 시 로그인 유저로 교체
      date: new Date()
        .toLocaleDateString('ko-KR')
        .replace(/\. /g, '.')
        .replace('.', '.')
        .slice(0, 10),
      content: commentInput.trim(),
    };
    setComments((prev) => [...prev, newComment]);
    setCommentInput('');
  }

  function handleCommentDelete(commentId) {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setDeleteCommentId(null);
  }

  return (
    <Wrapper>
      {/* ── 본문 ── */}
      <DetailTitle>{review.title}</DetailTitle>

      <Meta>
        <span>{review.writer}</span>
        <span>{review.date}</span>
      </Meta>

      <Divider />

      <Body>{review.content}</Body>

      <ActionRow>
        <BackButton onClick={() => navigate('/board/review/list')}>
          ← 목록으로
        </BackButton>
        <RightButtons>
          <EditButton onClick={handleEdit}>수정</EditButton>
          <DeleteButton onClick={() => setShowConfirm(true)}>삭제</DeleteButton>
        </RightButtons>
      </ActionRow>

      {/* ── 댓글 섹션 ── */}
      <CommentSection>
        <CommentTitle>
          댓글 <CommentCount>{comments.length}</CommentCount>
        </CommentTitle>

        {/* 댓글 목록 */}
        <CommentList>
          {comments.map((comment) => (
            <CommentItem key={comment.id}>
              <CommentTop>
                <CommentWriter>{comment.writer}</CommentWriter>
                <CommentDate>{comment.date}</CommentDate>
              </CommentTop>
              <CommentBody>{comment.content}</CommentBody>
              <CommentDeleteBtn onClick={() => setDeleteCommentId(comment.id)}>
                삭제
              </CommentDeleteBtn>
            </CommentItem>
          ))}

          {comments.length === 0 && (
            <EmptyComment>첫 번째 댓글을 남겨보세요 💬</EmptyComment>
          )}
        </CommentList>

        {/* 댓글 입력 */}
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

      {/* ── 게시글 삭제 확인 모달 ── */}
      {showConfirm && (
        <Overlay>
          <Modal>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowConfirm(false)}>
                취소
              </ModalCancel>
              <ModalConfirm onClick={handleDelete}>삭제</ModalConfirm>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}

      {/* ── 댓글 삭제 확인 모달 ── */}
      {deleteCommentId && (
        <Overlay>
          <Modal>
            <ModalText>댓글을 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setDeleteCommentId(null)}>
                취소
              </ModalCancel>
              <ModalConfirm
                onClick={() => handleCommentDelete(deleteCommentId)}
              >
                삭제
              </ModalConfirm>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
    </Wrapper>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div``;

const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Meta = styled.div`
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
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
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #f3f4f6;
  }
`;

const EditButton = styled.button`
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #f3f4f6;
  }
`;

const DeleteButton = styled.button`
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #dc2626;
  }
`;

/* ── 댓글 섹션 ── */

const CommentSection = styled.div`
  border-top: 2px solid black;
  padding-top: 32px;
`;

const CommentTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111;
`;

const CommentCount = styled.span`
  font-size: 15px;
  color: #2c6480;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 32px;
`;

const CommentItem = styled.div`
  padding: 20px 10px;
  border-bottom: 1px solid #e5e7eb;
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
  color: #111;
`;

const CommentDate = styled.span`
  font-size: 13px;
  color: #bbb;
`;

const CommentBody = styled.p`
  font-size: 15px;
  color: #333;
  line-height: 1.7;
`;

const CommentDeleteBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 10px;
  font-size: 13px;
  color: #bbb;
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
  color: #bbb;
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
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
  resize: none;
  height: 72px;
  line-height: 1.6;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
  &:focus {
    border-color: #2c6480;
  }
`;

const CommentSubmitBtn = styled.button`
  padding: 0 24px;
  height: 72px;
  border-radius: 12px;
  border: none;
  background: black;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: #222;
  }
`;

/* ── 모달 공통 ── */

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
  background: white;
  border-radius: 20px;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalCancel = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #f3f4f6;
  }
`;

const ModalConfirm = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #dc2626;
  }
`;
