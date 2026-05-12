// src/features/admin/pages/AdminBoardPage.jsx
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  BOARD_STAT_CARDS,
  BOARD_TABS,
  BOARD_POSTS,
  POST_STATUS_MAP,
} from '../data/adminBoardData';

const TOTAL = 124;
const TOTAL_PAGES = 3;

export default function AdminBoardPage() {
  const [activeTab, setActiveTab] = useState('공지사항');
  const [checkedIds, setCheckedIds] = useState([]);
  const [pinnedIds, setPinnedIds] = useState(() => {
    // 초기 고정 상태: isFixed=true 인 항목들
    const ids = [];
    Object.values(BOARD_POSTS).forEach((posts) =>
      posts.forEach((p) => { if (p.isFixed) ids.push(p.id); })
    );
    return ids;
  });
  const [currentPage, setCurrentPage] = useState(1);

  const posts = BOARD_POSTS[activeTab] || [];
  const allIds = posts.map((p) => p.id);
  const allChecked = allIds.length > 0 && allIds.every((id) => checkedIds.includes(id));
  const selectedCount = checkedIds.filter((id) => allIds.includes(id)).length;

  const handleAllCheck = () => {
    if (allChecked) {
      setCheckedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setCheckedIds((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const handleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePin = (id) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCheckedIds([]);
    setCurrentPage(1);
  };

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>게시판 관리</PageTitle>
          <PageSub>사용자 후기, 공지사항 및 Q&A를 통합 관리합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 상단 3열: 통계 카드 2개 + 콘텐츠 신규 등록 ── */}
      <TopSection>
        {/* 카드 1: 전체 리뷰 수 */}
        <StatCard>
          <StatIconWrap $color="#6366f1" $bg="rgba(99,102,241,0.1)">
            <ReviewIcon />
          </StatIconWrap>
          <StatLabel>전체 리뷰 수</StatLabel>
          <StatValue>1,284</StatValue>
          <ProgressWrap>
            <ProgressBar $width={72} />
            <ProgressLabel>누적 데이터</ProgressLabel>
          </ProgressWrap>
        </StatCard>

        {/* 카드 2: 이번 달 리뷰 수 */}
        <StatCard>
          <StatCardTopRow>
            <StatIconWrap $color="#f97316" $bg="rgba(249,115,22,0.1)">
              <CalendarIcon />
            </StatIconWrap>
            <MonthBadge>이번 달</MonthBadge>
          </StatCardTopRow>
          <StatLabel>이번 달 리뷰 수</StatLabel>
          <StatValue>342</StatValue>
          <StatSubText>전월 동기 대비 <Strong>+12%</Strong> 상승</StatSubText>
        </StatCard>

        {/* 카드 3: 콘텐츠 신규 등록 */}
        <QuickRegisterCard>
          <QuickRegisterTitle>콘텐츠 신규 등록</QuickRegisterTitle>
          <QuickRegisterGrid>
            <QuickBtn onClick={() => {}}>
              <QuickBtnInner $variant="primary">
                <PlusCircleIcon />
                공지사항
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => {}}>
              <QuickBtnInner $variant="outline">
                <HelpSquareIcon />
                FAQ
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => {}}>
              <QuickBtnInner $variant="outline">
                <EventIcon />
                이벤트
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => {}}>
              <QuickBtnInner $variant="outline">
                <CouponIcon />
                쿠폰
              </QuickBtnInner>
            </QuickBtn>
          </QuickRegisterGrid>
        </QuickRegisterCard>
      </TopSection>

      {/* ── 게시글 테이블 ── */}
      <TableSection>
        {/* 탭 + 필터 */}
        <TabRow>
          <Tabs>
            {BOARD_TABS.map((tab) => (
              <Tab
                key={tab}
                $active={activeTab === tab}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </Tab>
            ))}
          </Tabs>
          <FilterBtn>
            <FilterIcon />
          </FilterBtn>
        </TabRow>

        <Table>
          <THead>
            <TR>
              <TH $width="48px">
                <Checkbox
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleAllCheck}
                />
              </TH>
              <TH>제목</TH>
              <TH $width="100px">작성자</TH>
              <TH $width="110px">등록일</TH>
              <TH $width="80px">조회수</TH>
              <TH $width="90px">상태</TH>
              <TH $width="56px">관리</TH>
            </TR>
          </THead>
          <TBody>
            {posts.map((post) => {
              const checked = checkedIds.includes(post.id);
              const pinned = pinnedIds.includes(post.id);
              const isDraft = post.status === 'draft';

              return (
                <TR key={post.id} $hoverable $checked={checked}>
                  <TD>
                    <Checkbox
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheck(post.id)}
                    />
                  </TD>
                  <TD>
                    <TitleCell>
                      {post.isFixed && <FixedBadge>필독</FixedBadge>}
                      <TitleText $isDraft={isDraft}>
                        {post.title}
                      </TitleText>
                      {post.hasAttachment && (
                        <AttachIcon />
                      )}
                    </TitleCell>
                  </TD>
                  <TD><AuthorText>{post.author}</AuthorText></TD>
                  <TD><DateText>{post.date}</DateText></TD>
                  <TD><ViewsText>{post.views.toLocaleString()}</ViewsText></TD>
                  <TD>
                    <StatusBadge
                      $bg={POST_STATUS_MAP[post.status].bg}
                      $color={POST_STATUS_MAP[post.status].color}
                    >
                      {POST_STATUS_MAP[post.status].label}
                    </StatusBadge>
                  </TD>
                  <TD>
                    <PinBtn
                      $pinned={pinned}
                      onClick={() => handlePin(post.id)}
                      title={pinned ? '고정 해제' : '고정'}
                    >
                      <PinSvg $pinned={pinned} />
                    </PinBtn>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>

        {/* 푸터: 페이지네이션 */}
        <TableFooter>
          <FooterInfo>
            ‖ {TOTAL}개 &nbsp;‖&nbsp; 1-10 &nbsp;‖
          </FooterInfo>
          <Pagination>
            <PageBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <DoubleChevronLeft />
            </PageBtn>
            <PageBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft />
            </PageBtn>
            {[1, 2, 3].map((p) => (
              <PageBtn key={p} $active={currentPage === p} onClick={() => setCurrentPage(p)}>
                {p}
              </PageBtn>
            ))}
            <PageBtn onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))} disabled={currentPage === TOTAL_PAGES}>
              <ChevronRight />
            </PageBtn>
            <PageBtn onClick={() => setCurrentPage(TOTAL_PAGES)} disabled={currentPage === TOTAL_PAGES}>
              <DoubleChevronRight />
            </PageBtn>
          </Pagination>
        </TableFooter>
      </TableSection>

      {/* ── 선택 항목 액션 바 (체크된 항목 1개 이상일 때만) ── */}
      {selectedCount > 0 && (
        <ActionBar>
          <ActionBarInner>
            <ActionCount>{selectedCount}개 항목 선택됨</ActionCount>
            <ActionDivider />
            <ActionBtn onClick={() => {}}>
              <EyeIcon />
              공개 전환
            </ActionBtn>
            <ActionBtn onClick={() => {}}>
              <EyeOffIcon />
              비공개 전환
            </ActionBtn>
            <ActionBtn onClick={() => {}}>
              <EditIcon />
              수정
            </ActionBtn>
            <ActionBtn $danger onClick={() => setCheckedIds([])}>
              <TrashIcon />
              삭제
            </ActionBtn>
          </ActionBarInner>
        </ActionBar>
      )}
    </PageWrapper>
  );
}

