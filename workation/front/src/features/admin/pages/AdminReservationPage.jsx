// src/features/admin/pages/AdminReservationPage.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Calendar,
  Building2,
  Users,
  X,
  Pencil,
  Check,
  Ban,
} from 'lucide-react';
import AdminSearchInput from '../components/common/AdminSearchInput';
import useAdminReservation from '../hooks/useAdminReservation';
import useAdminReservationUI from '../hooks/useAdminReservationUI';
import { RESERVATION_STATUS_MAP } from '../data/adminReservationConstants';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import StatusBadge from '../components/common/StatusBadge';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseBtn,
} from '../components/common/AdminModal.styles'; // 모달 공통 스타일

const STATUS_FILTER_TABS = [
  { key: 'all', label: '전체' },
  { key: 'RESERVED', label: '예약확정' },
  { key: 'PAYMENT_COMPLETED', label: '대기' },
  { key: 'COMPLETED', label: '이용완료' },
  { key: 'cancelled', label: '취소' },
];

// USER_CANCELLED, SELLER_CANCELLED, REFUND_COMPLETED 를 '취소' 탭으로 묶음
// USER_CANCELLED, SELLER_CANCELLED, REFUND_COMPLETED 를 '취소' 탭으로 묶음
const CANCELLED_STATUSES = [
  'USER_CANCELLED',
  'SELLER_CANCELLED',
  'REFUND_COMPLETED',
];

