import { useNavigate } from 'react-router-dom';
import { useNoticeList } from '../hooks/useNoticeList';
import {
  Wrapper,
  TopRow,
  WriteButton,
  Board,
  HeaderRow,
  Row,
  PinnedRow,
  TitleWrap,
  PinnedTitle,
  NoticeBadge,
  ColNum,
  ColTitle,
  ColDate,
  Empty,
  Pagination,
  PageBtn,
} from '../styles/NoticePage.styles';

export default function NoticePage() {
  const navigate = useNavigate();
  const { notices, loading, currentPage, setCurrentPage, totalPages } =
    useNoticeList();

  // pinYn === 'Y' 인 것만 상단 고정
  const fixedNotices = notices.filter((n) => n.pinYn === 'Y');
  // 나머지는 일반 게시글
  const normalNotices = notices.filter((n) => n.pinYn !== 'Y');

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

        {/* 상단 고정 공지 */}
        {fixedNotices.map((item) => (
          <PinnedRow
            key={item.id}
            onClick={() => navigate(`/board/support/notice/${item.id}`)}
          >
            <ColNum>—</ColNum>
            <ColTitle>
              <TitleWrap>
                <NoticeBadge>📌 공지</NoticeBadge>
                <PinnedTitle>{item.title}</PinnedTitle>
              </TitleWrap>
            </ColTitle>
            <ColDate>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('ko-KR')
                : ''}
            </ColDate>
          </PinnedRow>
        ))}

        {/* 일반 게시글 */}
        {normalNotices.map((item, idx) => (
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
