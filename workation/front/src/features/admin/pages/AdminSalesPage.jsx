// src/features/admin/pages/AdminSalesPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import {
  SALES_STAT_CARDS,
  MONTHLY_CHART_DATA,
  TOP5_SETTLEMENTS,
  URGENT_ALERTS,
  PENDING_LIST,
  SETTLEMENT_STATUS_MAP,
  APPROVAL_STATUS_MAP,
} from '../data/adminSalesData';

const MAX_COUNT = Math.max(...MONTHLY_CHART_DATA.map((d) => d.count));

export default function AdminSalesPage() {
  return (
    <PageWrapper>
      {/* ── 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>정산 관리</PageTitle>
          <PageSub>전체 거래처의 정산 현황 및 지표를 통합 관리합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 상단 통계 카드 3개 ── */}
      <StatsSection>
        {/* 카드 1: 정산 완료 금액 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(34,197,94,0.1)" $color="#16a34a">
              <WalletIcon />
            </StatIconWrap>
            <StatTrendRow>
              <TrendUp />
              <TrendText>+8.4%</TrendText>
            </StatTrendRow>
          </StatCardTop>
          <StatLabel>{SALES_STAT_CARDS[0].label}</StatLabel>
          <StatValue>{SALES_STAT_CARDS[0].value}</StatValue>
        </StatCard>

        {/* 카드 2: 정산 건수 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(59,130,246,0.1)" $color="#2563eb">
              <ReceiptIcon />
            </StatIconWrap>
          </StatCardTop>
          <StatLabel>{SALES_STAT_CARDS[1].label}</StatLabel>
          <StatValue>{SALES_STAT_CARDS[1].value}</StatValue>
          <ProgressWrap>
            <ProgressBar $width={68} />
          </ProgressWrap>
        </StatCard>

        {/* 카드 3: 수수료 총액 */}
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
      </StatsSection>

      {/* ── 중단: 차트 + TOP5 + 긴급알림 ── */}
      <MidSection>
        {/* 월별 정산 건수 추이 */}
        <ChartCard>
          <ChartTitle>월별 정산 건수 추이</ChartTitle>
          <BarArea>
            {MONTHLY_CHART_DATA.map((d) => (
              <BarCol key={d.month}>
                <BarWrap>
                  <Bar
                    $height={Math.round((d.count / MAX_COUNT) * 100)}
                    $highlight={d.highlight}
                  />
                </BarWrap>
                <BarLabel $highlight={d.highlight}>{d.month}</BarLabel>
              </BarCol>
            ))}
          </BarArea>
          <ChartFooterText>
            이번 달 정산 건수는 전달 대비 <Strong>12%</Strong>{' '}
            <TrendInline /> 했습니다.
          </ChartFooterText>
        </ChartCard>

        {/* 정산 금액 Top 5 거래처 */}
        <Top5Card>
          <Top5Title>정산 금액 Top 5 거래처</Top5Title>
          <Top5List>
            {TOP5_SETTLEMENTS.map((item) => (
              <Top5Item key={item.rank}>
                <Top5Rank>{item.rank}</Top5Rank>
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

        {/* 긴급 정산 알림 */}
        <AlertCard>
          <AlertCardHeader>
            <AlertIconWrap>
              <AlertDiamondIcon />
            </AlertIconWrap>
            <AlertCardTitle>긴급 정산 알림</AlertCardTitle>
          </AlertCardHeader>
          <AlertList>
            {URGENT_ALERTS.map((alert) => (
              <AlertItem key={alert.id} $urgent={alert.urgent}>
                <AlertItemHeader>
                  <AlertId>{alert.title}</AlertId>
                  <AlertActionBtn $dark={alert.labelColor === 'dark'}>
                    {alert.label}
                  </AlertActionBtn>
                </AlertItemHeader>
                <AlertDesc>{alert.desc}</AlertDesc>
              </AlertItem>
            ))}
          </AlertList>
          <AlertFooterNote>
            ※ 모든 지연 항목은 24시간 이내에 처리되어야 합니다. 긴급 도움이 필요한 경우 기술 지원팀에 문의하세요.
          </AlertFooterNote>
        </AlertCard>
      </MidSection>

      {/* ── 하단: 정산 대기 목록 ── */}
      <PendingSection>
        <PendingHeader>
          <PendingTitle>정산 대기 목록</PendingTitle>
          <PendingCount>총 18건의 대기 중인 항목이 있습니다.</PendingCount>
        </PendingHeader>

        <PendingTable>
          <PTHead>
            <PTR>
              <PTH $width="32px">
                <PinIconSmall />
              </PTH>
              <PTH>ID</PTH>
              <PTH>거래처명</PTH>
              <PTH>정산 요청일</PTH>
              <PTH>정산 대상액</PTH>
              <PTH>현재 상태</PTH>
              <PTH></PTH>
            </PTR>
          </PTHead>
          <PTBody>
            {PENDING_LIST.map((row) => (
              <PTR key={row.id} $hoverable>
                <PTD>
                  <RowDotIcon />
                </PTD>
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
                    $color={SETTLEMENT_STATUS_MAP[row.settlementStatus].color}
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
            ))}
          </PTBody>
        </PendingTable>

        <ViewAllRow>
          <ViewAllBtn>전체 목록 보기</ViewAllBtn>
        </ViewAllRow>
      </PendingSection>
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
      <line x1="20" y1="12" x2="14" y2="12" /><circle cx="14" cy="12" r="2" />
    </svg>
  );
}
function ReceiptIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
}
function PercentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
function TrendUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function TrendInline() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 2 }}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    </svg>
  );
}
function AlertDiamondIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function DateDot() {
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', marginRight: 4, verticalAlign: 'middle' }} />;
}
function PinIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
function RowDotIcon() {
  return <span style={{ display: 'flex', gap: 2 }}>{[0,1].map(i => <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1', display: 'block' }} />)}</span>;
}

/* ── Styled Components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
`;

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

/* 통계 카드 */
const StatsSection = styled.div`
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

const StatTrendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
`;

const TrendText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
`;

const StatSubText = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 4px;
`;

const ProgressWrap = styled.div`
  margin-top: 8px;
  height: 6px;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ theme }) => theme.colors.adminPrimary};
  border-radius: 999px;
`;

/* 중단 3열 */
const MidSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 16px;
  align-items: start;
`;

/* 차트 카드 */
const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 22px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const ChartTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 20px;
`;

const BarArea = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  gap: 8px;
  margin-bottom: 16px;
`;

const BarCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
`;

const BarWrap = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
`;

const Bar = styled.div`
  width: 100%;
  height: ${({ $height }) => $height}%;
  background: ${({ $highlight, theme }) => ($highlight ? theme.colors.adminPrimary : theme.colors.border)};
  border-radius: 4px 4px 0 0;
  transition: background 0.2s;
`;

const BarLabel = styled.span`
  font-size: 11px;
  color: ${({ $highlight, theme }) => ($highlight ? theme.colors.adminPrimary : theme.colors.textLight)};
  font-weight: ${({ $highlight }) => ($highlight ? '700' : '500')};
`;

const ChartFooterText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

const Strong = styled.strong`
  color: #16a34a;
  font-weight: 600;
`;

/* TOP5 카드 */
const Top5Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 22px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Top5Title = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 16px;
`;

const Top5List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Top5Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Top5Rank = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 16px;
  flex-shrink: 0;
`;

const Top5Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Top5Name = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const Top5Date = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
`;

const Top5Amount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  white-space: nowrap;
`;

/* 긴급 알림 카드 */
const AlertCard = styled.div`
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AlertIconWrap = styled.div`
  display: flex;
  align-items: center;
`;

const AlertCardTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #b91c1c;
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AlertItem = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ $urgent, theme }) => ($urgent ? '#fca5a5' : theme.colors.border)};
  border-radius: 6px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AlertItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AlertId = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const AlertActionBtn = styled.button`
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid ${({ $dark, theme }) => ($dark ? '#1e293b' : theme.colors.border)};
  background: ${({ $dark, theme }) => ($dark ? '#1e293b' : theme.colors.white)};
  color: ${({ $dark, theme }) => ($dark ? theme.colors.white : theme.colors.textMid)};
  font-family: inherit;
  transition: opacity 0.15s;
  &:hover { opacity: 0.8; }
`;

const AlertDesc = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const AlertFooterNote = styled.p`
  font-size: 10px;
  color: #b91c1c;
  line-height: 1.6;
  padding-top: 4px;
  border-top: 1px solid #fecaca;
`;

/* 하단 정산 대기 목록 */
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
  padding: 18px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PendingTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const PendingCount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
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
  border-top: ${({ $hoverable, theme }) => ($hoverable ? `1px solid ${theme.colors.borderLight}` : 'none')};
  transition: background 0.1s;
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const PTH = styled.th`
  padding: 10px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;

const PTD = styled.td`
  padding: 16px 20px;
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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

const ApprovalBtn = styled.button`
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-family: inherit;
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
`;

const ViewAllRow = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ViewAllBtn = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  padding: 8px 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;
