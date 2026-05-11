// src/features/admin/pages/AdminReservationPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  RESERVATION_STAT_CARDS,
  RESERVATION_LIST,
  RESERVATION_STATUS_MAP,
  PARTNER_COMPANIES,
} from '../data/adminReservationData';

const TOTAL = 1284;
const TOTAL_PAGES = 3;

export default function AdminReservationPage() {
  const [search, setSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>예약 및 기업 관리</PageTitle>
          <PageSub>기업 파트너 관리 및 개별 예약 현황을 추적합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 상단: 통계 카드 2개 + 검색창 ── */}
      <TopSection>
        {RESERVATION_STAT_CARDS.map((card) => (
          <StatCard key={card.id}>
            <StatLabel>{card.label}</StatLabel>
            <StatValueRow>
              <StatValue>{card.value}</StatValue>
              <StatBadge $color={card.badge.color}>{card.badge.text}</StatBadge>
            </StatValueRow>
          </StatCard>
        ))}

        <SearchCard>
          <SearchIconWrap>
            <SearchSvg />
          </SearchIconWrap>
          <SearchInput
            placeholder="예약 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchCard>
      </TopSection>

      {/* ── 중단: 예약 테이블 ── */}
      <TableSection>
        <TableTitleRow>
          <TableTitle>예약</TableTitle>
        </TableTitleRow>

        <Table>
          <THead>
            <TR>
              <TH>ID</TH>
              <TH>고객명</TH>
              <TH>숙소명</TH>
              <TH>날짜</TH>
              <TH>결제 금액</TH>
              <TH>상태</TH>
            </TR>
          </THead>
          <TBody>
            {RESERVATION_LIST.map((row) => (
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
                  <DateText>{row.date.replace('\\n', '\n')}</DateText>
                </TD>
                <TD>
                  <AmountText>{row.amount}</AmountText>
                </TD>
                <TD>
                  <StatusBadge
                    $bg={RESERVATION_STATUS_MAP[row.status].bg}
                    $color={RESERVATION_STATUS_MAP[row.status].color}
                  >
                    {RESERVATION_STATUS_MAP[row.status].label}
                  </StatusBadge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>

        <TableFooter>
          <FooterInfo>
            {TOTAL.toLocaleString()}건 &nbsp;‖&nbsp; 1-10 &nbsp;‖
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

      {/* ── 하단: 파트너 검색 + 3열 ── */}
      <PartnerSearchRow>
        <PartnerSearchWrap>
          <SearchIconWrap>
            <SearchSvg />
          </SearchIconWrap>
          <SearchInput
            placeholder="파트너 검색..."
            value={partnerSearch}
            onChange={(e) => setPartnerSearch(e.target.value)}
          />
        </PartnerSearchWrap>
      </PartnerSearchRow>

      <BottomSection>
        {/* 활성 파트너사 카드 */}
        <ActivePartnerCard>
          <PartnerIconWrap>
            <PartnerGroupIcon />
          </PartnerIconWrap>
          <ActiveLabel>활성 파트너사</ActiveLabel>
          <ActiveCount>
            42 <ActiveUnit>기업</ActiveUnit>
          </ActiveCount>
          <ActiveDesc>전체 파트너사의 약 85%가 현재 활성 상태입니다.</ActiveDesc>
        </ActivePartnerCard>

        {/* 파트너사 목록 카드 */}
        <PartnerListCard>
          <PartnerListHeader>
            <PartnerListTitle>파트너사</PartnerListTitle>
            <ExternalLinkBtn aria-label="전체보기">
              <ExternalLinkIcon />
            </ExternalLinkBtn>
          </PartnerListHeader>
          <PartnerList>
            {PARTNER_COMPANIES.map((company) => (
              <PartnerItem key={company.id}>
                <CompanyIconWrap $bg={company.iconBg} $color={company.iconColor}>
                  <BuildingIcon />
                </CompanyIconWrap>
                <CompanyInfo>
                  <CompanyName>{company.name}</CompanyName>
                  <CompanyResvCount>
                    누적 예약 {company.reservationCount}건
                  </CompanyResvCount>
                </CompanyInfo>
                <ActiveBadge>활성</ActiveBadge>
              </PartnerItem>
            ))}
          </PartnerList>
        </PartnerListCard>

        {/* 신규 기업 빠른 등록 폼 */}
        <QuickRegisterCard>
          <QuickRegisterTitle>신규 기업 빠른 등록</QuickRegisterTitle>
          <FormLabel>기업명</FormLabel>
          <FormInput
            placeholder="기업명 입력"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <RegisterBtn>
            ▌▌▌▌▌ (Register)
          </RegisterBtn>
        </QuickRegisterCard>
      </BottomSection>
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function SearchSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="5 1 1 5 5 9" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="5" height="9" viewBox="0 0 6 10" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 1 5 5 1 9" />
    </svg>
  );
}
function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function BuildingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 22V12h6v10" />
      <path d="M9 7h1" /><path d="M14 7h1" />
      <path d="M9 11h1" /><path d="M14 11h1" />
    </svg>
  );
}
function PartnerGroupIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
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
  color: #0d1c2e;
  letter-spacing: -0.24px;
  line-height: 1.33;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: #64748b;
