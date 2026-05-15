import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useNoticeList } from '../hooks/useNoticeList';

export default function NoticePage() {
  const navigate = useNavigate();
  const { notices, loading, currentPage, setCurrentPage, totalPages } =
    useNoticeList();

  if (loading) return <Empty>불러오는 중...</Empty>;

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

        {notices.map((item, idx) => (
          <Row
            key={item.id}
            onClick={() => navigate(`/board/support/notice/${item.id}`)}
          >
            <ColNum>{currentPage * 10 + idx + 1}</ColNum>
            <ColTitle>{item.title}</ColTitle>
            <ColDate>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('ko-KR')
                : ''}
            </ColDate>
          </Row>
        ))}

        {notices.length === 0 && <Empty>등록된 공지사항이 없습니다.</Empty>}
      </Board>

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
const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;
const WriteButton = styled.button`
  padding: 9px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
`;
const HeaderRow = styled.div`
  display: flex;
  padding: 14px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  font-weight: 600;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 22px 10px;
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
const ColDate = styled.div`
  width: 100px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  text-align: right;
`;
const Empty = styled.div`
  padding: 48px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
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
