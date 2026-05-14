import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getReviewList } from '../api/Reviewapi';

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

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0-based (백엔드와 맞춤)
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getReviewList(currentPage)
      .then((data) => {
        // 백엔드가 Page 객체를 반환: { content, totalPages, ... }
        setList(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => {
        console.error(err);
        setList([]);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  if (loading) return <Empty>불러오는 중...</Empty>;

  return (
    <Wrapper>
      <Board>
        <HeaderRow>
          <ColNum>번호</ColNum>
          <ColTitle>제목</ColTitle>
          <ColRating>별점</ColRating>
          <ColWriter>작성자</ColWriter>
          <ColDate>날짜</ColDate>
        </HeaderRow>

        {list.length === 0 && <Empty>등록된 후기가 없습니다.</Empty>}

        {list.map((review, idx) => (
          <Row
            key={review.id}
            onClick={() => navigate(`/board/review/detail/${review.id}`)}
          >
            {/* 번호: 최신글이 위에 오도록 역순 표시 */}
            <ColNum>{currentPage * 10 + idx + 1}</ColNum>
            <ColTitle>{review.title}</ColTitle>
            <ColRating>
              <StarDisplay rating={review.rating} />
            </ColRating>
            <ColWriter>{review.writer}</ColWriter>
            <ColDate>
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString('ko-KR')
                : ''}
            </ColDate>
          </Row>
        ))}
      </Board>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination>
          <PageBtn
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 0}
          >
            ‹
          </PageBtn>

          {Array.from({ length: totalPages }, (_, i) => (
            <PageBtn
              key={i}
              $active={i === currentPage}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </PageBtn>
          ))}

          <PageBtn
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages - 1}
          >
            ›
          </PageBtn>
        </Pagination>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Empty = styled.div`
  padding: 48px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
`;

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
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 32px;
`;

const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.textMid)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.bgSection};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;
