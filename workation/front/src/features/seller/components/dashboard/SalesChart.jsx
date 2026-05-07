// src/features/seller/components/dashboard/SalesChart.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { CHART_DATA } from '../../data/dashboardData';

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월'];
const YEARS = ['2023', '2024'];

// 숫자를 한국어 단위로 포맷 (e.g. 12850000 → 1285만)
const formatKorean = (val) => {
  if (val >= 10000000) return `${(val / 10000000).toFixed(0)}천만`;
  if (val >= 1000000) return `${(val / 1000000).toFixed(0)}백만`;
  return `${(val / 10000).toFixed(0)}만`;
};

export default function SalesChart() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const data = CHART_DATA[selectedYear];
  const maxValue = Math.max(...data.map((d) => d.value));

  // Y축 눈금 5단계
  const yTicks = Array.from({ length: 5 }, (_, i) =>
    Math.round((maxValue / 4) * (4 - i))
  );

  const chartHeight = 200;
  const barWidth = 48;
  const totalWidth = 600;
  const gap = (totalWidth - barWidth * 6) / 7;

  return (
    <ChartSection>
      <ChartShadow />
      <ChartHeader>
        <ChartTitleGroup>
          <ChartTitle>월별 매출 추이</ChartTitle>
          <ChartSubtitle>지난 6개월간의 매출 변화를 확인하세요.</ChartSubtitle>
        </ChartTitleGroup>
        <YearTabs>
          {YEARS.map((year) => (
            <YearTab
              key={year}
              $active={selectedYear === year}
              onClick={() => setSelectedYear(year)}
            >
              {year}년
            </YearTab>
          ))}
        </YearTabs>
      </ChartHeader>

      <ChartBody>
        {/* Y축 레이블 */}
        <YAxis>
          {yTicks.map((tick) => (
            <YTick key={tick}>{formatKorean(tick)}</YTick>
          ))}
        </YAxis>

        {/* SVG 바 차트 */}
        <BarArea>
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${totalWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {/* 가이드 라인 */}
            {yTicks.map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={(chartHeight / 4) * i}
                x2={totalWidth}
                y2={(chartHeight / 4) * i}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}

            {/* 바 */}
            {data.map((d, i) => {
              const barH = (d.value / maxValue) * chartHeight * 0.9;
              const x = gap + i * (barWidth + gap);
              const y = chartHeight - barH;
              const isHighlight = d.month === '5월';

              return (
                <g key={d.month}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barH}
                    rx="6"
                    fill={isHighlight ? '#3d646c' : '#c3edf6'}
                    opacity={isHighlight ? 1 : 0.7}
                  />
                  {isHighlight && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#3d646c"
                      fontWeight="500"
                    >
                      {formatKorean(d.value)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* X축 레이블 */}
          <XAxis>
            {MONTHS.map((month) => (
              <XLabel key={month}>{month}</XLabel>
            ))}
          </XAxis>
        </BarArea>
      </ChartBody>
    </ChartSection>
  );
}

/* ── Styled Components ── */

const ChartSection = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 33px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const ChartShadow = styled.div`
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  pointer-events: none;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ChartTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChartTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: #244c54;
  line-height: 1.4;
`;

const ChartSubtitle = styled.p`
  font-size: 16px;
  color: #41484a;
  font-weight: 500;
`;

const YearTabs = styled.div`
  display: flex;
  gap: 8px;
`;

const YearTab = styled.button`
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 500;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? '#3d646c' : '#eceef0')};
  color: ${({ $active }) => ($active ? 'white' : '#41484a')};
`;

const ChartBody = styled.div`
  display: flex;
  gap: 16px;
  height: 240px;
`;

const YAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 24px;
  width: 48px;
  flex-shrink: 0;
`;

const YTick = styled.span`
  font-size: 10px;
  color: #94a3b8;
  text-align: right;
  letter-spacing: 0.5px;
`;

const BarArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const XAxis = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 8px;
`;

const XLabel = styled.span`
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 0.5px;
  flex: 1;
  text-align: center;
`;
