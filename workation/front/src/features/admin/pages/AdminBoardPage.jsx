// src/features/admin/pages/AdminBoardPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  MessageSquare,
  Calendar,
  PlusCircle,
  HelpCircle,
  Star,
  Tag,
  Paperclip,
  MapPin,
  Pencil,
  Trash2,
  X,
  Eye,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { BOARD_STAT_CARDS, BOARD_POSTS } from '../data/adminBoardData';
import { BOARD_TABS } from '../data/adminBoardConstants';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import AdminSearchInput from '../components/common/AdminSearchInput';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseBtn,
} from '../components/common/AdminModal.styles'; // 모달 공통 스타일

const TOTAL = 124;
const TOTAL_PAGES = 3;

const STATUS_LABEL = { published: '게시 중', ended: '종료', active: '활성', expired: '만료', exhausted: '소진' };
const STATUS_COLORS = {
  published: { bg: '#dcfce7', color: '#16a34a' },
  ended:     { bg: '#f1f5f9', color: '#64748b' },
  active:    { bg: '#dcfce7', color: '#16a34a' },
  expired:   { bg: '#f1f5f9', color: '#64748b' },
  exhausted: { bg: '#fff7ed', color: '#ea580c' },
};

const COUPON_FILTERS = ['전체', '활성', '만료', '소진'];
const COUPON_STATUS_MAP = { 활성: 'active', 만료: 'expired', 소진: 'exhausted' };


