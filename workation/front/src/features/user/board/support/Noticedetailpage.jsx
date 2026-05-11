import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const noticeData = {
  1: {
    id: 1,
    title: '5월 워케이션 이벤트 안내',
    date: '2026.05.08',
    writer: '운영팀',
    content: `안녕하세요, 모래묻은 키보드 운영팀입니다.

5월을 맞아 특별한 워케이션 이벤트를 진행합니다!

📌 이벤트 내용
- 기간 : 2026년 5월 1일 ~ 5월 31일
- 대상 : 5월 중 신규 예약 고객 전원
- 혜택 : 숙소 이용 금액 10% 추가 할인 + 웰컴 키트 증정

📌 참여 방법
예약 시 쿠폰 코드 [MAY2026] 를 입력하시면 자동으로 할인이 적용됩니다.

많은 참여 부탁드립니다. 감사합니다! 🙏`,
    files: [
      { name: '5월_이벤트_안내문.pdf', size: '1.2MB' },
      { name: '웰컴키트_구성품.jpg', size: '340KB' },
    ],
  },
  2: {
    id: 2,
    title: '서비스 점검 안내',
    date: '2026.05.01',
    writer: '운영팀',
    content: `안녕하세요, 모래묻은 키보드 운영팀입니다.

서비스 안정성 향상을 위한 정기 점검을 아래와 같이 진행할 예정입니다.

📌 점검 일정
- 일시 : 2026년 5월 10일 (일) 오전 2:00 ~ 오전 6:00 (약 4시간)
- 영향 : 점검 시간 동안 서비스 전체 이용 불가

📌 유의사항
점검 시간 중에는 예약, 결제, 로그인 등 모든 서비스 이용이 제한됩니다.
사전에 미리 예약을 완료해 주시기 바랍니다.

불편을 드려 죄송합니다. 더 나은 서비스로 보답하겠습니다.`,
    files: [],
  },
};

export default function NoticeDetailPage() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const notice = noticeData[noticeId];

  const [showConfirm, setShowConfirm] = useState(false);

  if (!notice) {
    return (
      <Wrapper>
        <p>존재하지 않는 공지사항입니다.</p>
      </Wrapper>
    );
  }

  function handleEdit() {
    // 실제 연동 시 navigate(`/board/support/notice/edit/${noticeId}`) 로 변경
    navigate('/board/support/notice/write');
  }

  function handleDelete() {
    // 실제 연동 시 API 삭제 호출 후 navigate
    setShowConfirm(false);
    navigate('/board/support/notice');
  }

  return (
    <Wrapper>
      <DetailTitle>{notice.title}</DetailTitle>

      <Meta>
        <MetaItem>
          <MetaLabel>작성자</MetaLabel>
          <MetaValue>{notice.writer}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>작성일</MetaLabel>
          <MetaValue>{notice.date}</MetaValue>
        </MetaItem>
      </Meta>

      <Divider />

      <Body>{notice.content}</Body>

      {/* 첨부파일 */}
      {notice.files.length > 0 && (
        <FileSection>
          <FileTitle>첨부파일</FileTitle>
          <FileList>
            {notice.files.map((file, index) => (
              <FileItem key={index}>
                <FileIcon>📎</FileIcon>
                <FileName>{file.name}</FileName>
                <FileSize>{file.size}</FileSize>
                <DownloadBtn onClick={() => alert(`${file.name} 다운로드`)}>
                  다운로드
                </DownloadBtn>
              </FileItem>
            ))}
          </FileList>
        </FileSection>
      )}

      <ActionRow>
        <BackButton onClick={() => navigate('/board/support/notice')}>
          ← 목록으로
        </BackButton>
        <RightButtons>
          <EditButton onClick={handleEdit}>수정</EditButton>
          <DeleteButton onClick={() => setShowConfirm(true)}>삭제</DeleteButton>
        </RightButtons>
      </ActionRow>

      {/* 삭제 확인 모달 */}
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
    </Wrapper>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div``;

const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111;
`;

const Meta = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetaLabel = styled.span`
  font-size: 13px;
  color: #bbb;
`;

const MetaValue = styled.span`
  font-size: 13px;
  color: #555;
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const Body = styled.pre`
  font-size: 15px;
  line-height: 1.9;
  color: #333;
  margin-bottom: 48px;
  white-space: pre-wrap;
  font-family: inherit;
`;

const FileSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 40px;
`;

const FileTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #999;
  margin-bottom: 14px;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FileIcon = styled.span`
  font-size: 16px;
`;

const FileName = styled.span`
  flex: 1;
  font-size: 14px;
  color: #333;
`;

const FileSize = styled.span`
  font-size: 13px;
  color: #bbb;
`;

const DownloadBtn = styled.button`
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* ── 삭제 확인 모달 ── */

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