/* ── SVG Icon Components ── */

function ReviewIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function PlusCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function HelpSquareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function EventIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function CouponIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
function AttachIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
function PinSvg({ $pinned }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={$pinned ? '#244c54' : 'none'} stroke={$pinned ? '#244c54' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
function ChevronLeft() {
  return <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 1 1 5 5 9" /></svg>;
}
function ChevronRight() {
  return <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 5 5 1 9" /></svg>;
}
function DoubleChevronLeft() {
  return <svg width="9" height="9" viewBox="0 0 12 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 1 3 5 7 9" /><polyline points="11 1 7 5 11 9" /></svg>;
}
function DoubleChevronRight() {
  return <svg width="9" height="9" viewBox="0 0 12 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 5 5 1 9" /><polyline points="5 1 9 5 5 9" /></svg>;
}

/* ── Styled Components ── */

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  padding-bottom: 80px;
`;

const PageHeader = styled.div``;
const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.24px;
  line-height: 1.33;
`;
const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* 상단 3열 */
const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.4fr;
  gap: 16px;
  align-items: stretch;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StatCardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const StatIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;
const StatValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  letter-spacing: -0.5px;
  line-height: 1.2;
`;
const StatSubText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;
const Strong = styled.span`
  color: #16a34a;
  font-weight: 600;
`;

const MonthBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #ea580c;
  background: #fff7ed;
  padding: 3px 8px;
  border-radius: 999px;
`;

const ProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;
const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    left: 0; top: 0;
    height: 100%;
    width: ${({ $width }) => $width}%;
    background: ${({ theme }) => theme.colors.adminPrimary};
    border-radius: 999px;
  }
`;
const ProgressLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  white-space: nowrap;
`;

/* 콘텐츠 신규 등록 카드 */
const QuickRegisterCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const QuickRegisterTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;
const QuickRegisterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
const QuickBtn = styled.button`
  width: 100%;
`;
const QuickBtnInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s;
  cursor: pointer;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background: ${theme.colors.adminPrimary};
    color: ${theme.colors.white};
    &:hover { background: ${theme.colors.adminPrimaryLight}; }
  `
      : `
    background: ${theme.colors.white};
    color: #334155;
    border: 1px solid ${theme.colors.border};
    &:hover { background: ${theme.colors.bgSection}; }
  `}
`;

/* 게시글 테이블 */
const TableSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const TabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const Tabs = styled.div`
  display: flex;
  gap: 0;
`;
const Tab = styled.button`
  padding: 14px 18px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  color: ${({ $active, theme }) => ($active ? theme.colors.adminPrimary : theme.colors.textMuted)};
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.adminPrimary : 'transparent')};
  transition: all 0.15s;
  font-family: inherit;
  &:hover { color: ${({ theme }) => theme.colors.adminPrimary}; }
`;
const FilterBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const THead = styled.thead`
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const TBody = styled.tbody``;
const TR = styled.tr`
  border-top: ${({ $hoverable, theme }) => ($hoverable ? `1px solid ${theme.colors.borderLight}` : 'none')};
  background: ${({ $checked }) => ($checked ? '#f0fdf4' : 'transparent')};
  transition: background 0.1s;
  &:hover {
    background: ${({ $checked }) => ($checked ? '#dcfce7' : '#fafbfc')};
  }
`;
const TH = styled.th`
  padding: 11px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.3px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;
const TD = styled.td`
  padding: 14px 16px;
  vertical-align: middle;
`;

const Checkbox = styled.input`
  width: 15px;
  height: 15px;
  border-radius: 4px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.adminPrimary};
`;

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const FixedBadge = styled.span`
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  color: #c2410c;
  background: #fff7ed;
  padding: 2px 7px;
  border-radius: 4px;
`;
const TitleText = styled.span`
  font-size: 13px;
  color: ${({ $isDraft, theme }) => ($isDraft ? theme.colors.textLight : theme.colors.adminTextDark)};
  font-weight: 500;
  line-height: 1.4;
`;
const AuthorText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
`;
const DateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.number};
`;
const ViewsText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMid};
  font-family: ${({ theme }) => theme.fonts.number};