export default function AdminReservationPage() {
  const {
    partners,
    reservations,
    reservationsTotalPage,
    reservationsTotalCount,
    allReservations,
    refundedList,
    dashboardSummary,
    fetchPartners,
    fetchReservations,
    fetchAllReservations,
    fetchDashboardSummary,
    addPartner,
    updatePartner,
    togglePartnerStatus,
  } = useAdminReservation();

  const { currentPage, goToPage, goToPrev, goToNext } = usePagination();

  // 통합 UI 훅으로 모달 제어 및 인라인 에디팅 상태 분리
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    partnerModalOpen,
    setPartnerModalOpen,
    partnerSearch,
    setPartnerSearch,
    filteredPartners,
    companyName,
    setCompanyName,
    companyBizNum,
    setCompanyBizNum,
    handleRegisterCompany,
    editingId,
    editForm,
    setEditForm,
    startEdit,
    saveEdit,
    cancelEdit,
  } = useAdminReservationUI({
    partners,
    addPartner,
    updatePartner,
  });

  useEffect(() => {
    fetchPartners();
    fetchAllReservations(); // 통계/환불 모달용 전체 데이터 1회 로드
    fetchDashboardSummary(); // 대시보드 통계 정보 로드
  }, [fetchPartners, fetchAllReservations, fetchDashboardSummary]);

  // 필터나 검색어가 변경되면 페이지를 1페이지로 리셋
  useEffect(() => {
    goToPage(1);
  }, [statusFilter, search, goToPage]);

  // 검색어 변경 시 백엔드 전체 목록도 함께 로드하여 최신 상태 유지
  useEffect(() => {
    fetchAllReservations();
  }, [search, fetchAllReservations]);

  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === 'active').length;
  const activePercent =
    totalPartners > 0 ? Math.round((activePartners / totalPartners) * 100) : 0;

  // ─── [실시간 통계] 이번 달 예약 및 결제 취소(환불) 금액 로컬 실시간 계산 ───
  const getThisMonthCancelAmount = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return allReservations
      .filter((row) => {
        const isCancelled = CANCELLED_STATUSES.includes(row.status);
        if (!isCancelled) return false;

        if (!row.createdAt) return false;
        const createDate = new Date(row.createdAt);
        return (
          createDate.getFullYear() === currentYear &&
          createDate.getMonth() === currentMonth
        );
      })
      .reduce((sum, row) => sum + (row.rawTotalPrice ?? 0), 0);
  };

  const getThisMonthReservationCount = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return allReservations.filter((row) => {
      if (!row.createdAt) return false;
      const createDate = new Date(row.createdAt);
      return (
        createDate.getFullYear() === currentYear &&
        createDate.getMonth() === currentMonth
      );
    }).length;
  };

  const thisMonthCancelAmount = getThisMonthCancelAmount();
  const thisMonthReservationCount = getThisMonthReservationCount();

  // ─── [버그 해결] 카테고리 탭 클릭 시 전체 데이터(allReservations) 기준 필터링 및 로컬 페이징 처리 ───
  const getFilteredAllReservations = () => {
    return allReservations.filter((row) => {
      const matchSearch =
        !search ||
        row.customerName.toLowerCase().includes(search.toLowerCase()) ||
        row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.spaceName.toLowerCase().includes(search.toLowerCase()) ||
        row.stayName.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'cancelled'
          ? CANCELLED_STATUSES.includes(row.status)
          : row.status === statusFilter);

      return matchSearch && matchStatus;
    });
  };

  const filteredAll = getFilteredAllReservations();
  const PAGE_SIZE = 10;
  const totalCount = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // 현재 페이지에 해당하는 예약 리스트 슬라이스
  const displayedReservations = filteredAll.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>예약 및 기업 관리</PageTitle>
          <PageSub>기업 파트너 관리 및 개별 예약 현황을 추적합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 상단: 통계 카드 2개 + 활성 파트너사 + 신규 기업 빠른 등록 ── */}
      <TopSection>
        {/* 통계 카드 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(59,130,246,0.1)" $color="#2563eb">
              <CalendarIcon />
            </StatIconWrap>
          </StatCardTop>
          <StatLabel>이번 달 예약</StatLabel>
          <StatValueRow>
            <StatValue>
              {(
                thisMonthReservationCount ?? 0
              ).toLocaleString()}
              건
            </StatValue>
          </StatValueRow>
        </StatCard>

        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(239,68,68,0.1)" $color="#dc2626">
              <BanIcon />
            </StatIconWrap>
          </StatCardTop>
          <StatLabel>이번 달 결제 취소 금액 (환불)</StatLabel>
          <StatValueRow>
            <StatValue>
              ₩{(thisMonthCancelAmount ?? 0).toLocaleString()}
            </StatValue>
          </StatValueRow>
        </StatCard>

        {/* 활성 파트너사 카드 */}
        <ActivePartnerCard onClick={() => setPartnerModalOpen(true)}>
          <PartnerIconWrap>
            <PartnerGroupIcon />
          </PartnerIconWrap>
          <ActiveLabel>활성 파트너사</ActiveLabel>
          <ActiveCount>
            {activePartners} <ActiveUnit>기업</ActiveUnit>
          </ActiveCount>
          <ActiveDesc>
            전체 파트너사의 약 {activePercent}%가 현재 활성 상태입니다.
          </ActiveDesc>
        </ActivePartnerCard>

        {/* 신규 기업 빠른 등록 폼 */}
        <QuickRegisterCard>
          <QuickRegisterTitle>신규 기업 빠른 등록</QuickRegisterTitle>
          <FormInput
            placeholder="기업명"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <FormInput
            placeholder="사업자번호 '-' 제외하고 숫자만 입력"
            value={companyBizNum}
            onChange={(e) => setCompanyBizNum(e.target.value)}
          />
          <RegisterBtn onClick={handleRegisterCompany}>등록하기</RegisterBtn>
        </QuickRegisterCard>
      </TopSection>

      {/* ── 중단: 예약 테이블 ── */}
      <TableSection>
        <TableTitleRow>
          <TableTitleGroup>
            <TableTitle>예약</TableTitle>
            <FilterTabList>
              {STATUS_FILTER_TABS.map((tab) => (
                <FilterTab
                  key={tab.key}
                  $active={statusFilter === tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                </FilterTab>
              ))}
            </FilterTabList>
          </TableTitleGroup>
          <AdminSearchInput
            value={search}
            onChange={setSearch}
            placeholder="예약 검색..."
            width="260px"
          />
        </TableTitleRow>

        <Table>
          <THead>
            <TR>
              <TH>ID</TH>
              <TH>고객명</TH>
              <TH>공간명</TH>
              <TH>스테이명</TH>
              <TH>날짜</TH>
              <TH>결제 금액</TH>
              <TH>상태</TH>
            </TR>
          </THead>
          <TBody>
            {displayedReservations.length === 0 ? (
              <TR>
                <TD colSpan={7}>
                  <EmptyState>예약 내역이 없습니다.</EmptyState>
                </TD>
              </TR>
            ) : (
              displayedReservations.map((row) => (
                <TR key={row.id} $hoverable>
                  <TD>
                    <ResvId>{row.id}</ResvId>
                  </TD>
                  <TD>
                    <CustomerCell>
                      <CustomerAvatar $bg={row.avatarColor}>
                        {row.customerInitial}
                      </CustomerAvatar>
                      <CustomerInfo>
                        <CustomerName>{row.customerName}</CustomerName>
                        <CustomerEmail>{row.customerEmail}</CustomerEmail>
                      </CustomerInfo>
                    </CustomerCell>
                  </TD>
                  <TD>
                    <SpaceName>{row.spaceName}</SpaceName>
                  </TD>
                  <TD>
                    <StayNameText>{row.stayName}</StayNameText>
                  </TD>
                  <TD>
                    <DateText>{row.date}</DateText>
                  </TD>
                  <TD>
                    <AmountText>{row.amount}</AmountText>
                  </TD>
                  <TD>
                    <StatusBadge
                      $bg={
                        RESERVATION_STATUS_MAP[row.status]?.bg ?? '#f1f5f9'
                      }
                      $color={
                        RESERVATION_STATUS_MAP[row.status]?.color ?? '#64748b'
                      }
                    >
                      {/* statusLabel은 서버에서 한글로 제공 */}
                      {row.statusLabel ||
                        RESERVATION_STATUS_MAP[row.status]?.label ||
                        row.status}
                    </StatusBadge>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>

        <TableFooter>
          <FooterInfo>
            총 {totalCount.toLocaleString()}건
          </FooterInfo>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
          <div style={{ width: '120px' }} />
        </TableFooter>
      </TableSection>

      {/* ── 파트너사 관리 모달 ── */}
      {partnerModalOpen && (
        <ModalOverlay onClick={() => setPartnerModalOpen(false)}>
          <ModalContent $width="480px" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>파트너사 전체 목록</ModalTitle>
              <ModalCloseBtn onClick={() => setPartnerModalOpen(false)}>
                <X size={20} />
              </ModalCloseBtn>
            </ModalHeader>
            <ModalBody>
              <ModalSearchRow>
                <AdminSearchInput
                  value={partnerSearch}
                  onChange={setPartnerSearch}
                  placeholder="파트너 검색..."
                  width="100%"
                />
              </ModalSearchRow>
              <PartnerModalList>
                {filteredPartners.map((company) => {
                  const isEditing = editingId === company.id;
                  return (
                    <PartnerModalItem key={company.id}>
                      <PartnerModalItemTop>
                        <CompanyIconWrap
                          $bg={company.iconBg}
                          $color={company.iconColor}
                        >
                          <BuildingIcon />
                        </CompanyIconWrap>
                        <CompanyInfo>
                          {isEditing ? (
                            <EditNameInput
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  name: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            <CompanyName>{company.name}</CompanyName>
                          )}
                          <CompanyResvCount>
                            누적 예약 {company.reservationCount}건
                          </CompanyResvCount>
                        </CompanyInfo>
                        <ModalActionGroup>
                          {isEditing ? (
                            <>
                              <IconActionBtn
                                $color="#16a34a"
                                onClick={() => saveEdit(company.id)}
                                title="저장"
                              >
                                <Check size={15} />
                              </IconActionBtn>
                              <IconActionBtn
                                $color="#64748b"
                                onClick={cancelEdit}
                                title="취소"
                              >
                                <Ban size={15} />
                              </IconActionBtn>
                            </>
                          ) : (
                            <IconActionBtn
                              $color="#64748b"
                              onClick={() => startEdit(company)}
                              title="수정"
                            >
                              <Pencil size={14} />
                            </IconActionBtn>
                          )}
                          <StatusToggleBtn
                            $active={company.status === 'active'}
                            onClick={() => togglePartnerStatus(company.id)}
                          >
                            {company.status === 'active' ? '활성' : '비활성'}
                          </StatusToggleBtn>
                        </ModalActionGroup>
                      </PartnerModalItemTop>

                      <PartnerMetaGrid>
                        <MetaRow>
                          <MetaLabel>사업자번호</MetaLabel>
                          {isEditing ? (
                            <MetaInput
                              value={editForm.businessNumber}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  businessNumber: e.target.value,
                                }))
                              }
                              placeholder="000-00-00000"
                            />
                          ) : (
                            <MetaValue>
                              {company.businessNumber || '—'}
                            </MetaValue>
                          )}
                        </MetaRow>
                        <MetaRow>
                          <MetaLabel>함께한 날짜</MetaLabel>
                          <MetaValue>{company.partnerSince || '—'}</MetaValue>
                        </MetaRow>
                        <MetaRow>
                          <MetaLabel>수정일자</MetaLabel>
                          <MetaValue>{company.updatedAt || '—'}</MetaValue>
                        </MetaRow>
                      </PartnerMetaGrid>
                    </PartnerModalItem>
                  );
                })}
              </PartnerModalList>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function CalendarIcon() {
  return <Calendar size={20} />;
}
function BuildingStatIcon() {
  return <Building2 size={20} />;
}
function BuildingIcon() {
  return <Building2 size={16} />;
}
function PartnerGroupIcon() {
  return <Users size={28} color="#3b82f6" strokeWidth={1.8} />;
}
function BanIcon() {
  return <Ban size={20} />;
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

/* 상단 4열 */
const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  letter-spacing: -0.5px;
`;

/* 예약 테이블 */
const TableSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const TableTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const TableTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TableTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const FilterTabList = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ theme }) => theme.colors.bgSection};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
  padding: 3px;
`;

const FilterTab = styled.button`
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.adminPrimary : theme.colors.textMuted};
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  box-shadow: ${({ $active }) =>
    $active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;
  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.adminPrimary : theme.colors.adminTextDark};
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
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const TH = styled.th`
  padding: 11px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.4px;
  white-space: nowrap;
`;

const TD = styled.td`
  padding: 16px 24px;
  vertical-align: middle;
`;

const ResvId = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const CustomerCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CustomerAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminPrimary};
  flex-shrink: 0;
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CustomerName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const CustomerEmail = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const SpaceName = styled.span`
  font-size: 13px;
  color: #334155;
`;

const StayNameText = styled.span`
  font-size: 13px;
  color: #334155;
  font-weight: 500;
`;

const DateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.number};
  white-space: nowrap;
`;

const AmountText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
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

const EmptyState = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

/* 활성 파트너사 카드 */
const ActivePartnerCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 28px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition:
    box-shadow 0.18s,
    border-color 0.18s,
    background 0.18s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.adminPrimary};
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
    background: #f0f6ff;
  }
`;

const PartnerIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const ActiveLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActiveCount = styled.p`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const ActiveUnit = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
`;

const ActiveDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const PartnerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
  background: #fafbfc;
`;

const CompanyIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CompanyInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CompanyName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const CompanyResvCount = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ActiveBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#16a34a' : '#64748b')};
  background: ${({ $active }) => ($active ? '#dcfce7' : '#f1f5f9')};
  padding: 3px 8px;
  border-radius: 999px;
`;

/* 신규 기업 빠른 등록 */
const QuickRegisterCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const QuickRegisterTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 4px;
`;

const FormLabel = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.adminPrimary};
  }
