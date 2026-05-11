// src/features/admin/pages/AdminSellersPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  SELLERS_STAT_CARDS,
  SELLER_STATUS_MAP,
  SELLERS_LIST,
} from '../data/adminSellersData';

const TOTAL = 1284;
const TOTAL_PAGES = 3;

const FILTER_TABS = ['전체', '활동 중', '정지됨'];

export default function AdminSellersPage() {
  const [filter, setFilter] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = SELLERS_LIST.filter((s) => {
    if (filter === '활동 중') return s.status === 'active';
    if (filter === '정지됨') return s.status === 'stopped';
    return true;
  });

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  return (
    <PageWrapper onClick={() => setOpenMenuId(null)}>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>판매자 관리</PageTitle>
          <PageSub>서비스 내 모든 판매 채널의 활동 현황 및 가입 정보를 관리합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 통계 카드 4개 ── */}
      <StatsSection>
        {/* 전체 판매자 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(30,41,59,0.08)">
              <SellersIcon />
            </StatIconWrap>
            <StatBadge $green>+2.4%</StatBadge>
          </StatCardTop>
          <StatLabel>전체 판매자</StatLabel>
          <StatValue>1,284</StatValue>
          <StatProgress $color="#1e293b" $width={100} />
        </StatCard>

        {/* 활동 중 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(16,185,129,0.1)">
              <ActiveIcon />
            </StatIconWrap>
            <StatBadge $green>+4.2%</StatBadge>
          </StatCardTop>
          <StatLabel>활동 중</StatLabel>
          <StatValue>1,270</StatValue>
          <StatProgress $color="#10b981" $width={99} />
        </StatCard>

        {/* 정지됨 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(239,68,68,0.08)">
              <StoppedIcon />
            </StatIconWrap>
            <StatBadge $red>-2.1%</StatBadge>
          </StatCardTop>
          <StatLabel>정지됨</StatLabel>
          <StatValue>14</StatValue>
          <StatProgress $color="#ef4444" $width={8} />
        </StatCard>

        {/* 이달 신규 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(245,158,11,0.1)">
              <NewSellerIcon />
            </StatIconWrap>
          </StatCardTop>
          <StatLabel>이달 신규</StatLabel>
          <StatValue>156</StatValue>
          <StatProgress $color="#f59e0b" $width={30} />
        </StatCard>
      </StatsSection>

      {/* ── 전체 판매자 목록 ── */}
      <TableSection>
        <TableHeader>
          <TableTitle>전체 판매자 목록</TableTitle>
          <FilterTabs>
            {FILTER_TABS.map((tab) => (
              <FilterTab
                key={tab}
                $active={filter === tab}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </FilterTab>
            ))}
          </FilterTabs>
        </TableHeader>

        <Table>
          <THead>
            <TR>
              <TH>판매자 ID / 상호명</TH>
              <TH $width="120px">업종</TH>
              <TH $width="140px">연락처</TH>
              <TH $width="110px">가입일</TH>
              <TH $width="90px">거래 건수</TH>
              <TH $width="80px">상태</TH>
              <TH $width="48px">관리</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((seller) => (
              <TR key={seller.id} $hoverable>
                {/* 판매자 ID / 상호명 */}
                <TD>
                  <SellerCell>
                    <SellerIconWrap>
                      <CategoryIcon category={seller.category} />
                    </SellerIconWrap>
                    <SellerInfo>
                      <SellerName>{seller.name}</SellerName>
                      <SellerId>
                        <IdDots />
                        {seller.id}
                      </SellerId>
                    </SellerInfo>
                  </SellerCell>
                </TD>
                <TD><CategoryText>{seller.category}</CategoryText></TD>
                <TD><PhoneText>{seller.phone}</PhoneText></TD>
                <TD><DateText>{seller.joinedAt}</DateText></TD>
                <TD>
                  <TransactionText>
                    {seller.transactions.toLocaleString()}
                  </TransactionText>
                </TD>
                <TD>
                  <StatusBadge
                    $bg={SELLER_STATUS_MAP[seller.status].bg}
                    $color={SELLER_STATUS_MAP[seller.status].color}
                  >
                    {SELLER_STATUS_MAP[seller.status].label}
                  </StatusBadge>
                </TD>
                <TD onClick={(e) => e.stopPropagation()}>
                  <MenuWrap>
                    <MenuBtn onClick={() => handleMenuToggle(seller.id)}>
                      <ThreeDotIcon />
                    </MenuBtn>
                    {openMenuId === seller.id && (
                      <DropMenu>
                        <DropMenuItem>상세 보기</DropMenuItem>
                        <DropMenuItem>정보 수정</DropMenuItem>
                        <DropMenuDivider />
                        <DropMenuItem $danger>
                          {seller.status === 'active' ? '활동 정지' : '활동 재개'}
                        </DropMenuItem>
                      </DropMenu>
                    )}
                  </MenuWrap>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>

        {/* 페이지네이션 */}
        <TableFooter>
          <FooterInfo>
            SHOWING 1-{filtered.length} OF {TOTAL.toLocaleString()} ENTRIES
          </FooterInfo>
          <Pagination>
            <PageBtn
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </PageBtn>
            {[1, 2, 3].map((p) => (
              <PageBtn
                key={p}
                $active={currentPage === p}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </PageBtn>
            ))}
            <PageBtn
              onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
              disabled={currentPage === TOTAL_PAGES}
            >
              <ChevronRight />
            </PageBtn>
          </Pagination>
        </TableFooter>
      </TableSection>

      {/* ── 하단 Footer ── */}
      <PageFooter>
        <FooterLeft>© 2024 ADMIN PORTAL — PROFESSIONAL MANAGEMENT SYSTEM</FooterLeft>
        <FooterRight>
          System version: v2.4.0 &nbsp;•&nbsp; Last Activity: 2024.05.31 15:45
        </FooterRight>
      </PageFooter>
    </PageWrapper>
  );
}

/* ── Category Icon ── */
function CategoryIcon({ category }) {
  if (category === '숙박/호텔') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (category === '공유오피스') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }
  if (category === '카페/식음료') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    );
  }
  // 캠핑/글램핑
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5-10 4 7 3-4 4 7H3z" />
    </svg>
  );
}

function SellersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ActiveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function StoppedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}
function NewSellerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      <line x1="12" y1="12" x2="12" y2="18" /><line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}
function ThreeDotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="1" fill="#64748b" /><circle cx="12" cy="12" r="1" fill="#64748b" /><circle cx="12" cy="19" r="1" fill="#64748b" />
    </svg>
  );
}
function ChevronLeft() {
  return <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 1 1 5 5 9" /></svg>;
}
function ChevronRight() {
  return <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 1 5 5 1 9" /></svg>;
}
function IdDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 1.5, marginRight: 5, verticalAlign: 'middle' }}>
      {[0,1,2,3].map((i) => (
        <span key={i} style={{ width: 3, height: 9, borderRadius: 1, background: i < 3 ? '#94a3b8' : '#e2e8f0', display: 'inline-block' }} />
      ))}
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

const PageHeader = styled.div``;
const PageTitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const PageTitle = styled.h1`
  font-size: 24px; font-weight: 500; color: #0d1c2e; letter-spacing: -0.24px;
`;
const PageSub = styled.p`font-size: 14px; color: #64748b;`;

/* 통계 카드 */
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px 22px 18px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
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

const FilterTabs = styled.div`
  display: flex;
  gap: 6px;
`;

const FilterTab = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  border: 1px solid ${({ $active }) => ($active ? '#244c54' : '#e2e8f0')};
  background: ${({ $active }) => ($active ? '#244c54' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#64748b')};
  transition: all 0.15s;
  &:hover {
    background: ${({ $active }) => ($active ? '#3d646c' : '#f8fafc')};
  }
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
const TD = styled.td`padding: 16px 24px; vertical-align: middle;`;

/* 판매자 셀 */
const SellerCell = styled.div`display: flex; align-items: center; gap: 12px;`;

const SellerIconWrap = styled.div`
  width: 38px; height: 38px;
  border-radius: 8px;
  background: #f1f5f9;
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

const CategoryText = styled.span`font-size: 13px; color: #475569;`;
const PhoneText = styled.span`font-size: 13px; color: #475569; font-family: 'Plus Jakarta Sans', sans-serif;`;
const DateText = styled.span`font-size: 12px; color: #94a3b8; font-family: 'Plus Jakarta Sans', sans-serif;`;
const TransactionText = styled.span`font-size: 14px; font-weight: 700; color: #0d1c2e; font-family: 'Plus Jakarta Sans', sans-serif;`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px; border-radius: 999px;
  font-size: 11px; font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

/* 드롭다운 메뉴 */
const MenuWrap = styled.div`position: relative;`;

const MenuBtn = styled.button`
  width: 32px; height: 32px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
  &:hover { background: #f1f5f9; }
`;

const DropMenu = styled.div`
  position: absolute;
  right: 0; top: calc(100% + 4px);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 4px 0;
  min-width: 130px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05);
  z-index: 50;
`;

const DropMenuItem = styled.button`
  width: 100%;
  padding: 9px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  color: ${({ $danger }) => ($danger ? '#ef4444' : '#334155')};
  transition: background 0.1s;
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fff1f1' : '#f8fafc')};
  }
`;

const DropMenuDivider = styled.div`
  height: 1px; background: #f1f5f9; margin: 4px 0;
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
const PageFooter = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 8px;
`;

const FooterLeft = styled.p`
  font-size: 10px; letter-spacing: 0.8px;
  color: #94a3b8; text-transform: uppercase;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const FooterRight = styled.p`
  font-size: 10px; color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex; align-items: center; gap: 4px;
`;