`;
const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

/* 핀 버튼 */
const PinBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  background: ${({ $pinned }) => ($pinned ? 'rgba(36,76,84,0.08)' : 'transparent')};
  &:hover {
    background: ${({ $pinned, theme }) => ($pinned ? 'rgba(36,76,84,0.14)' : theme.colors.borderLight)};
  }
`;

/* 테이블 푸터 */
const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const FooterInfo = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.number};
`;
const Pagination = styled.div`
  display: flex;
  gap: 4px;
`;
const PageBtn = styled.button`
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 4px;
  border: ${({ $active, theme }) => ($active ? 'none' : `1px solid ${theme.colors.border}`)};
  background: ${({ $active, theme }) => ($active ? theme.colors.adminPrimary : theme.colors.white)};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.textMid)};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transition: all 0.15s;
  opacity: ${({ disabled }) => (disabled ? 0.35 : 1)};
  font-family: ${({ theme }) => theme.fonts.number};
  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => ($active ? theme.colors.adminPrimary : theme.colors.bgSection)};
  }
`;

/* 액션 바 */
const ActionBar = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-10%);
  z-index: 100;
  animation: ${slideUp} 0.2s ease;
`;
const ActionBarInner = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #1e293b;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.25), 0 8px 10px -6px rgba(0,0,0,0.1);
`;
const ActionCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #e2e8f0;
  white-space: nowrap;
  padding-right: 4px;
`;
const ActionDivider = styled.div`
  width: 1px;
  height: 18px;
  background: #334155;
  margin: 0 8px;
`;
const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ $danger }) => ($danger ? '#fca5a5' : '#cbd5e1')};
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  &:hover {
    background: ${({ $danger }) => ($danger ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)')};
    color: ${({ $danger }) => ($danger ? '#f87171' : 'white')};
  }
`;
