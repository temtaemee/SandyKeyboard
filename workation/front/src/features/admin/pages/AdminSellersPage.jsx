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
import SellersStatCards from '../components/dashboard/SellersStatCards';
import SellersTable from '../components/dashboard/SellersTable';
import CustomersTable from '../components/dashboard/CustomersTable';

export default function AdminSellersPage() {
  const [view, setView] = useState('customer'); // 'customer' | 'seller'
  const [filter, setFilter] = useState('전체');
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
    resetPage();
  };

  /* 필터링 */
  const filteredSellers = SELLERS_LIST.filter((s) => {
    if (filter === '활동 중') return !isSellerSuspended(s);
    if (filter === '정지됨') return isSellerSuspended(s);
    if (filter === '신규') return isNewMember(s.joinedAt);
    return true;
  });
  const filteredCustomers = CUSTOMER_LIST.filter((c) => {
    if (filter === '활동 중') return !isCustomerSuspended(c);
    if (filter === '정지됨') return isCustomerSuspended(c);
    if (filter === '신규') return isNewMember(c.joinDate);
    return true;
  });

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

