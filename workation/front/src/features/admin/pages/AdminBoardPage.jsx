// src/features/admin/pages/AdminBoardPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  MessageSquare, Calendar, PlusCircle, HelpCircle, Star, Tag,
  Paperclip, MapPin, Pencil, Trash2, X,
  ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight,
  ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import {
  BOARD_STAT_CARDS,
  BOARD_POSTS,
} from '../data/adminBoardData';
import { BOARD_TABS } from '../data/adminBoardConstants';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';

const TOTAL = 124;
const TOTAL_PAGES = 3;

export default function AdminBoardPage() {
  const [activeTab, setActiveTab] = useState('공지사항');
  const [pinnedIds, setPinnedIds] = useState(() => {
    const ids = [];
    Object.values(BOARD_POSTS).forEach((posts) =>
      posts.forEach((p) => { if (p.isFixed) ids.push(p.id); })
    );
    return ids;
  });

  const { currentPage, goToPage, reset: resetPage } = usePagination();

  const posts = BOARD_POSTS[activeTab] || [];

  // 신규 등록 모달
  const [registerModal, setRegisterModal] = useState(null); // null | '공지사항' | 'FAQ' | '이벤트' | '쿠폰'
  const [formData, setFormData] = useState({});

  const openRegisterModal = (type) => {
    setRegisterModal(type);
    setFormData({});
  };

  const closeRegisterModal = () => {
    setRegisterModal(null);
    setFormData({});
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterSubmit = () => {
    // TODO: 서버 연동 시 API 호출
    console.log(`[${registerModal}] 등록:`, formData);
    closeRegisterModal();
  };

  const handlePin = (id) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
            <QuickBtn onClick={() => openRegisterModal('공지사항')}>
              <QuickBtnInner>
                <PlusCircleIcon />
                공지사항
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => openRegisterModal('FAQ')}>
              <QuickBtnInner>
                <HelpSquareIcon />
                FAQ
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => openRegisterModal('이벤트')}>
              <QuickBtnInner>
                <EventIcon />
                이벤트
              </QuickBtnInner>
            </QuickBtn>
            <QuickBtn onClick={() => openRegisterModal('쿠폰')}>
              <QuickBtnInner>
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
        </TabRow>

        <Table>
          <THead>
            <TR>
              <TH $width="280px">제목</TH>
              <TH $width="160px">작성자</TH>
              <TH $width="150px">등록일</TH>
              <TH $width="120px">관리</TH>
            </TR>
          </THead>
          <TBody>
            {posts.map((post) => {
              const pinned = pinnedIds.includes(post.id);

              return (
                <TR key={post.id} $hoverable>
                  <TD>
                    <TitleCell>
                      {post.isFixed && <FixedBadge>필독</FixedBadge>}
                      <TitleText>{post.title}</TitleText>
                      {post.hasAttachment && <AttachIcon />}
                    </TitleCell>
                  </TD>
                  <TD><AuthorText>{post.author}</AuthorText></TD>
                  <TD><DateText>{post.date}</DateText></TD>
                  <TD>
                    <RowActions>
                      <PinBtn
                        $pinned={pinned}
                        onClick={() => handlePin(post.id)}
                        title={pinned ? '고정 해제' : '고정'}
                      >
                        <PinSvg $pinned={pinned} />
                      </PinBtn>
                      <RowActionBtn onClick={() => {}} title="수정">
                        <Pencil size={14} color="#475569" />
                      </RowActionBtn>
                      <RowActionBtn $danger onClick={() => {}} title="삭제">
                        <Trash2 size={14} color="#ef4444" />
                      </RowActionBtn>
                    </RowActions>
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

      {/* ── 신규 등록 모달 ── */}
      {registerModal && (
        <ModalOverlay onClick={closeRegisterModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{registerModal} 등록</ModalTitle>
              <ModalCloseBtn onClick={closeRegisterModal}><X size={18} /></ModalCloseBtn>
            </ModalHeader>

            <ModalBody>
              {registerModal === '쿠폰' ? (
                <>
                  <FieldGroup>
                    <FieldLabel>쿠폰 이름</FieldLabel>
                    <FieldInput
                      placeholder="쿠폰 이름을 입력하세요"
                      value={formData.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldRow>
                    <FieldGroup>
                      <FieldLabel>할인율 (%)</FieldLabel>
                      <FieldInput
                        type="number"
                        min={1}
                        max={100}
                        placeholder="예: 10"
                        value={formData.discountRate || ''}
                        onChange={(e) => handleFormChange('discountRate', e.target.value)}
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>수량</FieldLabel>
                      <FieldInput
                        type="number"
                        min={1}
                        placeholder="예: 100"
                        value={formData.quantity || ''}
                        onChange={(e) => handleFormChange('quantity', e.target.value)}
                      />
                    </FieldGroup>
                  </FieldRow>
                  <FieldGroup>
                    <FieldLabel>유효 기간 (일)</FieldLabel>
                    <FieldInputWithUnit>
                      <FieldInput
                        type="number"
                        min={1}
                        placeholder="예: 30"
                        value={formData.validDays || ''}
                        onChange={(e) => handleFormChange('validDays', e.target.value)}
                      />
                      <FieldUnit>일</FieldUnit>
                    </FieldInputWithUnit>
                  </FieldGroup>
                </>
              ) : (
                <>
                  <FieldGroup>
                    <FieldLabel>제목</FieldLabel>
                    <FieldInput
                      placeholder="제목을 입력하세요"
                      value={formData.title || ''}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <FieldLabel>내용</FieldLabel>
                    <FieldTextarea
                      placeholder="내용을 입력하세요"
                      value={formData.content || ''}
                      onChange={(e) => handleFormChange('content', e.target.value)}
                    />
                  </FieldGroup>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <CancelBtn onClick={closeRegisterModal}>취소</CancelBtn>
              <SubmitBtn onClick={handleRegisterSubmit}>등록</SubmitBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
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
function AttachIcon() { return <Paperclip size={12} color="#94a3b8" style={{ flexShrink: 0 }} />; }
function PinSvg({ $pinned }) {
  return <MapPin size={14} fill={$pinned ? '#244c54' : 'none'} color={$pinned ? '#244c54' : '#94a3b8'} />;
}
function ChevronLeft() { return <LucideChevronLeft size={14} color="#475569" strokeWidth={1.5} />; }
function ChevronRight() { return <LucideChevronRight size={14} color="#475569" strokeWidth={1.5} />; }
function DoubleChevronLeft() { return <ChevronsLeft size={14} color="#475569" strokeWidth={1.5} />; }
function DoubleChevronRight() { return <ChevronsRight size={14} color="#475569" strokeWidth={1.5} />; }

/* ── Styled Components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  transition: background 0.1s;
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;
const TH = styled.th`
  padding: 11px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.3px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;
const TD = styled.td`
  padding: 14px 20px;
  vertical-align: middle;
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
  color: ${({ theme }) => theme.colors.adminTextDark};
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

const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RowActionBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover {
    background: ${({ $danger }) => ($danger ? 'rgba(239,68,68,0.08)' : theme => theme.colors?.borderLight || '#f1f5f9')};
  }
`;

/* ── 신규 등록 모달 ── */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  width: 480px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #0d1c2e;
`;

const ModalCloseBtn = styled.button`
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s;
  &:hover { color: #475569; }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const FieldRow = styled.div`
  display: flex;
  gap: 12px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #334155;
`;

const FieldInputWithUnit = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  & > input { width: 100%; padding-right: 36px; }
`;

const FieldUnit = styled.span`
  position: absolute;
  right: 12px;
  font-size: 13px;
  color: #64748b;
  pointer-events: none;
`;

const FieldInput = styled.input`
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  color: #0d1c2e;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder { color: #94a3b8; }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36,76,84,0.08);
  }
`;

const FieldTextarea = styled.textarea`
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  color: #0d1c2e;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder { color: #94a3b8; }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36,76,84,0.08);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const CancelBtn = styled.button`
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  transition: background 0.15s;
  &:hover { background: #f1f5f9; }
`;

const SubmitBtn = styled.button`
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  background: #244c54;
  color: white;
  border: 1px solid #244c54;
  transition: background 0.15s;
  &:hover { background: #1d3d44; }
`;
