// src/features/admin/pages/AdminSellersPage.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Home,
  Building2,
  Coffee,
  Tent,
  Store,
  Users,
  CheckCircle,
  XCircle,
  UserPlus,
  Briefcase,
  User,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  X,
  Tag,
  Trash2,
  Plus,
  TicketPercent,
} from 'lucide-react';
import useAdminSellers from '../hooks/useAdminSellers';
import useAdminSellersUI from '../hooks/useAdminSellersUI';
import {
  SELLER_STATUS_MAP,
  TOTAL_PAGES,
  AVATAR_COLORS,
  isNewMember,
} from '../data/adminSellersConstants';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import ConfirmModal from '../components/common/ConfirmModal';
import AdminSearchInput from '../components/common/AdminSearchInput';
import SellersStatCards from '../components/dashboard/SellersStatCards';
import SellersTable from '../components/dashboard/SellersTable';
import CustomersTable from '../components/dashboard/CustomersTable';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseBtn,
} from '../components/common/AdminModal.styles'; // 모달 공통 스타일

export default function AdminSellersPage() {
  const {
    sellers,
    customers,
    sellersTotalPage = 1,
    sellersTotalCount = 0,
    sellersUnfilteredTotal = 0,
    sellersActiveCount = 0,
    sellersBannedCount = 0,
    sellersNewCount = 0,
    customersTotalPage = 1,
    customersTotalCount = 0,
    customersUnfilteredTotal = 0,
    customersActiveCount = 0,
    customersBannedCount = 0,
    customersNewCount = 0,
    customerCoupons,
    sellerSuspended,
    customerSuspended,
    suspendSeller,
    suspendCustomer,
    addCoupon,
    deleteCoupon,
    fetchCustomers,
    fetchSellers,
    fetchSellersStats,
    fetchCustomersStats,
    fetchMemberCoupons,
    fetchIssuableCoupons,
    issuableCoupons,
  } = useAdminSellers();

  console.log('=== [AdminSellersPage] ===');
  console.log('customers:', customers);
  console.log('sellers:', sellers);
  console.log('sellersTotalCount:', sellersTotalCount, 'customersTotalCount:', customersTotalCount);
  console.log('==========================');

  const {
    currentPage,
    goToPage,
    goToPrev,
    goToNext,
    reset: resetPage,
  } = usePagination();

  // 통합 UI 훅 도입으로 복잡한 useState 제거 및 모달 제어 격리
  const {
    view,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    handleViewChange,
    confirmTarget,
    isSellerSuspended,
    isCustomerSuspended,
    handleToggleClick,
    handleConfirm,
    selectedCustomer,
    setSelectedCustomer,
    handleOpenCustomerDetail,
    showIssuePanel,
    setShowIssuePanel,
    selectedTemplate,
    setSelectedTemplate,
    handleCloseCustomerModal,
    handleDeleteCoupon,
    handleIssueCoupon,
  } = useAdminSellersUI({
    sellers,
    customers,
    sellerSuspended,
    customerSuspended,
    suspendSeller,
    suspendCustomer,
    addCoupon,
    deleteCoupon,
    resetPage,
    fetchMemberCoupons,
    fetchIssuableCoupons,
    issuableCoupons,
  });

  // 1. 한국어 필터명을 백엔드 상태(ACTIVE, BANNED 등)로 변환하는 함수
  const getBackendStatus = (korFilter) => {
    if (korFilter === '활동 중') return 'ACTIVE';
    if (korFilter === '정지됨') return 'BANNED';
    return null; // '전체' 및 '신규'는 null 전송으로 처리하여 전체조회
  };

  // 2. 검색, 필터, 페이징에 따른 동적 API 데이터 fetching
  useEffect(() => {
    const params = {
      page: currentPage,
      size: 10,
      keyword: searchQuery || null,
      status: getBackendStatus(filter),
    };

    if (view === 'customer') {
      fetchCustomers(params);
    } else {
      fetchSellers(params);
    }
  }, [view, currentPage, filter, searchQuery, fetchCustomers, fetchSellers]);

  // 3. 통계 카드용 카운트 fetch (view 전환 시마다 갱신)
  useEffect(() => {
    if (view === 'seller') {
      fetchSellersStats();
    } else {
      fetchCustomersStats();
    }
  }, [view, fetchSellersStats, fetchCustomersStats]);

  // unfilteredTotal: 필터/검색과 무관한 전체 수 (fetchStats에서 별도 보관)
  // totalCount는 필터된 fetch 결과로 덮어씌워지므로 "전체" 카드에 사용하지 않음
  const sellersStats = {
    total: sellersUnfilteredTotal,
    active: sellersActiveCount,
    stopped: sellersBannedCount,
    new: sellersNewCount,
  };
  const customersStats = {
    total: customersUnfilteredTotal,
    active: customersActiveCount,
    stopped: customersBannedCount,
    new: customersNewCount,
  };

  /* 필터링 - 백엔드에서 페이징과 필터링 처리가 이미 된 데이터이므로 그대로 주입합니다. */
  const filteredSellers = sellers;
  const filteredCustomers = customers;

  const TOTAL = view === 'seller' ? sellersTotalCount : customersTotalCount;
  const totalPages = view === 'seller' ? sellersTotalPage : customersTotalPage;

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>
            {view === 'seller' ? '판매자 관리' : '계정 관리'}
          </PageTitle>
          <PageSub>
            {view === 'seller'
              ? '서비스 내 모든 판매 채널의 활동 현황 및 가입 정보를 관리합니다.'
              : '서비스에 가입된 고객 계정 현황 및 활동 상태를 관리합니다.'}
          </PageSub>
        </PageTitleGroup>
        <ViewSwitch>
          <SwitchBtn
            $active={view === 'customer'}
            onClick={() => handleViewChange('customer')}
          >
            <CustomerSvg active={view === 'customer'} />
            계정 관리
          </SwitchBtn>
          <SwitchBtn
            $active={view === 'seller'}
            onClick={() => handleViewChange('seller')}
          >
            <SellerSvg active={view === 'seller'} />
            판매자 관리
          </SwitchBtn>
        </ViewSwitch>
      </PageHeader>

      {/* ── 통계 카드 ── */}
      <SellersStatCards
        view={view}
        filter={filter}
        onFilterChange={setFilter}
        stats={view === 'seller' ? sellersStats : customersStats}
      />

      {/* ── 목록 테이블 ── */}
      <TableSection>
        <TableHeader>
          <TableTitle>
            {view === 'seller' ? '전체 판매자 목록' : '전체 고객 목록'}
          </TableTitle>
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={view === 'seller' ? '판매자 이름 검색...' : '고객 이름 검색...'}
            width="220px"
          />
        </TableHeader>

        {view === 'seller' ? (
          <SellersTable
            sellers={filteredSellers}
            isSuspended={isSellerSuspended}
            onToggleClick={handleToggleClick}
          />
        ) : (
          <CustomersTable
            customers={filteredCustomers}
            isSuspended={isCustomerSuspended}
            onToggleClick={handleToggleClick}
            onRowClick={handleOpenCustomerDetail}
          />
        )}

        <TableFooter>
          <FooterInfo />
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
          <div style={{ width: '200px' }} />{' '}
          {/* 우측 밸런스를 위한 더미 공간 */}
        </TableFooter>
      </TableSection>

      <PageFooter>
        <FooterLeft>
          © 2024 ADMIN PORTAL — PROFESSIONAL MANAGEMENT SYSTEM
        </FooterLeft>
        <FooterRight>
          System version: v2.4.0 &nbsp;•&nbsp; Last Activity: 2024.05.31 15:45
        </FooterRight>
      </PageFooter>

      {/* ── 고객 상세 모달 ── */}
      {selectedCustomer && (
        <ModalOverlay onClick={handleCloseCustomerModal}>
          {/* max-height: 90vh — 쿠폰 목록이 길어질 수 있어서 스크롤 허용 */}
          <ModalContent $width="520px" $maxHeight="90vh" onClick={(e) => e.stopPropagation()}>
            {/* $align="flex-start": 제목이 ID 배지 + 이름 두 줄 구조라 상단 정렬 */}
            <ModalHeader $align="flex-start" $gap="12px">
              <ModalTitleGroup>
                <ModalIdBadge>{selectedCustomer.id}</ModalIdBadge>
                <ModalTitle>{selectedCustomer.name}</ModalTitle>
              </ModalTitleGroup>
              <ModalCloseBtn onClick={handleCloseCustomerModal}>
                <X size={18} />
              </ModalCloseBtn>
            </ModalHeader>

            <ModalBody>
              <CouponSectionHeader>
                <CouponSectionTitle>
                  <TicketPercent size={15} />
                  보유 쿠폰
                </CouponSectionTitle>
                <CouponCount>
                  {(customerCoupons[selectedCustomer.id] ?? []).length}장
                </CouponCount>
              </CouponSectionHeader>

              {(customerCoupons[selectedCustomer.id] ?? []).length === 0 ? (
                <CouponEmpty>보유 중인 쿠폰이 없습니다.</CouponEmpty>
              ) : (
                <CouponList>
                  {(customerCoupons[selectedCustomer.id] ?? []).map((coupon) => (
                    <CouponRow key={coupon.id}>
                      <CouponDiscountBadge>{coupon.discount}</CouponDiscountBadge>
                      <CouponInfo>
                        <CouponTitle>{coupon.title}</CouponTitle>
                        <CouponMeta>
                          발급일 {coupon.issuedAt} &nbsp;·&nbsp; 만료일 {coupon.expireAt}
                        </CouponMeta>
                      </CouponInfo>
                      <CouponDeleteBtn
                        title="쿠폰 삭제"
                        onClick={() => handleDeleteCoupon(selectedCustomer.id, coupon.couponId)}
                      >
                        <Trash2 size={14} />
                      </CouponDeleteBtn>
                    </CouponRow>
                  ))}
                </CouponList>
              )}

              {showIssuePanel && (
                <IssuePanel>
                  <IssuePanelTitle>쿠폰 발급</IssuePanelTitle>
                  <IssueRow>
                    <CouponSelect
                      value={selectedTemplate ?? ''}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                      {issuableCoupons.length === 0 ? (
                        <option value="">발급 가능한 쿠폰이 없습니다</option>
                      ) : (
                        issuableCoupons.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.couponName} ({c.discountRate != null ? `${c.discountRate}%` : '-'}, {c.validDays != null ? `${c.validDays}일` : '-'})
                          </option>
                        ))
                      )}
                    </CouponSelect>
                    <IssueConfirmBtn onClick={handleIssueCoupon}>발급</IssueConfirmBtn>
                    <IssueCancelBtn onClick={() => setShowIssuePanel(false)}>취소</IssueCancelBtn>
                  </IssueRow>
                </IssuePanel>
              )}
            </ModalBody>

            <ModalFooter>
              <div />
              <ModalActions>
                <ModalCancelBtn onClick={handleCloseCustomerModal}>닫기</ModalCancelBtn>
                {!showIssuePanel && (
                  <CouponBtn onClick={() => setShowIssuePanel(true)}>
                    <Plus size={13} />
                    쿠폰 발급
                  </CouponBtn>
                )}
              </ModalActions>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── 활동정지 확인 모달 ── */}
      <ConfirmModal
        isOpen={confirmTarget !== null}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleConfirm}
        title={confirmTarget?.willSuspend ? '활동정지 처리' : '활동 재개'}
        description={
          confirmTarget
            ? `${confirmTarget.name} 계정을 ${confirmTarget.willSuspend ? '활동정지 처리하시겠습니까? 해당 계정은 서비스 이용이 제한됩니다.' : '활동 재개하시겠습니까? 해당 계정의 서비스 이용이 복구됩니다.'}`
            : ''
        }
        isDanger={confirmTarget?.willSuspend}
        confirmText={confirmTarget?.willSuspend ? '정지하기' : '재개하기'}
        icon={
          confirmTarget?.willSuspend ? (
            <SuspendModalIcon />
          ) : (
            <ResumeModalIcon />
          )
        }
      />
    </PageWrapper>
  );
}

