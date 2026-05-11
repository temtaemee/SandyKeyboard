import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const notices = [
  { id: 1, title: '5월 워케이션 이벤트 안내', date: '2026.05.08' },
  { id: 2, title: '서비스 점검 안내', date: '2026.05.01' },
];

export default function NoticePage() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <TopRow>
        <WriteButton onClick={() => navigate('/board/support/notice/write')}>
          ✏️ 글쓰기
        </WriteButton>
      </TopRow>

      <Board>
        <HeaderRow>
          <ColNum>번호</ColNum>
          <ColTitle>제목</ColTitle>
          <ColDate>날짜</ColDate>
        </HeaderRow>

        {notices.map((item) => (
          <Row
            key={item.id}
            onClick={() => navigate(`/board/support/notice/${item.id}`)}
          >
            <ColNum>{item.id}</ColNum>
            <ColTitle>{item.title}</ColTitle>
            <ColDate>{item.date}</ColDate>
          </Row>
        ))}
      </Board>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const WriteButton = styled.button`
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  background: black;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #222;
  }
`;

const Board = styled.div`
  border-top: 2px solid black;
`;

const HeaderRow = styled.div`
  display: flex;
  padding: 14px 10px;
  border-bottom: 1px solid #e5e7eb;
  color: #999;
  font-size: 14px;
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 24px 10px;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;

  &:hover {
    background: #fafafa;
  }
`;

const ColNum = styled.div`
  width: 60px;
  flex-shrink: 0;
  color: #999;
`;

const ColTitle = styled.div`
  flex: 1;
  font-size: 16px;
  color: #111;
`;

const ColDate = styled.div`
  width: 100px;
  flex-shrink: 0;
  color: #999;
  text-align: right;
`;
