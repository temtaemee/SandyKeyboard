// src/features/admin/components/dashboard/AdminChartPanel.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { ADMIN_CHART_DATA, SYSTEM_ALERTS } from '../../data/adminDashboardData';

export default function AdminChartPanel() {
  const [period, setPeriod] = useState('최근 6개월');
  const maxHeight = Math.max(...ADMIN_CHART_DATA.map((d) => d.height));

  return (
    <Grid>
      {/* ── 왼쪽: 매출 차트 ── */}
      <ChartCard>
        <ChartHeader>
          <ChartTitleGroup>
            <ChartTitle>월간 매출 트렌드</ChartTitle>
            <ChartSub>지난 6개월간의 결제 데이터 추이</ChartSub>
          </ChartTitleGroup>
          <PeriodSelect>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option>최근 6개월</option>
              <option>최근 3개월</option>
              <option>최근 1년</option>
            </select>
            <ChevronIcon />
          </PeriodSelect>
        </ChartHeader>

        <BarChart>
          {/* 가이드 라인 */}
          <GridLines>
            {[0, 1, 2, 3].map((i) => <GridLine key={i} />)}
          </GridLines>

          {/* 바 */}
          <Bars>
            {ADMIN_CHART_DATA.map((d) => (
              <BarCol key={d.month}>
                <Bar
                  $height={d.height}
                  $highlight={d.highlight}
                  $maxHeight={maxHeight}
                />
                <BarLabel $highlight={d.highlight}>{d.month}</BarLabel>
              </BarCol>
            ))}
          </Bars>
        </BarChart>
      </ChartCard>

      {/* ── 오른쪽: 실시간 시스템 알림 ── */}
      <AlertCard>
        <AlertCardHeader>
          <AlertTitle>실시간 시스템 알림</AlertTitle>
          <AlertSub>최근 발생한 시스템 주요 이벤트</AlertSub>
        </AlertCardHeader>

        <AlertList>
          {SYSTEM_ALERTS.map((alert) => (
            <AlertItem key={alert.id}>
              <AlertDot $color={alert.color} />
              <AlertContent>
                <AlertItemTitle>{alert.title}</AlertItemTitle>
                <AlertItemDesc>{alert.desc}</AlertItemDesc>
                <AlertTime>{alert.time}</AlertTime>
              </AlertContent>
            </AlertItem>
          ))}
        </AlertList>

        <AlertFooter>
          <AlertAllBtn>전체 알림 보기</AlertAllBtn>
        </AlertFooter>
      </AlertCard>
    </Grid>
  );
}

function ChevronIcon() {
  return (
    <svg width="19.5" height="19.5" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

/* ── Styled Components ── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
`;

/* 차트 카드 */
const ChartCard = styled.div`
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

const PeriodSelect = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  select {
    appearance: none;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 9px 41px 9px 13px;
    font-size: 13px;
    color: #0d1c2e;
    font-family: inherit;
    cursor: pointer;
    outline: none;
  }

  svg {
    position: absolute;
    right: 9px;
    pointer-events: none;
  }
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
  height: 1px;
  background: #f8fafc;
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
  background: ${({ $highlight }) => $highlight ? '#3d646c' : '#f1f5f9'};
  border-radius: 4px 4px 0 0;
  box-shadow: ${({ $highlight }) =>
    $highlight ? '0 10px 15px -3px rgba(19,78,74,0.1), 0 4px 6px -4px rgba(19,78,74,0.1)' : 'none'};
  transition: background 0.2s;
`;

const BarLabel = styled.span`
  font-size: 12px;
  font-weight: ${({ $highlight }) => $highlight ? '700' : '600'};
  color: ${({ $highlight }) => $highlight ? '#244c54' : '#94a3b8'};
  letter-spacing: 0.6px;
`;

/* 알림 카드 */
const AlertCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AlertCardHeader = styled.div`
  padding: 24px 24px 25px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AlertTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #0d1c2e;
`;

const AlertSub = styled.p`
  font-size: 13px;
  color: #64748b;
`;

const AlertList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

const AlertItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 12px;
  border-radius: 4px;
`;

const AlertDot = styled.div`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 8px;
`;

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AlertItemTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #0d1c2e;
  line-height: 1.4;
`;

const AlertItemDesc = styled.p`
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
`;

const AlertTime = styled.p`
  font-size: 10px;
  font-weight: 500;
  color: #94a3b8;
`;

const AlertFooter = styled.div`
  border-top: 1px solid #f1f5f9;
  padding: 17px 16px 16px;
`;

const AlertAllBtn = styled.button`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #244c54;
  text-align: center;
  letter-spacing: 0.6px;
  transition: background 0.15s;

  &:hover {
    background: #f0fdf4;
  }
`;