/* ── Icons ── */
function ResumeModalIcon() {
  return <CheckCircle size={28} color="#16a34a" />;
}
function SuspendModalIcon() {
  return <XCircle size={28} color="#ef4444" />;
}
function SellerSvg({ active }) {
  return <Briefcase size={14} color={active ? '#244c54' : '#94a3b8'} />;
}
function CustomerSvg({ active }) {
  return <User size={14} color={active ? '#244c54' : '#94a3b8'} />;
}

function ChevronLeft() {
  return <LucideChevronLeft size={14} color="#475569" strokeWidth={1.5} />;
}
function ChevronRight() {
  return <LucideChevronRight size={14} color="#475569" strokeWidth={1.5} />;
}

/* ── Styled Components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #0d1c2e;
  letter-spacing: -0.24px;
`;
const PageSub = styled.p`
  font-size: 14px;
  color: #64748b;
`;

const ViewSwitch = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
  gap: 2px;
`;

const SwitchBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.18s;
  background: ${({ $active }) => ($active ? 'white' : 'transparent')};
  color: ${({ $active }) => ($active ? '#244c54' : '#94a3b8')};
  box-shadow: ${({ $active }) =>
    $active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
  white-space: nowrap;
`;

/* 페이지네이션 푸터 */
const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
`;

const FooterInfo = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

/* 하단 Footer */
const PageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
`;
const FooterLeft = styled.p`
  font-size: 10px;
  letter-spacing: 0.8px;
  color: #94a3b8;
  text-transform: uppercase;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;
const FooterRight = styled.p`
  font-size: 10px;
  color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

