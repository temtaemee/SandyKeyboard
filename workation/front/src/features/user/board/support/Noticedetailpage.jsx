import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 실제 연동 시 API로 교체
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

  if (!notice) {
    return (
      <Wrapper>
        <p>존재하지 않는 공지사항입니다.</p>
      </Wrapper>
    );
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

      {/* 파일 첨부 */}
      {notice.files.length > 0 && (
        <FileSection>
          <FileTitle>첨부파일</FileTitle>
          <FileList>
            {notice.files.map((file, index) => (
              <FileItem key={index}>
                <FileIcon>📎</FileIcon>
                <FileName>{file.name}</FileName>
                <FileSize>{file.size}</FileSize>
                <DownloadBtn
                  onClick={() => {
                    // 실제 연동 시 파일 다운로드 API 호출
                    alert(`${file.name} 다운로드`);
                  }}
                >
                  다운로드
                </DownloadBtn>
              </FileItem>
            ))}
          </FileList>
        </FileSection>
      )}

      <BackButton onClick={() => navigate('/board/support/notice')}>
        ← 목록으로
      </BackButton>
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

/* ── 첨부파일 ── */

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