export default function AdminBoardPage() {
  const [activeTab, setActiveTab] = useState('공지사항');
  const [pinnedIds, setPinnedIds] = useState(() => {
    const ids = [];
    Object.values(BOARD_POSTS).forEach((posts) =>
      posts.forEach((p) => {
        if (p.isFixed) ids.push(p.id);
      })
    );
    return ids;
  });

  // 게시글 목록 (삭제 지원을 위해 state로 관리)
  const [boardPosts, setBoardPosts] = useState(BOARD_POSTS);

  const { currentPage, goToPage, reset: resetPage } = usePagination();

  // 검색
  const [searchQuery, setSearchQuery] = useState('');

  // 쿠폰 필터
  const [couponFilter, setCouponFilter] = useState('전체');

  const rawPosts = boardPosts[activeTab] || [];
  const posts = rawPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab !== '쿠폰' || couponFilter === '전체') return matchSearch;
    return matchSearch && p.status === COUPON_STATUS_MAP[couponFilter];
  });

  // 신규 등록 / 수정 모달
  const [registerModal, setRegisterModal] = useState(null); // null | type string
  const [editingPost, setEditingPost] = useState(null); // 수정 중인 post
  const [formData, setFormData] = useState({});

  const openRegisterModal = (type) => {
    setRegisterModal(type);
    setEditingPost(null);
    setFormData({});
  };

  const openEditModal = (post) => {
    setDetailPost(null);
    setRegisterModal(activeTab);
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content || '' });
  };

  const closeRegisterModal = () => {
    setRegisterModal(null);
    setEditingPost(null);
    setFormData({});
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterSubmit = () => {
    if (editingPost) {
      setBoardPosts((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((p) =>
          p.id === editingPost.id
            ? { ...p, title: formData.title || p.title }
            : p
        ),
      }));
    }
    closeRegisterModal();
  };

  // 상세보기 모달
  const [detailPost, setDetailPost] = useState(null);

  // 삭제 확인 모달
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setBoardPosts((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((p) => p.id !== deleteTarget.id),
    }));
    setPinnedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    setDeleteTarget(null);
    setDetailPost(null);
  };

  const handlePin = (id) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setCouponFilter('전체');
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
        </StatCard>

        {/* 카드 2: 이번 달 리뷰 수 */}
        <StatCard>
          <StatCardTopRow>
            <StatIconWrap $color="#f97316" $bg="rgba(249,115,22,0.1)">
              <CalendarIcon />
            </StatIconWrap>
          </StatCardTopRow>
          <StatLabel>이번 달 리뷰 수</StatLabel>
          <StatValue>342</StatValue>
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
        {/* 탭 + 검색 */}
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
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="제목 검색..."
            width="220px"
          />
        </TabRow>

        {activeTab === '쿠폰' && (
          <CouponFilterRow>
            {COUPON_FILTERS.map((f) => (
              <CouponFilterBtn
                key={f}
                $active={couponFilter === f}
                onClick={() => setCouponFilter(f)}
              >
                {f}
              </CouponFilterBtn>
            ))}
          </CouponFilterRow>
        )}

        <Table>
          <THead>
            <TR>
              <TH $width="280px">제목</TH>
              {activeTab === '쿠폰' ? (
                <>
                  <TH $width="120px">남은 수량</TH>
                  <TH $width="120px">유효기간</TH>
                </>
              ) : activeTab === '리뷰' ? (
                <>
                  <TH $width="160px">작성자</TH>
                  <TH $width="150px">등록일</TH>
                  <TH $width="80px">상단 고정</TH>
                </>
              ) : (
                <>
                  <TH $width="150px">등록일</TH>
                  <TH $width="80px">상단 고정</TH>
                </>
              )}
            </TR>
          </THead>
          <TBody>
            {posts.length === 0 ? (
              <TR>
                <TD colSpan={4}>
                  <EmptyState>검색 결과가 없습니다.</EmptyState>
                </TD>
              </TR>
            ) : (
              posts.map((post) => {
                const pinned = pinnedIds.includes(post.id);

                return (
                  <TR
                    key={post.id}
                    $hoverable
                    $clickable
                    onClick={() => setDetailPost(post)}
                  >
                    <TD>
                      <TitleCell>
                        {post.isFixed && <FixedBadge>필독</FixedBadge>}
                        <TitleText>{post.title}</TitleText>
                        {post.hasAttachment && <AttachIcon />}
                      </TitleCell>
                    </TD>
                    {activeTab === '쿠폰' ? (
                      <>
                        <TD>
                          <QtyText>{post.remainingQty ?? '-'} 매</QtyText>
                        </TD>
                        <TD>
                          <ValidDaysText>
                            {post.validDays != null ? `${post.validDays}일` : '-'}
                          </ValidDaysText>
                        </TD>
                      </>
                    ) : activeTab === '리뷰' ? (
                      <>
                        <TD><AuthorText>{post.author}</AuthorText></TD>
                        <TD><DateText>{post.date}</DateText></TD>
                        <TD>
                          <RowActions onClick={(e) => e.stopPropagation()}>
                            <PinBtn $pinned={pinned} onClick={() => handlePin(post.id)} title={pinned ? '고정 해제' : '고정'}>
                              <PinSvg $pinned={pinned} />
                            </PinBtn>
                          </RowActions>
                        </TD>
                      </>
                    ) : (
                      <>
                        <TD><DateText>{post.date}</DateText></TD>
                        <TD>
                          <RowActions onClick={(e) => e.stopPropagation()}>
                            <PinBtn $pinned={pinned} onClick={() => handlePin(post.id)} title={pinned ? '고정 해제' : '고정'}>
                              <PinSvg $pinned={pinned} />
                            </PinBtn>
                          </RowActions>
                        </TD>
                      </>
                    )}
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>

        {/* footer: 페이지네이션 */}
        <TableFooter>
          <FooterInfo>‖ {TOTAL}개 &nbsp;‖&nbsp; 1-10 &nbsp;‖</FooterInfo>
          <AdminPagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={goToPage}
          />
          <div style={{ width: '120px' }} />
        </TableFooter>
      </TableSection>

      {/* ── 상세보기 모달 ── */}
      {detailPost && (
        <ModalOverlay onClick={() => setDetailPost(null)}>
          <ModalContent $width="520px" onClick={(e) => e.stopPropagation()}>
            {/* $align="flex-start": 제목이 배지+텍스트 두 줄 구조라 상단 정렬 */}
            <ModalHeader $align="flex-start" $gap="12px">
              <ModalTitleGroup>
                <ModalTabBadge>{activeTab}</ModalTabBadge>
                <ModalTitle>{detailPost.title}</ModalTitle>
              </ModalTitleGroup>
              <ModalCloseBtn onClick={() => setDetailPost(null)}>
                <X size={18} />
              </ModalCloseBtn>
            </ModalHeader>

            <ModalBody>
              <DetailMetaRow>
                <DetailMeta>
                  <DetailMetaLabel>작성자</DetailMetaLabel>
                  <DetailMetaValue>{detailPost.author}</DetailMetaValue>
                </DetailMeta>
                <DetailMeta>
                  <DetailMetaLabel>등록일</DetailMetaLabel>
                  <DetailMetaValue>{detailPost.date}</DetailMetaValue>
                </DetailMeta>
                <DetailMeta>
                  <DetailMetaLabel>조회수</DetailMetaLabel>
                  <DetailMetaValue>
                    {detailPost.views?.toLocaleString() ?? 0}
                  </DetailMetaValue>
                </DetailMeta>
                <DetailMeta>
                  <DetailMetaLabel>상태</DetailMetaLabel>
                  <StatusChip
                    $bg={STATUS_COLORS[detailPost.status]?.bg ?? '#f1f5f9'}
                    $color={
                      STATUS_COLORS[detailPost.status]?.color ?? '#64748b'
                    }
                  >
                    {STATUS_LABEL[detailPost.status] ?? detailPost.status}
                  </StatusChip>
                </DetailMeta>
              </DetailMetaRow>

              <DetailDivider />

              <DetailContentPlaceholder>
                <Eye size={20} color="#cbd5e1" />
                <DetailContentNote>
                  실제 내용은 서버 연동 후 표시됩니다.
                </DetailContentNote>
              </DetailContentPlaceholder>
            </ModalBody>

            <ModalFooter>
              <DeleteBtn onClick={() => setDeleteTarget(detailPost)}>
                <Trash2 size={14} />
                삭제
              </DeleteBtn>
              <RightBtns>
                <CancelBtn onClick={() => setDetailPost(null)}>닫기</CancelBtn>
                <SubmitBtn onClick={() => openEditModal(detailPost)}>
                  <Pencil size={13} />
                  수정
                </SubmitBtn>
              </RightBtns>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── 신규 등록 / 수정 모달 ── */}
      {registerModal && (
        <ModalOverlay onClick={closeRegisterModal}>
          <ModalContent $width="520px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingPost
                  ? `${registerModal} 수정`
                  : `${registerModal} 등록`}
              </ModalTitle>
              <ModalCloseBtn onClick={closeRegisterModal}>
                <X size={18} />
              </ModalCloseBtn>
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
                        onChange={(e) =>
                          handleFormChange('discountRate', e.target.value)
                        }
                      />
                    </FieldGroup>
                    <FieldGroup>
                      <FieldLabel>수량</FieldLabel>
                      <FieldInput
                        type="number"
                        min={1}
                        placeholder="예: 100"
                        value={formData.quantity || ''}
                        onChange={(e) =>
                          handleFormChange('quantity', e.target.value)
                        }
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
                        onChange={(e) =>
                          handleFormChange('validDays', e.target.value)
                        }
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
                      onChange={(e) =>
                        handleFormChange('title', e.target.value)
                      }
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <FieldLabel>내용</FieldLabel>
                    <FieldTextarea
                      placeholder="내용을 입력하세요"
                      value={formData.content || ''}
                      onChange={(e) =>
                        handleFormChange('content', e.target.value)
                      }
                    />
                  </FieldGroup>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <div />
              <RightBtns>
                <CancelBtn onClick={closeRegisterModal}>취소</CancelBtn>
                <SubmitBtn onClick={handleRegisterSubmit}>
                  {editingPost ? '수정 완료' : '등록'}
                </SubmitBtn>
              </RightBtns>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── 삭제 확인 모달 ── */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="게시글을 삭제하시겠습니까?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" 게시글이 영구적으로 삭제됩니다.`
            : ''
        }
        isDanger
        confirmText="삭제"
        icon={<Trash2 size={24} color="#ef4444" />}
      />
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function ReviewIcon() {
  return <MessageSquare size={20} />;
}
function CalendarIcon() {
  return <Calendar size={20} />;
}
function PlusCircleIcon() {
  return <PlusCircle size={14} strokeWidth={2.5} />;
}
function HelpSquareIcon() {
  return <HelpCircle size={14} />;
}
function EventIcon() {
  return <Star size={14} />;
}
function CouponIcon() {
  return <Tag size={14} />;
}
function AttachIcon() {
  return <Paperclip size={12} color="#94a3b8" style={{ flexShrink: 0 }} />;
}
function PinSvg({ $pinned }) {
  return (
    <MapPin
      size={14}
      fill={$pinned ? '#244c54' : 'none'}
      color={$pinned ? '#244c54' : '#94a3b8'}
    />
  );
}

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
const MonthBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #ea580c;
  background: #fff7ed;
  padding: 3px 8px;
  border-radius: 999px;
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

/* 쿠폰 필터 */
const CouponFilterRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const CouponFilterBtn = styled.button`
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active, theme }) => $active ? theme.colors.adminPrimary : theme.colors.white};
  color: ${({ $active, theme }) => $active ? theme.colors.white : theme.colors.textMuted};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.adminPrimary : theme.colors.border};
  &:hover {
    background: ${({ $active, theme }) => $active ? theme.colors.adminPrimary : theme.colors.bgSection};
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
  padding: 0 16px 0 24px;
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
  color: ${({ $active, theme }) =>
    $active ? theme.colors.adminPrimary : theme.colors.textMuted};
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.adminPrimary : 'transparent'};
  transition: all 0.15s;
  font-family: inherit;
  &:hover {
    color: ${({ theme }) => theme.colors.adminPrimary};
  }
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
  border-top: ${({ $hoverable, theme }) =>
    $hoverable ? `1px solid ${theme.colors.borderLight}` : 'none'};
  transition: background 0.1s;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
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

const EmptyState = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
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
const QtyText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;
const ValidDaysText = styled.span`
  font-size: 13px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.number};
  color: ${({ theme }) => theme.colors.adminTextDark};
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
  background: ${({ $pinned }) =>
    $pinned ? 'rgba(36,76,84,0.08)' : 'transparent'};
  &:hover {
    background: ${({ $pinned, theme }) =>
      $pinned ? 'rgba(36,76,84,0.14)' : theme.colors.borderLight};
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

/* ── 모달: ModalOverlay / ModalContent / ModalHeader / ModalCloseBtn 은
   components/common/AdminModal.styles.js 에서 공통 import ── */

const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const ModalTabBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #244c54;
  background: rgba(36, 76, 84, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
`;

const ModalTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: #0d1c2e;
  line-height: 1.4;
  word-break: break-word;
`;


const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* 상세보기 전용 */
const DetailMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const DetailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailMetaLabel = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const DetailMetaValue = styled.span`
  font-size: 13px;
  color: #334155;
  font-weight: 500;
`;

const StatusChip = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const DetailDivider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;

const DetailContentPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 80px;
  color: #cbd5e1;
`;

const DetailContentNote = styled.p`
  font-size: 12px;
  color: #cbd5e1;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const RightBtns = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid #fecaca;
  background: #fff5f5;
  color: #ef4444;
  transition: background 0.15s;
  &:hover {
    background: #fee2e2;
  }
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
  &:hover {
    background: #f1f5f9;
  }
`;

const SubmitBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  background: #244c54;
  color: white;
  border: 1px solid #244c54;
  transition: background 0.15s;
  &:hover {
    background: #1d3d44;
  }
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
  & > input {
    width: 100%;
    padding-right: 36px;
  }
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
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  &::placeholder {
    color: #94a3b8;
  }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36, 76, 84, 0.08);
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
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  &::placeholder {
    color: #94a3b8;
  }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36, 76, 84, 0.08);
  }
`;
