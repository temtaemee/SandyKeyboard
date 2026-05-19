// src/features/admin/pages/AdminSellersPage.jsx
import { useState } from 'react';
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
} from 'lucide-react';
import { SELLERS_LIST, CUSTOMER_LIST } from '../data/adminSellersData';
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

export default function AdminSellersPage() {
  const [view, setView] = useState('customer'); // 'customer' | 'seller'
  const [filter, setFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    currentPage,
    goToPage,
    goToPrev,
    goToNext,
    reset: resetPage,
  } = usePagination();

  /* 판매자 토글 */
  const [sellerSuspended, setSellerSuspended] = useState(() => {
    const init = {};
    SELLERS_LIST.forEach((s) => {
      if (s.status === 'stopped') init[s.id] = true;
    });
    return init;
  });
  /* 고객 토글 */
  const [customerSuspended, setCustomerSuspended] = useState(() => {
    const init = {};
    CUSTOMER_LIST.forEach((c) => {
      if (c.status === 'stopped') init[c.id] = true;
    });
    return init;
  });
  /* 확인 모달 */
  const [confirmTarget, setConfirmTarget] = useState(null);

  /* 고객 상세 모달 */
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const isSellerSuspended = (s) =>
    sellerSuspended[s.id] ?? s.status === 'stopped';
  const isCustomerSuspended = (c) =>
    customerSuspended[c.id] ?? c.status === 'stopped';

  const handleToggleClick = (item, isCurrent) => {
    setConfirmTarget({
      id: item.id,
      name: item.name,
      willSuspend: !isCurrent,
      view,
    });
  };

  const handleConfirm = () => {
    if (!confirmTarget) return;
    if (confirmTarget.view === 'seller') {
      setSellerSuspended((prev) => ({
        ...prev,
        [confirmTarget.id]: confirmTarget.willSuspend,
      }));
    } else {
      setCustomerSuspended((prev) => ({
        ...prev,
        [confirmTarget.id]: confirmTarget.willSuspend,
      }));
    }
    setConfirmTarget(null);
  };

  const handleViewChange = (v) => {
    setView(v);
    setFilter('전체');
    setSearchQuery('');
    resetPage();
  };

  /* 필터링 */
  const filteredSellers = SELLERS_LIST.filter((s) => {
    if (filter === '활동 중') return !isSellerSuspended(s);
    if (filter === '정지됨') return isSellerSuspended(s);
    if (filter === '신규') return isNewMember(s.joinedAt);
    return true;
  }).filter((s) =>
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCustomers = CUSTOMER_LIST.filter((c) => {
    if (filter === '활동 중') return !isCustomerSuspended(c);
    if (filter === '정지됨') return isCustomerSuspended(c);
    if (filter === '신규') return isNewMember(c.joinDate);
    return true;
  }).filter((c) =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const TOTAL = view === 'seller' ? 1284 : 8420;

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
            onRowClick={setSelectedCustomer}
          />
        )}

        <TableFooter>
          <FooterInfo>
            SHOWING 1-
            {view === 'seller'
              ? filteredSellers.length
              : filteredCustomers.length}{' '}
            OF {TOTAL.toLocaleString()} ENTRIES
          </FooterInfo>
          <AdminPagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
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
        <ModalOverlay onClick={() => setSelectedCustomer(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitleGroup>
                <ModalIdBadge>{selectedCustomer.id}</ModalIdBadge>
                <ModalTitle>{selectedCustomer.name}</ModalTitle>
              </ModalTitleGroup>
              <ModalCloseBtn onClick={() => setSelectedCustomer(null)}>
                <X size={18} />
              </ModalCloseBtn>
            </ModalHeader>

            <ModalBody>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>이메일</InfoLabel>
                  <InfoValue>{selectedCustomer.email}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>전화번호</InfoLabel>
                  <InfoValue>{selectedCustomer.phone}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>가입일</InfoLabel>
                  <InfoValue>{selectedCustomer.joinDate}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>총 예약</InfoLabel>
                  <InfoValue>{selectedCustomer.resvCount}건</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>계정 상태</InfoLabel>
                  <StatusChip $active={selectedCustomer.status === 'active'}>
                    {selectedCustomer.status === 'active' ? '활성' : '정지'}
                  </StatusChip>
                </InfoItem>
              </InfoGrid>
            </ModalBody>

            <ModalFooter>
              <div />
              <ModalActions>
                <ModalCancelBtn onClick={() => setSelectedCustomer(null)}>닫기</ModalCancelBtn>
                <CouponBtn>
                  <Tag size={13} />
                  쿠폰 추가
                </CouponBtn>
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

/* ── 고객 상세 모달 ── */
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
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
`;

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

const ModalCloseBtn = styled.button`
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.15s;
  &:hover { color: #475569; }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InfoLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
`;

const StatusChip = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
  background: ${({ $active }) => ($active ? '#dcfce7' : '#fee2e2')};
  color: ${({ $active }) => ($active ? '#16a34a' : '#dc2626')};
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

