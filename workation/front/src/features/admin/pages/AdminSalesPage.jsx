// src/features/admin/pages/AdminSalesPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  Wallet,
  Receipt,
  Percent,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';
import AdminSearchInput from '../components/common/AdminSearchInput';
import AdminChartPanel from '../components/dashboard/AdminChartPanel';
import {
  SALES_STAT_CARDS,
  TOP5_SETTLEMENTS,
  PENDING_LIST,
} from '../data/adminSalesData';
import {
  SETTLEMENT_STATUS_MAP,
  APPROVAL_STATUS_MAP,
} from '../data/adminSalesConstants';
import StatusBadge from '../components/common/StatusBadge';

export default function AdminSalesPage() {
  const [pendingSearch, setPendingSearch] = useState('');

  const filteredPending = PENDING_LIST.filter(
    (row) =>
      !pendingSearch ||
      row.seller.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      row.id.toLowerCase().includes(pendingSearch.toLowerCase())
  );

  return (
    <PageWrapper>
      {/* ── 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>매출/정산 관리</PageTitle>
          <PageSub>전체 거래처의 매출 및 정산 현황을 통합 관리합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ══════════════════════════════════════
          매출 현황
      ══════════════════════════════════════ */}
      <SectionBlock>
        <SectionLabel>
          <TrendingUp size={15} />
          매출 현황
        </SectionLabel>

        {/* 총 매출액 카드 + 월간 트렌드 + 지역별 순위 */}
        <AdminChartPanel />
      </SectionBlock>

      {/* ══════════════════════════════════════
          정산 현황
      ══════════════════════════════════════ */}
      <SectionBlock>
        <SectionLabel>
          <ClipboardList size={15} />
          정산 현황
        </SectionLabel>

        {/* 정산 요약 카드 3개 */}
        <SettlementCards>
          <StatCard>
            <StatCardTop>
              <StatIconWrap $bg="rgba(34,197,94,0.1)" $color="#16a34a">
                <WalletIcon />
              </StatIconWrap>
            </StatCardTop>
            <StatLabel>{SALES_STAT_CARDS[0].label}</StatLabel>
            <StatValue>{SALES_STAT_CARDS[0].value}</StatValue>
          </StatCard>

          <StatCard>
            <StatCardTop>
              <StatIconWrap $bg="rgba(59,130,246,0.1)" $color="#2563eb">
                <ReceiptIcon />
              </StatIconWrap>
            </StatCardTop>
            <StatLabel>{SALES_STAT_CARDS[1].label}</StatLabel>
            <StatValue>{SALES_STAT_CARDS[1].value}</StatValue>
          </StatCard>

          <StatCard>
            <StatCardTop>
              <StatIconWrap $bg="rgba(249,115,22,0.1)" $color="#ea580c">
                <PercentIcon />
              </StatIconWrap>
            </StatCardTop>
            <StatLabel>{SALES_STAT_CARDS[2].label}</StatLabel>
            <StatValue>{SALES_STAT_CARDS[2].value}</StatValue>
            <StatSubText>{SALES_STAT_CARDS[2].sub}</StatSubText>
          </StatCard>
        </SettlementCards>

        {/* Top5 + 정산 대기 목록 나란히 */}
        <SettlementBottom>
          {/* Top5 거래처 */}
          <Top5Card>
            <Top5Title>정산 금액 Top 5 거래처</Top5Title>
            <Top5List>
              {TOP5_SETTLEMENTS.map((item) => (
                <Top5Item key={item.rank}>
                  <Top5Rank $rank={item.rank}>{item.rank}</Top5Rank>
                  <Top5Info>
                    <Top5Name>{item.name}</Top5Name>
                    <Top5Date>
                      <DateDot />
                      {item.date}
                    </Top5Date>
                  </Top5Info>
                  <Top5Amount>{item.amount}</Top5Amount>
                </Top5Item>
              ))}
            </Top5List>
          </Top5Card>

          {/* 정산 대기 목록 */}
          <PendingSection>
            <PendingHeader>
              <PendingTitle>정산 대기 목록</PendingTitle>
              <AdminSearchInput
                value={pendingSearch}
                onChange={setPendingSearch}
                placeholder="거래처명 / ID 검색..."
                width="200px"
              />
            </PendingHeader>

            <PendingTable>
              <PTHead>
                <PTR>
                  <PTH>ID</PTH>
                  <PTH>거래처명</PTH>
                  <PTH>정산 요청일</PTH>
                  <PTH>정산 대상액</PTH>
                  <PTH>상태</PTH>
                  <PTH></PTH>
                </PTR>
              </PTHead>
              <PTBody>
                {filteredPending.length === 0 ? (
                  <PTR>
                    <PTD colSpan={6}>
                      <EmptyPending>검색 결과가 없습니다.</EmptyPending>
                    </PTD>
                  </PTR>
                ) : (
                  filteredPending.map((row) => (
                    <PTR key={row.id} $hoverable>
                      <PTD>
                        <PendingId>{row.id}</PendingId>
                      </PTD>
                      <PTD>
                        <SellerName>{row.seller}</SellerName>
                      </PTD>
                      <PTD>
                        <DateCell>{row.dueDate}</DateCell>
                      </PTD>
                      <PTD>
                        <AmountCell>{row.amount}</AmountCell>
                      </PTD>
                      <PTD>
                        <StatusBadge
                          $bg={SETTLEMENT_STATUS_MAP[row.settlementStatus].bg}
                          $color={
                            SETTLEMENT_STATUS_MAP[row.settlementStatus].color
                          }
                        >
                          {SETTLEMENT_STATUS_MAP[row.settlementStatus].label}
                        </StatusBadge>
                      </PTD>
                      <PTD>
                        <ApprovalBtn
                          $bg={APPROVAL_STATUS_MAP[row.approvalStatus].bg}
                          $color={APPROVAL_STATUS_MAP[row.approvalStatus].color}
                        >
                          {APPROVAL_STATUS_MAP[row.approvalStatus].label}
                        </ApprovalBtn>
                      </PTD>
                    </PTR>
                  ))
                )}
              </PTBody>
            </PendingTable>

            <ViewAllRow>
              <ViewAllBtn>전체 목록 보기</ViewAllBtn>
            </ViewAllRow>
          </PendingSection>
        </SettlementBottom>
      </SectionBlock>
    </PageWrapper>
  );
}

