import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const notices = [
  {
    id: 1,
    title: '5월 워케이션 이벤트 안내',
    date: '2026.05.08',
  },
  {
    id: 2,
    title: '서비스 점검 안내',
    date: '2026.05.01',
  },
];

export default function NoticePage() {
  const navigate = useNavigate();

  return (
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
  );
}

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