/* ── Styled Components ── */

/* 테이블 전체를 감싸는 섹션 */
const TableSection = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
`;

const TableTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #0d1c2e;
`;

/* ── 고객 상세 모달: ModalOverlay / ModalContent / ModalHeader / ModalCloseBtn 은
   components/common/AdminModal.styles.js 에서 공통 import ── */

const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ModalIdBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #244c54;
  background: rgba(36,76,84,0.08);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #0d1c2e;
`;


const ModalBody = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
`;


const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ModalCancelBtn = styled.button`
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

const CouponBtn = styled.button`
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
  &:hover { background: #1d3d44; }
`;

/* ── 쿠폰 섹션 ── */
const CouponSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CouponSectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const CouponCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #244c54;
  background: rgba(36,76,84,0.08);
  padding: 2px 8px;
  border-radius: 999px;
`;

const CouponEmpty = styled.p`
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  padding: 28px 0;
  border: 1.5px dashed #e2e8f0;
  border-radius: 8px;
`;

const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CouponRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const CouponDiscountBadge = styled.span`
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: #244c54;
  background: rgba(36,76,84,0.1);
  padding: 4px 10px;
  border-radius: 6px;
  min-width: 56px;
  text-align: center;
`;

const CouponInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

const CouponTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CouponMeta = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const CouponDeleteBtn = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
  color: #94a3b8;
  transition: all 0.15s;
  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }
`;

/* ── 쿠폰 발급 패널 ── */
const IssuePanel = styled.div`
  margin-top: 16px;
  padding: 14px 16px;
  background: #f0fdf4;
  border: 1.5px solid #86efac;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const IssuePanelTitle = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const IssueRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CouponSelect = styled.select`
  flex: 1;
  padding: 7px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  color: #1e293b;
  background: white;
  outline: none;
  &:focus { border-color: #244c54; }
`;

const IssueConfirmBtn = styled.button`
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  background: #16a34a;
  color: white;
  transition: background 0.15s;
  &:hover { background: #15803d; }
`;

const IssueCancelBtn = styled.button`
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  transition: background 0.15s;
  &:hover { background: #f1f5f9; }
`;

