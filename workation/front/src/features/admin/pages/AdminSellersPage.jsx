// src/features/admin/pages/AdminSellersPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  SELLER_STATUS_MAP,
  SELLERS_LIST,
} from '../data/adminSellersData';

const TOTAL_PAGES = 3;
const FILTER_TABS = ['전체', '활동 중', '정지됨', '신규'];

/* ── 고객 계정 목데이터 ── */
const CUSTOMER_LIST = [
  { id: 'USR-001', name: '강다은', email: 'daeun.kang@example.com', phone: '010-1111-2222', joinDate: '2023-02-10', resvCount: 14, status: 'active', isNew: false },
  { id: 'USR-002', name: '윤지오', email: 'jio.yoon@example.com', phone: '010-2222-3333', joinDate: '2023-04-25', resvCount: 6, status: 'active', isNew: false },
  { id: 'USR-003', name: '서하준', email: 'hajun.seo@example.com', phone: '010-3333-4444', joinDate: '2023-06-14', resvCount: 2, status: 'stopped', isNew: false },
  { id: 'USR-004', name: '김도연', email: 'doyeon.kim@example.com', phone: '010-4444-5555', joinDate: '2023-08-30', resvCount: 9, status: 'active', isNew: false },
  { id: 'USR-005', name: '이나영', email: 'nayoung.lee@example.com', phone: '010-5555-6666', joinDate: '2023-11-05', resvCount: 3, status: 'active', isNew: false },
  { id: 'USR-006', name: '박성민', email: 'sungmin.park@example.com', phone: '010-6666-7777', joinDate: '2024-01-20', resvCount: 1, status: 'active', isNew: true },
  { id: 'USR-007', name: '조현우', email: 'hyunwoo.jo@example.com', phone: '010-7777-8888', joinDate: '2024-03-07', resvCount: 0, status: 'stopped', isNew: true },
  { id: 'USR-008', name: '신예진', email: 'yejin.shin@example.com', phone: '010-8888-9999', joinDate: '2024-04-12', resvCount: 5, status: 'active', isNew: true },
];
const AVATAR_COLORS = ['#dbeafe','#dcfce7','#fef9c3','#fce7f3','#ede9fe','#ffedd5','#cffafe','#f1f5f9'];

