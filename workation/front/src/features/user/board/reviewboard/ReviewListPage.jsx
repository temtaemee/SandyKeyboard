import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const dummyList = [
  {
    reviewId: 1,
    title: '제주 워케이션 후기',
    writer: 'user01',
    date: '2026.05.07',
  },
  {
    reviewId: 2,
    title: '부산 여행 후기',
    writer: 'user02',
    date: '2026.05.06',
  },
  {
    reviewId: 3,
    title: '서울 스튜디오 이용 후기',
    writer: 'user03',
    date: '2026.05.05',
  },
];

export default function ReviewListPage() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Board>
        <HeaderRow>
          <ColNum>번호</ColNum>
          <ColTitle>제목</ColTitle>
          <ColWriter>작성자</ColWriter>
          <ColDate>날짜</ColDate>
        </HeaderRow>

        {dummyList.map((review) => (
          <Row
            key={review.reviewId}
            onClick={() => navigate(`/board/review/detail/${review.reviewId}`)}
          >
            <ColNum>{review.reviewId}</ColNum>
            <ColTitle>{review.title}</ColTitle>
            <ColWriter>{review.writer}</ColWriter>
            <ColDate>{review.date}</ColDate>
          </Row>
        ))}
      </Board>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

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

const ColWriter = styled.div`
  width: 100px;
  flex-shrink: 0;
  color: #999;
  text-align: center;
`;

const ColDate = styled.div`
  width: 100px;
  flex-shrink: 0;
  color: #999;
  text-align: right;
`;
