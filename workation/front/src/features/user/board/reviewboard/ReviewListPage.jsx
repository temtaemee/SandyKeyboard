import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const dummyList = [
  {
    reviewId: 1,
    title: '제주 워케이션 후기',
    writer: 'user01',
    date: '2개월 전',
    rating: 5,
  },
  {
    reviewId: 2,
    title: '부산 여행 후기',
    writer: 'user02',
    date: '1개월 전',
    rating: 4,
  },
  {
    reviewId: 3,
    title: '서울 스튜디오 이용 후기',
    writer: 'user03',
    date: '3주 전',
    rating: 5,
  },
];

function StarDisplay({ rating }) {
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} $filled={n <= rating}>
          ★
        </Star>
      ))}
    </Stars>
  );
}

export default function ReviewListPage() {
  const navigate = useNavigate();

  return (
    <Board>
      <HeaderRow>
        <ColNum>번호</ColNum>
        <ColTitle>제목</ColTitle>
        <ColRating>별점</ColRating>
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
          <ColRating>
            <StarDisplay rating={review.rating} />
          </ColRating>
          <ColWriter>{review.writer}</ColWriter>
          <ColDate>{review.date}</ColDate>
        </Row>
      ))}
    </Board>
  );
}

const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 0.12s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

const ColNum = styled.div`
  width: 60px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

const ColTitle = styled.div`
  flex: 1;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: 500;
`;

const ColRating = styled.div`
  width: 120px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const ColWriter = styled.div`
  width: 80px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  text-align: center;
`;

const ColDate = styled.div`
  width: 90px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  text-align: right;
`;

const Stars = styled.div`
  display: flex;
  gap: 1px;
`;

const Star = styled.span`
  font-size: 15px;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#e2e8f0')};
  line-height: 1;
`;
