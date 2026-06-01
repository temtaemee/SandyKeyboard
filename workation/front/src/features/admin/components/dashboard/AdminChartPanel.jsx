// src/features/admin/components/dashboard/AdminChartPanel.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { DollarSign } from 'lucide-react';
import {
  ADMIN_CHART_DATA,
  ADMIN_CHART_DATA_12M,
  REGIONAL_SALES_DATA,
} from '../../data/adminDashboardData';
import { ADMIN_STAT_CARDS } from '../../data/adminDashboardData';

const PERIOD_OPTIONS = [
  { value: '6m', label: '최근 6개월', sub: '지난 6개월간의 결제 데이터 추이', data: ADMIN_CHART_DATA },
  { value: '1y', label: '최근 1년',   sub: '지난 1년간의 결제 데이터 추이',  data: ADMIN_CHART_DATA_12M },
];

export default function AdminChartPanel() {
  const [period, setPeriod] = useState('6m');
  const selected = PERIOD_OPTIONS.find((o) => o.value === period);
  const chartData = selected.data;

  return (
    <Grid>
      {/* ── 왼쪽 상단: 총 매출액 카드 ── */}
      <RevenueCard>
        <RevenueIconWrap>
          <DollarSign size={20} color="#0d9488" strokeWidth={1.8} />
        </RevenueIconWrap>
        <RevenueTexts>
          <RevenueLabel>{ADMIN_STAT_CARDS[0].label}</RevenueLabel>
          <RevenueValue>{ADMIN_STAT_CARDS[0].value}</RevenueValue>
        </RevenueTexts>
      </RevenueCard>

      {/* ── 왼쪽 하단: 월간 매출 트렌드 차트 ── */}
      <ChartCard>
        <ChartHeader>
          <ChartTitleGroup>
            <ChartTitle>월간 매출 트렌드</ChartTitle>
            <ChartSub>{selected.sub}</ChartSub>
          </ChartTitleGroup>
          <PeriodToggle>
            {PERIOD_OPTIONS.map((opt) => (
              <PeriodBtn
                key={opt.value}
                $active={period === opt.value}
                onClick={() => setPeriod(opt.value)}
              >
                {opt.label}
              </PeriodBtn>
            ))}
          </PeriodToggle>
        </ChartHeader>

        <BarChart>
          <GridLines>
            {[0, 1, 2, 3].map((i) => <GridLine key={i} />)}
          </GridLines>
          <Bars>
            {chartData.map((d, i) => (
              <BarCol key={`${d.month}-${i}`}>
                <Bar $height={d.height} $highlight={d.highlight} />
                <BarLabel $highlight={d.highlight}>{d.month}</BarLabel>
              </BarCol>
            ))}
          </Bars>
        </BarChart>
      </ChartCard>

      {/* ── 오른쪽: 지역별 매출 순위 (양쪽 행 모두 차지) ── */}
      <RegionCard>
        <RegionCardHeader>
          <RegionTitle>지역별 매출 순위</RegionTitle>
          <RegionSub>지역별 실적 TOP 5</RegionSub>
        </RegionCardHeader>

        <RegionList>
          {REGIONAL_SALES_DATA.map((item) => (
            <RegionItem key={item.rank}>
              <RegionRank>{item.rank}</RegionRank>
              <RegionName>{item.region}</RegionName>
              <RegionAmount>{item.amount}</RegionAmount>
            </RegionItem>
          ))}
        </RegionList>

        <RegionFooter>
          <RegionAllBtn>전체 순위 보기 &gt;</RegionAllBtn>
        </RegionFooter>
      </RegionCard>
    </Grid>
  );
}

/* ── Styled Components ── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 16px;
`;

/* 왼쪽 상단 — 총 매출액 */
const RevenueCard = styled.div`
  grid-column: 1;
  grid-row: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 14px;
`;

const RevenueIconWrap = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(204, 251, 241, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const RevenueTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RevenueLabel = styled.p`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const RevenueValue = styled.p`
  font-size: 26px;
  font-weight: 700;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

/* 왼쪽 하단 — 차트 */
const ChartCard = styled.div`
  grid-column: 1;
  grid-row: 2;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ChartTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ChartTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #0d1c2e;
  line-height: 1.4;
`;

const ChartSub = styled.p`
  font-size: 13px;
  color: #64748b;
`;

const PeriodToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 6px;
  padding: 3px;
  gap: 2px;
`;

const PeriodBtn = styled.button`
  padding: 7px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active, theme }) => ($active ? theme.colors.white : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.adminPrimary : theme.colors.textMuted)};
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none')};
  white-space: nowrap;
`;

const BarChart = styled.div`
  position: relative;
  height: 300px;
  padding: 0 16px;
`;

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 1px;
`;

const GridLine = styled.div`
  width: 100%;
  border-top: 1px solid #f8fafc;
`;

const Bars = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 24px;
`;

const BarCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 48px;
`;

const Bar = styled.div`
  width: 100%;
  height: ${({ $height }) => $height}px;
  background: ${({ $highlight }) => ($highlight ? '#3d646c' : '#f1f5f9')};
  border-radius: 4px 4px 0 0;
  box-shadow: ${({ $highlight }) =>
    $highlight
      ? '0 10px 15px -3px rgba(19,78,74,0.1), 0 4px 6px -4px rgba(19,78,74,0.1)'
      : 'none'};
  transition: background 0.2s;
`;

const BarLabel = styled.span`
  font-size: 12px;
  font-weight: ${({ $highlight }) => ($highlight ? '700' : '600')};
  color: ${({ $highlight }) => ($highlight ? '#244c54' : '#94a3b8')};
  letter-spacing: 0.6px;
`;

/* 오른쪽 — 지역별 매출 순위 (row 1~2 모두 차지) */
const RegionCard = styled.div`
  grid-column: 2;
  grid-row: 1 / 3;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const RegionCardHeader = styled.div`
  padding: 24px 24px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RegionTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #0d1c2e;
`;

const RegionSub = styled.p`
  font-size: 13px;
  color: #64748b;
`;

const RegionList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RegionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
`;

const RegionRank = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #244c54;
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const RegionName = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #0d1c2e;
`;

const RegionAmount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const RegionFooter = styled.div`
  border-top: 1px solid #f1f5f9;
  padding: 16px 24px;
  text-align: right;
`;

const RegionAllBtn = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  transition: color 0.15s;
  &:hover { color: #244c54; }
`;
