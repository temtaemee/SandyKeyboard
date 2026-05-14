// src/features/admin/pages/AdminReservationPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { Calendar, Building2, Search, ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight, ExternalLink, Users } from 'lucide-react';
import {
  RESERVATION_STAT_CARDS,
  RESERVATION_LIST,
  PARTNER_COMPANIES,
} from '../data/adminReservationData';
import {
  RESERVATION_STATUS_MAP,
  TOTAL_RESERVATIONS,
  TOTAL_PAGES,
} from '../data/adminReservationConstants';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import StatusBadge from '../components/common/StatusBadge';


export default function AdminReservationPage() {
  const [search, setSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [companyName, setCompanyName] = useState('');
  const { currentPage, goToPage, goToPrev, goToNext } = usePagination();

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>예약 및 기업 관리</PageTitle>
          <PageSub>기업 파트너 관리 및 개별 예약 현황을 추적합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 상단: 통계 카드 2개 ── */}
      <TopSection>
        {RESERVATION_STAT_CARDS.map((card, idx) => (
          <StatCard key={card.id}>
            <StatCardTop>
              <StatIconWrap
                $bg={idx === 0 ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)'}
                $color={idx === 0 ? '#2563eb' : '#16a34a'}
              >
                {idx === 0 ? <CalendarIcon /> : <BuildingStatIcon />}
              </StatIconWrap>
              <StatBadge $color={card.badge.color}>{card.badge.text}</StatBadge>
            </StatCardTop>
            <StatLabel>{card.label}</StatLabel>
            <StatValueRow>
              <StatValue>{card.value}</StatValue>
            </StatValueRow>
          </StatCard>
        ))}
      </TopSection>

      {/* ── 예약 검색 ── */}
      <ResvSearchRow>
        <ResvSearchWrap>
          <SearchIconWrap>
            <SearchSvg />
          </SearchIconWrap>
          <SearchInput
            placeholder="예약 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </ResvSearchWrap>
      </ResvSearchRow>

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
            {TOTAL_RESERVATIONS.toLocaleString()}건 &nbsp;‖&nbsp; 1-10 &nbsp;‖
          </FooterInfo>
          <AdminPagination
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            onPageChange={goToPage}
          />
          <div style={{ width: '120px' }} />
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
          <RegisterBtn onClick={() => { if (companyName.trim()) setCompanyName(''); }}>
            등록하기
          </RegisterBtn>
        </QuickRegisterCard>
      </BottomSection>
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function CalendarIcon() { return <Calendar size={20} />; }
function BuildingStatIcon() { return <Building2 size={20} />; }
function SearchSvg() { return <Search size={14} color="#9ca3af" />; }
function ChevronLeft() { return <LucideChevronLeft size={14} color="#475569" strokeWidth={1.5} />; }
function ChevronRight() { return <LucideChevronRight size={14} color="#475569" strokeWidth={1.5} />; }
function ExternalLinkIcon() { return <ExternalLink size={14} color="#64748b" />; }
function BuildingIcon() { return <Building2 size={16} />; }
function PartnerGroupIcon() { return <Users size={28} color="#3b82f6" strokeWidth={1.8} />; }

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

/* 상단 통계 */
const TopSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

/* 예약 검색 */
const ResvSearchRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ResvSearchWrap = styled.div`
  width: 320px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: ${({ theme }) => theme.shadows.card};
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
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  background: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
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
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const TableTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
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

const DateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.number};
  white-space: pre-line;
  line-height: 1.5;
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

/* 파트너 검색 */
const PartnerSearchRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PartnerSearchWrap = styled.div`
  width: 320px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

/* 하단 3열 */
const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
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

/* 파트너사 목록 카드 */
const PartnerListCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
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
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const ExternalLinkBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
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
  color: #16a34a;
  background: #dcfce7;
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
  &::placeholder { color: ${({ theme }) => theme.colors.textLight}; }
  &:focus { border-color: ${({ theme }) => theme.colors.adminPrimary}; }
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
  &:hover { background: ${({ theme }) => theme.colors.adminPrimaryLight}; }
`;