/* ── Icon helpers ── */
function WalletIcon() { return <Wallet size={20} />; }
function ReceiptIcon() { return <Receipt size={20} />; }
function PercentIcon() { return <Percent size={20} />; }
function DateDot() {
  return (
    <span
      style={{
        width: 5, height: 5, borderRadius: '50%',
        background: '#94a3b8', display: 'inline-block',
        marginRight: 5, verticalAlign: 'middle',
      }}
    />
  );
}

/* ── Styled Components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
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
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── 섹션 블록 ── */
const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding-bottom: 4px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
`;

/* ── 정산 현황 ── */
const SettlementCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const StatSubText = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 4px;
`;

/* ── 정산 하단 2열 ── */
const SettlementBottom = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  align-items: start;
`;

/* Top5 */
const Top5Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 22px 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Top5Title = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 16px;
`;

const Top5List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Top5Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child { border-bottom: none; }
`;

const Top5Rank = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  background: ${({ $rank }) =>
    $rank === 1 ? '#fef9c3' : $rank === 2 ? '#f1f5f9' : $rank === 3 ? '#fff7ed' : '#f8fafc'};
  color: ${({ $rank }) =>
    $rank === 1 ? '#a16207' : $rank === 2 ? '#475569' : $rank === 3 ? '#c2410c' : '#94a3b8'};
`;

const Top5Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Top5Name = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Top5Date = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
`;

const Top5Amount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  white-space: nowrap;
`;

/* 정산 대기 목록 */
const PendingSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const PendingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PendingTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const PendingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const PTHead = styled.thead`
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PTBody = styled.tbody``;

const PTR = styled.tr`
  border-top: ${({ $hoverable, theme }) =>
    $hoverable ? `1px solid ${theme.colors.borderLight}` : 'none'};
  transition: background 0.1s;
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const PTH = styled.th`
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  letter-spacing: 0.3px;
`;

const PTD = styled.td`
  padding: 13px 16px;
  vertical-align: middle;
`;

const PendingId = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  font-family: ${({ theme }) => theme.fonts.number};
`;

const SellerName = styled.span`
  font-size: 13px;
  color: #334155;
  font-weight: 500;
`;

const DateCell = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const AmountCell = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const ApprovalBtn = styled.button`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-family: inherit;
  transition: opacity 0.15s;
  &:hover { opacity: 0.8; }
`;

const EmptyPending = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const ViewAllRow = styled.div`
  display: flex;
  justify-content: center;
  padding: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ViewAllBtn = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  padding: 7px 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;