`;

/* 상단 통계 + 검색 */
const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
`;

const StatValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px;
`;

const StatBadge = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $color }) => $color === 'green' ? '#16a34a' : '#dc2626'};
`;

const SearchCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SearchIconWrap = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #0d1c2e;
  font-family: inherit;
  background: none;

  &::placeholder {
    color: #9ca3af;
  }
`;

/* 예약 테이블 */
const TableSection = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TableTitleRow = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const TableTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #0d1c2e;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
`;

const TBody = styled.tbody``;

const TR = styled.tr`
  border-top: ${({ $hoverable }) => ($hoverable ? '1px solid #f1f5f9' : 'none')};
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
  color: #64748b;
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
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', sans-serif;
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
  color: #244c54;
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
  color: #0d1c2e;
`;

const CustomerEmail = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const SpaceName = styled.span`
  font-size: 13px;
  color: #334155;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #64748b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  white-space: pre-line;
  line-height: 1.5;
`;

const AmountText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
`;

const FooterInfo = styled.p`
  font-size: 12px;
  color: #64748b;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Pagination = styled.div`
  display: flex;
  gap: 4px;
`;

const PageBtn = styled.button`
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 4px;
  border: ${({ $active }) => ($active ? 'none' : '1px solid #e2e8f0')};
  background: ${({ $active }) => ($active ? '#244c54' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#475569')};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  font-family: 'Plus Jakarta Sans', sans-serif;
  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#244c54' : '#f8fafc')};
  }
`;

/* 파트너 검색 */
const PartnerSearchRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PartnerSearchWrap = styled.div`
  width: 320px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

/* 하단 3열 */
const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
`;

/* 활성 파트너사 카드 */
const ActivePartnerCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 28px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  color: #64748b;
`;

const ActiveCount = styled.p`
  font-size: 40px;
  font-weight: 700;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const ActiveUnit = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #475569;
`;

const ActiveDesc = styled.p`
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.6;
`;

/* 파트너사 목록 카드 */
const PartnerListCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const PartnerListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PartnerListTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #0d1c2e;
`;

const ExternalLinkBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  transition: background 0.15s;
  &:hover { background: #f1f5f9; }
`;

const PartnerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PartnerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #f1f5f9;
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
  color: #0d1c2e;
`;

const CompanyResvCount = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const ActiveBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #16a34a;
  background: #dcfce7;
  padding: 3px 8px;
  border-radius: 999px;
`;

/* 신규 기업 빠른 등록 */
const QuickRegisterCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const QuickRegisterTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #0d1c2e;
  margin-bottom: 4px;
`;

const FormLabel = styled.label`
  font-size: 12px;
  color: #64748b;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #0d1c2e;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;

  &::placeholder { color: #cbd5e1; }
  &:focus { border-color: #244c54; }
`;

const RegisterBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: #1a3540;
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  margin-top: 4px;
  transition: background 0.15s;
  &:hover { background: #244c54; }
`;