export default function AdminSellersPage() {
  const [view, setView] = useState('customer'); // 'customer' | 'seller'
  const [filter, setFilter] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);

  /* 판매자 토글 */
  const [sellerSuspended, setSellerSuspended] = useState(() => {
    const init = {};
    SELLERS_LIST.forEach((s) => { if (s.status === 'stopped') init[s.id] = true; });
    return init;
  });
  /* 고객 토글 */
  const [customerSuspended, setCustomerSuspended] = useState(() => {
    const init = {};
    CUSTOMER_LIST.forEach((c) => { if (c.status === 'stopped') init[c.id] = true; });
    return init;
  });
  /* 확인 모달 */
  const [confirmTarget, setConfirmTarget] = useState(null);

  const isSellerSuspended = (s) => sellerSuspended[s.id] ?? s.status === 'stopped';
  const isCustomerSuspended = (c) => customerSuspended[c.id] ?? c.status === 'stopped';

  const handleToggleClick = (item, isCurrent) => {
    setConfirmTarget({ id: item.id, name: item.name, willSuspend: !isCurrent, view });
  };

  const handleConfirm = () => {
    if (!confirmTarget) return;
    if (confirmTarget.view === 'seller') {
      setSellerSuspended((prev) => ({ ...prev, [confirmTarget.id]: confirmTarget.willSuspend }));
    } else {
      setCustomerSuspended((prev) => ({ ...prev, [confirmTarget.id]: confirmTarget.willSuspend }));
    }
    setConfirmTarget(null);
  };

  const handleViewChange = (v) => {
    setView(v);
    setFilter('전체');
    setCurrentPage(1);
  };

  /* 필터링 */
  const filteredSellers = SELLERS_LIST.filter((s) => {
    if (filter === '활동 중') return !isSellerSuspended(s);
    if (filter === '정지됨') return isSellerSuspended(s);
    if (filter === '신규') return s.isNew;
    return true;
  });
  const filteredCustomers = CUSTOMER_LIST.filter((c) => {
    if (filter === '활동 중') return !isCustomerSuspended(c);
    if (filter === '정지됨') return isCustomerSuspended(c);
    if (filter === '신규') return c.isNew;
    return true;
  });

  const TOTAL = view === 'seller' ? 1284 : 8420;

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>{view === 'seller' ? '판매자 관리' : '계정 관리'}</PageTitle>
          <PageSub>
            {view === 'seller'
              ? '서비스 내 모든 판매 채널의 활동 현황 및 가입 정보를 관리합니다.'
              : '서비스에 가입된 고객 계정 현황 및 활동 상태를 관리합니다.'}
          </PageSub>
        </PageTitleGroup>
        <ViewSwitch>
          <SwitchBtn $active={view === 'customer'} onClick={() => handleViewChange('customer')}>
            <CustomerSvg active={view === 'customer'} />
            계정 관리
          </SwitchBtn>
          <SwitchBtn $active={view === 'seller'} onClick={() => handleViewChange('seller')}>
            <SellerSvg active={view === 'seller'} />
            판매자 관리
          </SwitchBtn>
        </ViewSwitch>
      </PageHeader>

      {/* ── 통계 카드 ── */}
      {view === 'seller' ? (
        <StatsSection>
          <StatCard $active={filter === '전체'} onClick={() => setFilter('전체')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(30,41,59,0.08)"><SellersIcon /></StatIconWrap>
              <StatBadge $green>+2.4%</StatBadge>
            </StatCardTop>
            <StatLabel>전체 판매자</StatLabel>
            <StatValue>1,284</StatValue>
            <StatProgress $color="#1e293b" $width={100} />
          </StatCard>
          <StatCard $active={filter === '활동 중'} onClick={() => setFilter('활동 중')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(16,185,129,0.1)"><ActiveIcon /></StatIconWrap>
              <StatBadge $green>+4.2%</StatBadge>
            </StatCardTop>
            <StatLabel>활동 중</StatLabel>
            <StatValue>1,270</StatValue>
            <StatProgress $color="#10b981" $width={99} />
          </StatCard>
          <StatCard $active={filter === '정지됨'} onClick={() => setFilter('정지됨')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(239,68,68,0.08)"><StoppedIcon /></StatIconWrap>
              <StatBadge $red>-2.1%</StatBadge>
            </StatCardTop>
            <StatLabel>정지됨</StatLabel>
            <StatValue>14</StatValue>
            <StatProgress $color="#ef4444" $width={8} />
          </StatCard>
          <StatCard $active={filter === '신규'} onClick={() => setFilter('신규')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(245,158,11,0.1)"><NewSellerIcon /></StatIconWrap>
            </StatCardTop>
            <StatLabel>이달 신규</StatLabel>
            <StatValue>156</StatValue>
            <StatProgress $color="#f59e0b" $width={30} />
          </StatCard>
        </StatsSection>
      ) : (
        <StatsSection>
          <StatCard $active={filter === '전체'} onClick={() => setFilter('전체')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(59,130,246,0.1)"><SellersIcon /></StatIconWrap>
            </StatCardTop>
            <StatLabel>전체 고객</StatLabel>
            <StatValue>8,420</StatValue>
            <StatProgress $color="#3b82f6" $width={100} />
          </StatCard>
          <StatCard $active={filter === '활동 중'} onClick={() => setFilter('활동 중')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(16,185,129,0.1)"><ActiveIcon /></StatIconWrap>
              <StatBadge $green>+3.1%</StatBadge>
            </StatCardTop>
            <StatLabel>활성 고객</StatLabel>
            <StatValue>8,180</StatValue>
            <StatProgress $color="#10b981" $width={97} />
          </StatCard>
          <StatCard $active={filter === '정지됨'} onClick={() => setFilter('정지됨')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(239,68,68,0.08)"><StoppedIcon /></StatIconWrap>
              <StatBadge $red>-0.8%</StatBadge>
            </StatCardTop>
            <StatLabel>활동정지</StatLabel>
            <StatValue>240</StatValue>
            <StatProgress $color="#ef4444" $width={3} />
          </StatCard>
          <StatCard $active={filter === '신규'} onClick={() => setFilter('신규')}>
            <StatCardTop>
              <StatIconWrap $bg="rgba(245,158,11,0.1)"><NewSellerIcon /></StatIconWrap>
            </StatCardTop>
            <StatLabel>이달 신규</StatLabel>
            <StatValue>342</StatValue>
            <StatProgress $color="#f59e0b" $width={25} />
          </StatCard>
        </StatsSection>
      )}

      {/* ── 목록 테이블 ── */}
      <TableSection>
        <TableHeader>
          <TableTitle>{view === 'seller' ? '전체 판매자 목록' : '전체 고객 목록'}</TableTitle>
          <FilterTabs>
            {FILTER_TABS.map((tab) => (
              <FilterTab key={tab} $active={filter === tab} onClick={() => setFilter(tab)}>
                {tab}
              </FilterTab>
            ))}
          </FilterTabs>
        </TableHeader>

        {view === 'seller' ? (
          <Table>
            <THead>
              <TR>
                <TH>상호명</TH>
                <TH $width="80px">판매자명</TH>
                <TH $width="140px">사업자번호</TH>
                <TH $width="150px">연락처</TH>
                <TH $width="110px">가입일</TH>
                <TH $width="90px">거래 건수</TH>
                <TH $width="60px">신규</TH>
                <TH $width="80px">상태</TH>
                <TH $width="90px">활동정지</TH>
              </TR>
            </THead>
            <TBody>
              {filteredSellers.map((seller) => {
                const sus = isSellerSuspended(seller);
                return (
                  <TR key={seller.id} $hoverable>
                    <TD>
                      <SellerCell>
                        <SellerIconWrap><StoreIcon /></SellerIconWrap>
                        <SellerInfo>
                          <SellerName>{seller.name}</SellerName>
                          <SellerId><IdDots />{seller.id}</SellerId>
                        </SellerInfo>
                      </SellerCell>
                    </TD>
                    <TD><SellerPersonName>{seller.sellerName}</SellerPersonName></TD>
                    <TD><BusinessNoText>{seller.businessNo}</BusinessNoText></TD>
                    <TD><PhoneText>{seller.phone}</PhoneText></TD>
                    <TD><DateText>{seller.joinedAt}</DateText></TD>
                    <TD><TransactionText>{seller.transactions.toLocaleString()}</TransactionText></TD>
                    <TD>{seller.isNew && <NewBadge>NEW</NewBadge>}</TD>
                    <TD>
                      <StatusBadge $bg={sus ? '#fee2e2' : '#dcfce7'} $color={sus ? '#b91c1c' : '#15803d'}>
                        {sus ? '정지됨' : '활동 중'}
                      </StatusBadge>
                    </TD>
                    <TD>
                      <ToggleRow onClick={() => handleToggleClick(seller, sus)}>
                        <ToggleTrack $on={sus}><ToggleThumb $on={sus} /></ToggleTrack>
                        <ToggleLabel $on={sus}>{sus ? '정지' : '활성'}</ToggleLabel>
                      </ToggleRow>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>고객 ID</TH>
                <TH>이름</TH>
                <TH>이메일</TH>
                <TH $width="140px">전화번호</TH>
                <TH $width="120px">가입일</TH>
                <TH $width="90px">총 예약</TH>
                <TH $width="60px">신규</TH>
                <TH $width="80px">상태</TH>
                <TH $width="90px">활동정지</TH>
              </TR>
            </THead>
            <TBody>
              {filteredCustomers.map((customer, i) => {
                const sus = isCustomerSuspended(customer);
                return (
                  <TR key={customer.id} $hoverable>
                    <TD><AccountId>{customer.id}</AccountId></TD>
                    <TD>
                      <NameCell>
                        <Avatar $bg={AVATAR_COLORS[i % AVATAR_COLORS.length]}>{customer.name[0]}</Avatar>
                        {customer.name}
                      </NameCell>
                    </TD>
                    <TD><EmailText>{customer.email}</EmailText></TD>
                    <TD><PhoneText>{customer.phone}</PhoneText></TD>
                    <TD><DateText>{customer.joinDate}</DateText></TD>
                    <TD><TransactionText>{customer.resvCount}건</TransactionText></TD>
                    <TD>{customer.isNew && <NewBadge>NEW</NewBadge>}</TD>
                    <TD>
                      <StatusBadge $bg={sus ? '#fee2e2' : '#dcfce7'} $color={sus ? '#b91c1c' : '#15803d'}>
                        {sus ? '정지됨' : '활성'}
                      </StatusBadge>
                    </TD>
                    <TD>
                      <ToggleRow onClick={() => handleToggleClick(customer, sus)}>
                        <ToggleTrack $on={sus}><ToggleThumb $on={sus} /></ToggleTrack>
                        <ToggleLabel $on={sus}>{sus ? '정지' : '활성'}</ToggleLabel>
                      </ToggleRow>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}

        <TableFooter>
          <FooterInfo>
            SHOWING 1-{view === 'seller' ? filteredSellers.length : filteredCustomers.length} OF {TOTAL.toLocaleString()} ENTRIES
          </FooterInfo>
          <Pagination>
            <PageBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft />
            </PageBtn>
            {[1, 2, 3].map((p) => (
              <PageBtn key={p} $active={currentPage === p} onClick={() => setCurrentPage(p)}>{p}</PageBtn>
            ))}
            <PageBtn onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))} disabled={currentPage === TOTAL_PAGES}>
              <ChevronRight />
            </PageBtn>
          </Pagination>
        </TableFooter>
      </TableSection>

      <PageFooter>
        <FooterLeft>© 2024 ADMIN PORTAL — PROFESSIONAL MANAGEMENT SYSTEM</FooterLeft>
        <FooterRight>System version: v2.4.0 &nbsp;•&nbsp; Last Activity: 2024.05.31 15:45</FooterRight>
      </PageFooter>

      {/* ── 활동정지 확인 모달 ── */}
      {confirmTarget && (
        <ModalOverlay onClick={() => setConfirmTarget(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalIcon $suspend={confirmTarget.willSuspend}>
              {confirmTarget.willSuspend ? <SuspendModalIcon /> : <ResumeModalIcon />}
            </ModalIcon>
            <ModalTitle>
              {confirmTarget.willSuspend ? '활동정지 처리' : '활동 재개'}
            </ModalTitle>
            <ModalDesc>
              <strong>{confirmTarget.name}</strong> 계정을{' '}
              {confirmTarget.willSuspend
                ? '활동정지 처리하시겠습니까? 해당 계정은 서비스 이용이 제한됩니다.'
                : '활동 재개하시겠습니까? 해당 계정의 서비스 이용이 복구됩니다.'}
            </ModalDesc>
            <ModalActions>
              <ModalCancelBtn onClick={() => setConfirmTarget(null)}>취소</ModalCancelBtn>
              <ModalConfirmBtn $danger={confirmTarget.willSuspend} onClick={handleConfirm}>
                {confirmTarget.willSuspend ? '정지하기' : '재개하기'}
              </ModalConfirmBtn>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}

/* ── Icons ── */
function CategoryIcon({ category }) {
  if (category === '숙박/호텔') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
  if (category === '공유오피스') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
  if (category === '카페/식음료') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5-10 4 7 3-4 4 7H3z" />
    </svg>
  );
}
function StoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function SellersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function ActiveIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function StoppedIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>;
}
function NewSellerIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><line x1="12" y1="12" x2="12" y2="18" /><line x1="9" y1="15" x2="15" y2="15" /></svg>;
}
function SuspendModalIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>;
}
function ResumeModalIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function SellerSvg({ active }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#244c54' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
function CustomerSvg({ active }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#244c54' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function ChevronLeft() { return <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 1 1 5 5 9" /></svg>; }
function ChevronRight() { return <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 5 5 1 9" /></svg>; }
function IdDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 1.5, marginRight: 5, verticalAlign: 'middle' }}>
      {[0,1,2,3].map((i) => <span key={i} style={{ width: 3, height: 9, borderRadius: 1, background: i < 3 ? '#94a3b8' : '#e2e8f0', display: 'inline-block' }} />)}
    </span>
  );
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

const PageTitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const PageTitle = styled.h1`font-size: 24px; font-weight: 500; color: #0d1c2e; letter-spacing: -0.24px;`;
const PageSub = styled.p`font-size: 14px; color: #64748b;`;

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
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none')};
  white-space: nowrap;
`;

/* 통계 카드 */
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid ${({ $active }) => ($active ? '#244c54' : '#e2e8f0')};
  border-radius: 10px;
  padding: 20px 22px 18px;
  box-shadow: ${({ $active }) => ($active ? '0 0 0 3px rgba(36,76,84,0.1)' : '0 1px 2px rgba(0,0,0,0.05)')};
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const StatCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const StatIconWrap = styled.div`
  width: 40px; height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex; align-items: center; justify-content: center;
`;

const StatBadge = styled.span`
  font-size: 11px; font-weight: 700;
  padding: 3px 8px; border-radius: 999px;
  background: ${({ $green, $red }) => $green ? '#f0fdf4' : $red ? '#fff1f1' : '#f8fafc'};
  color: ${({ $green, $red }) => $green ? '#16a34a' : $red ? '#dc2626' : '#64748b'};
`;

const StatLabel = styled.p`font-size: 12px; color: #64748b;`;
const StatValue = styled.p`
  font-size: 30px; font-weight: 700; color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px; line-height: 1.2;
`;

const StatProgress = styled.div`
  margin-top: 8px;
  height: 4px; border-radius: 999px;
  background: #f1f5f9;
  position: relative; overflow: hidden;
  &::after {
    content: '';
    position: absolute; left: 0; top: 0;
    height: 100%;
    width: ${({ $width }) => $width}%;
    background: ${({ $color }) => $color};
    border-radius: 999px;
  }
`;

/* 테이블 */
const TableSection = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
`;

const TableTitle = styled.h2`font-size: 16px; font-weight: 600; color: #0d1c2e;`;

const FilterTabs = styled.div`display: flex; gap: 6px;`;

const FilterTab = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px; font-weight: 600;
  font-family: inherit;
  border: 1px solid ${({ $active }) => ($active ? '#244c54' : '#e2e8f0')};
  background: ${({ $active }) => ($active ? '#244c54' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#64748b')};
  transition: all 0.15s;
  &:hover { background: ${({ $active }) => ($active ? '#3d646c' : '#f8fafc')}; }
`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;
const THead = styled.thead`background: #f8fafc; border-bottom: 1px solid #f1f5f9;`;
const TBody = styled.tbody``;
const TR = styled.tr`
  border-top: ${({ $hoverable }) => ($hoverable ? '1px solid #f1f5f9' : 'none')};
  transition: background 0.1s;
  &:hover { background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')}; }
`;
const TH = styled.th`
  padding: 11px 24px; text-align: left;
  font-size: 11px; font-weight: 600; color: #64748b;
  letter-spacing: 0.4px; white-space: nowrap;
  width: ${({ $width }) => $width || 'auto'};
`;
const TD = styled.td`padding: 14px 24px; vertical-align: middle;`;

const SellerCell = styled.div`display: flex; align-items: center; gap: 12px;`;
const SellerIconWrap = styled.div`
  width: 38px; height: 38px;
  border-radius: 8px; background: #f1f5f9;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
`;
const SellerInfo = styled.div`display: flex; flex-direction: column; gap: 3px;`;
const SellerName = styled.span`font-size: 13px; font-weight: 600; color: #0d1c2e;`;
const SellerId = styled.span`
  font-size: 11px; color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex; align-items: center;
`;

const SellerPersonName = styled.span`font-size: 13px; font-weight: 500; color: #334155; white-space: nowrap;`;
const BusinessNoText = styled.span`font-size: 12px; color: #475569; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; letter-spacing: 0.3px;`;
const PhoneText = styled.span`
  font-size: 13px; color: #475569;
  font-family: 'Plus Jakarta Sans', sans-serif;
  white-space: nowrap;
`;
const DateText = styled.span`font-size: 12px; color: #94a3b8; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap;`;
const TransactionText = styled.span`font-size: 14px; font-weight: 700; color: #0d1c2e; font-family: 'Plus Jakarta Sans', sans-serif;`;

const AccountId = styled.span`font-size: 12px; font-weight: 600; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif;`;
const NameCell = styled.div`display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: #0d1c2e;`;
const Avatar = styled.div`
  width: 30px; height: 30px; border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #244c54; flex-shrink: 0;
`;
const EmailText = styled.span`font-size: 12px; color: #64748b;`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px; border-radius: 999px;
  font-size: 11px; font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

const NewBadge = styled.span`
  display: inline-block;
  padding: 2px 7px; border-radius: 999px;
  font-size: 10px; font-weight: 700;
  background: #fef3c7;
  color: #b45309;
  letter-spacing: 0.4px;
  white-space: nowrap;
`;

/* 활동정지 토글 */
const ToggleRow = styled.div`
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none;
`;
const ToggleTrack = styled.div`
  width: 40px; height: 22px; border-radius: 999px;
  background: ${({ $on }) => ($on ? '#ef4444' : '#22c55e')};
  position: relative; transition: background 0.2s; flex-shrink: 0;
`;
const ToggleThumb = styled.div`
  position: absolute; top: 3px;
  left: ${({ $on }) => ($on ? '21px' : '3px')};
  width: 16px; height: 16px; border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: left 0.2s;
`;
const ToggleLabel = styled.span`
  font-size: 12px; font-weight: 500;
  color: ${({ $on }) => ($on ? '#dc2626' : '#16a34a')};
  min-width: 24px;
`;

/* 페이지네이션 */
const TableFooter = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px;
  background: #f8fafc; border-top: 1px solid #f1f5f9;
`;
const FooterInfo = styled.p`
  font-size: 11px; font-weight: 600;
  color: #94a3b8; letter-spacing: 0.5px;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;
const Pagination = styled.div`display: flex; gap: 4px;`;
const PageBtn = styled.button`
  min-width: 30px; height: 30px; padding: 0 8px;
  border-radius: 6px;
  border: ${({ $active }) => ($active ? 'none' : '1px solid #e2e8f0')};
  background: ${({ $active }) => ($active ? '#244c54' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#475569')};
  font-size: 12px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  opacity: ${({ disabled }) => (disabled ? 0.35 : 1)};
  font-family: 'Plus Jakarta Sans', sans-serif;
  &:hover:not(:disabled) { background: ${({ $active }) => ($active ? '#244c54' : '#f8fafc')}; }
`;

/* 하단 Footer */
const PageFooter = styled.div`display: flex; align-items: center; justify-content: space-between; padding-top: 8px;`;
const FooterLeft = styled.p`font-size: 10px; letter-spacing: 0.8px; color: #94a3b8; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif;`;
const FooterRight = styled.p`font-size: 10px; color: #94a3b8; font-family: 'Plus Jakarta Sans', sans-serif;`;

/* 확인 모달 */
const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
`;
const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px 28px 24px;
  width: 360px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex; flex-direction: column; align-items: center;
  gap: 12px;
  text-align: center;
`;
const ModalIcon = styled.div`
  width: 56px; height: 56px; border-radius: 50%;
  background: ${({ $suspend }) => ($suspend ? '#fff1f1' : '#f0fdf4')};
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
`;
const ModalTitle = styled.h3`font-size: 18px; font-weight: 700; color: #0d1c2e;`;
const ModalDesc = styled.p`font-size: 14px; color: #64748b; line-height: 1.6;`;
const ModalActions = styled.div`display: flex; gap: 10px; margin-top: 8px; width: 100%;`;
const ModalCancelBtn = styled.button`
  flex: 1; padding: 12px;
  border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 14px; font-weight: 600; color: #475569;
  font-family: inherit; transition: background 0.15s;
  &:hover { background: #f8fafc; }
`;
const ModalConfirmBtn = styled.button`
  flex: 1; padding: 12px;
  border-radius: 8px;
  font-size: 14px; font-weight: 600; color: white;
  font-family: inherit; transition: opacity 0.15s;
  background: ${({ $danger }) => ($danger ? '#ef4444' : '#16a34a')};
  &:hover { opacity: 0.85; }
`;
