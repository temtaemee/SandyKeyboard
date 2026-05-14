// src/features/admin/pages/AdminBoardPage.jsx
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  MessageSquare, Calendar, PlusCircle, HelpCircle, Star, Tag,
  Filter, Paperclip, MapPin, Eye, EyeOff, Pencil, Trash2,
  ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight,
  ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import {
  BOARD_STAT_CARDS,
  BOARD_TABS,
  BOARD_POSTS,
  POST_STATUS_MAP,
} from '../data/adminBoardData';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import StatusBadge from '../components/common/StatusBadge';

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
  const { currentPage, goToPage, goToPrev, goToNext, reset: resetPage } = usePagination();

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
    resetPage();
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
              <QuickBtnInner >
                <PlusCircleIcon />
                공지사항
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => {}}>
              <QuickBtnInner >
                <HelpSquareIcon />
                FAQ
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => {}}>
              <QuickBtnInner >
                <EventIcon />
                이벤트
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => {}}>
              <QuickBtnInner >
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
          <AdminPagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={goToPage}
          />
          <div style={{ width: '120px' }} />
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

/* ── Icon Components ── */
function ReviewIcon() { return <MessageSquare size={20} />; }
function CalendarIcon() { return <Calendar size={20} />; }
function PlusCircleIcon() { return <PlusCircle size={14} strokeWidth={2.5} />; }
function HelpSquareIcon() { return <HelpCircle size={14} />; }
function EventIcon() { return <Star size={14} />; }
function CouponIcon() { return <Tag size={14} />; }
function FilterIcon() { return <Filter size={14} color="#64748b" />; }
function AttachIcon() { return <Paperclip size={12} color="#94a3b8" style={{ flexShrink: 0 }} />; }
function PinSvg({ $pinned }) {
  return <MapPin size={14} fill={$pinned ? '#244c54' : 'none'} color={$pinned ? '#244c54' : '#94a3b8'} />;
}
function EyeIcon() { return <Eye size={13} />; }
function EyeOffIcon() { return <EyeOff size={13} />; }
function EditIcon() { return <Pencil size={13} />; }
function TrashIcon() { return <Trash2 size={13} />; }
function ChevronLeft() { return <LucideChevronLeft size={14} color="#475569" strokeWidth={1.5} />; }
function ChevronRight() { return <LucideChevronRight size={14} color="#475569" strokeWidth={1.5} />; }
function DoubleChevronLeft() { return <ChevronsLeft size={14} color="#475569" strokeWidth={1.5} />; }
function DoubleChevronRight() { return <ChevronsRight size={14} color="#475569" strokeWidth={1.5} />;
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

  background: ${({ theme }) => theme.colors.white};
  color: #334155;
  border: 1px solid ${({ theme }) => theme.colors.border};
  &:hover {
    background: ${({ theme }) => theme.colors.adminPrimary};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.adminPrimary};
  }
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

/* 페이지네이션 푸터 */
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