`;

const RegisterBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.adminPrimary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  margin-top: 4px;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.adminPrimaryLight};
  }
`;

/* ── Modal: ModalOverlay / ModalContent / ModalHeader / ModalCloseBtn 은
   components/common/AdminModal.styles.js 에서 공통 import ── */

const ModalSearchRow = styled.div`
  margin-bottom: 16px;
`;

// 이 모달에서만 쓰는 타이틀 스타일
const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0d1c2e;
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  max-height: 400px;
  overflow-y: auto;
`;

const PartnerModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PartnerModalItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
  background: #fafbfc;
`;

const PartnerModalItemTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModalActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  flex-shrink: 0;
`;

const IconActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: ${({ $color }) => $color};
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;

const EditNameInput = styled.input`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  border: 1px solid ${({ theme }) => theme.colors.adminPrimary};
  border-radius: 5px;
  padding: 3px 7px;
  font-family: inherit;
  outline: none;
  width: 100%;
`;

const PartnerMetaGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 48px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetaLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  width: 72px;
  flex-shrink: 0;
`;

const MetaValue = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const MetaInput = styled.input`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  border: 1px solid ${({ theme }) => theme.colors.adminPrimary};
  border-radius: 5px;
  padding: 2px 7px;
  font-family: inherit;
  outline: none;
  flex: 1;
`;

const StatusToggleBtn = styled.button`
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  border: 1px solid ${({ $active }) => ($active ? '#16a34a' : '#cbd5e1')};
  color: ${({ $active }) => ($active ? '#16a34a' : '#64748b')};
  background: ${({ $active }) => ($active ? '#f0fdf4' : 'transparent')};

  &:hover {
    background: ${({ $active }) => ($active ? '#dcfce7' : '#f1f5f9')};
  }
`;
