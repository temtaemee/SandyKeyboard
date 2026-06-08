// src/features/admin/components/dashboard/AdminChartPanel.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DollarSign, X } from 'lucide-react';
import { createPortal } from 'react-dom';
// Recharts 컴포넌트 임포트
import {
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import {
  getMonthlySalesGraphStats,
  getAdminSalesSummary,
  getMonthlyRegionStats,
} from '../../api/adminSalesApi';
import YearMonthPicker from '../common/YearMonthPicker';

const NOW = new Date();

export default function AdminChartPanel() {
  const [period, setPeriod] = useState('6m'); // '6m' | '1y'
  const [revenueDate, setRevenueDate] = useState({
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });
  const [regionDate, setRegionDate] = useState({
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });
  const [cumulativeDate, setCumulativeDate] = useState({
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState({
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });

  // 백엔드 통계 데이터용 State
  const [graphData, setGraphData] = useState({
    sixMonths: [],
    twelveMonths: [],
  });
  const [loading, setLoading] = useState(true);

  // 실시간 DB 데이터용 State
  const [cumulativeSales, setCumulativeSales] = useState(0);
  const [monthlyNetSales, setMonthlyNetSales] = useState(0);
  const [regionalSales, setRegionalSales] = useState([]);
  const [modalRegionalSales, setModalRegionalSales] = useState([]);
  const [regionLoading, setRegionLoading] = useState(false);
  const [modalRegionLoading, setModalRegionLoading] = useState(false);

  // 1. 누적 매출액 조회 (마운트 시 1회 실행)
  useEffect(() => {
    async function fetchCumulative() {
      try {
        const resp = await getAdminSalesSummary();
        setCumulativeSales(resp.data?.totalNetSales ?? 0);
      } catch (err) {
        console.error('누적 매출액 조회 실패:', err);
      }
    }
    fetchCumulative();
  }, []);

  // 2. 선택 연월별 총 매출액 조회
  useEffect(() => {
    async function fetchMonthlySales() {
      try {
        const resp = await getMonthlyRegionStats(
          revenueDate.year,
          revenueDate.month
        );
        setMonthlyNetSales(resp.data?.totalSalesInfo?.totalNetSales ?? 0);
      } catch (err) {
        console.error('총 매출액 조회 실패:', err);
        setMonthlyNetSales(0);
      }
    }
    fetchMonthlySales();
  }, [revenueDate]);

  // 3. 선택 연월별 지역별 매출 TOP 5 조회
  useEffect(() => {
    async function fetchRegionStats() {
      try {
        setRegionLoading(true);
        const resp = await getMonthlyRegionStats(
          regionDate.year,
          regionDate.month
        );
        const list = resp.data?.areaSalesList || [];
        const sorted = [...list].sort(
          (a, b) => b.totalNetSales - a.totalNetSales
        );
        setRegionalSales(sorted.slice(0, 5));
      } catch (err) {
        console.error('지역별 매출 TOP 5 조회 실패:', err);
        setRegionalSales([]);
      } finally {
        setRegionLoading(false);
      }
    }
    fetchRegionStats();
  }, [regionDate]);

  // 4. 지역별 매출 모달용 전체 데이터 조회
  useEffect(() => {
    if (!regionModalOpen) return;
    async function fetchModalRegionStats() {
      try {
        setModalRegionLoading(true);
        const resp = await getMonthlyRegionStats(
          modalDate.year,
          modalDate.month
        );
        const list = resp.data?.areaSalesList || [];
        const sorted = [...list].sort(
          (a, b) => b.totalNetSales - a.totalNetSales
        );
        setModalRegionalSales(sorted);
      } catch (err) {
        console.error('지역별 매출 전체 조회 실패:', err);
        setModalRegionalSales([]);
      } finally {
        setModalRegionLoading(false);
      }
    }
    fetchModalRegionStats();
  }, [modalDate, regionModalOpen]);

  // API 데이터 로드
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const resp = await getMonthlySalesGraphStats();
        setGraphData(resp.data);
      } catch (err) {
        console.error('매출 그래프 데이터 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // 매출 데이터가 존재하는 모든 연월 목록 추출 및 기본값 설정
  const getSalesAvailableDates = () => {
    const dates = [];
    const list = graphData.twelveMonths || [];
    list.forEach((item) => {
      if (item.yearMonth) {
        const [yStr, mStr] = item.yearMonth.split('-');
        const year = parseInt(yStr, 10);
        const month = parseInt(mStr, 10);
        if (!isNaN(year) && !isNaN(month)) {
          if (!dates.some((d) => d.year === year && d.month === month)) {
            dates.push({ year, month });
          }
        }
      }
    });
    return dates.sort((a, b) => b.year - a.year || b.month - a.month);
  };

  const salesAvailableDates = getSalesAvailableDates();

  useEffect(() => {
    if (salesAvailableDates.length > 0) {
      const latest = salesAvailableDates[0];
      const target = { year: latest.year, month: latest.month };
      setRevenueDate(target);
      setRegionDate(target);
      setModalDate(target);
    }
  }, [graphData]);

  // Recharts 가공 데이터 바인딩
  const getChartData = () => {
    const rawList =
      period === '6m' ? graphData.sixMonths : graphData.twelveMonths;
    if (!rawList || rawList.length === 0) return [];

    // yearMonth 오름차순 정렬 (오래된 달 왼쪽 → 최신 달 오른쪽)
    const sorted = [...rawList].sort((a, b) =>
      a.yearMonth.localeCompare(b.yearMonth)
    );

    return sorted.map((item, idx) => {
      const monthPart = item.yearMonth.split('-')[1];
      const monthLabel = monthPart
        ? `${parseInt(monthPart, 10)}월`
        : item.yearMonth;
      const isLatest = idx === sorted.length - 1;

      return {
        month: monthLabel,
        amount: item.totalNetSales,
        highlight: isLatest,
      };
    });
  };

  const chartData = getChartData();
  const selected =
    period === '6m'
      ? { sub: '지난 6개월간의 결제 데이터 추이' }
      : { sub: '지난 1년간의 결제 데이터 추이' };

  return (
    <>
      <Grid>
        {/* ── 왼쪽 상단: 누적 매출액 + 총 매출액 카드 ── */}
        <RevenueRow>
          {/* 누적 매출액 */}
          <RevenueCard>
            <RevenueLeft>
              <RevenueIconWrap $bg="rgba(167,139,250,0.15)" $color="#7c3aed">
                <DollarSign size={20} color="#7c3aed" strokeWidth={1.8} />
              </RevenueIconWrap>
              <RevenueTexts>
                <RevenueLabel>누적 매출액</RevenueLabel>
                <RevenueValue>₩{cumulativeSales.toLocaleString()}</RevenueValue>
              </RevenueTexts>
            </RevenueLeft>
          </RevenueCard>

          {/* 총 매출액 */}
          <RevenueCard>
            <RevenueLeft>
              <RevenueIconWrap $bg="rgba(204,251,241,0.7)" $color="#0d9488">
                <DollarSign size={20} color="#0d9488" strokeWidth={1.8} />
              </RevenueIconWrap>
              <RevenueTexts>
                <RevenueLabel>총 매출액</RevenueLabel>
                <RevenueValue>₩{monthlyNetSales.toLocaleString()}</RevenueValue>
              </RevenueTexts>
            </RevenueLeft>
            <YearMonthPicker
              year={revenueDate.year}
              month={revenueDate.month}
              onChange={(y, m) => setRevenueDate({ year: y, month: m })}
              availableDates={salesAvailableDates}
            />
          </RevenueCard>
        </RevenueRow>

        {/* ── 왼쪽 하단: 월간 매출 트렌드 차트 ── */}
        <ChartCard>
          <ChartHeader>
            <ChartTitleGroup>
              <ChartTitle>월간 매출 트렌드</ChartTitle>
              <ChartSub>{selected.sub}</ChartSub>
            </ChartTitleGroup>
            <PeriodToggle>
              <PeriodBtn
                $active={period === '6m'}
                onClick={() => setPeriod('6m')}
              >
                최근 6개월
              </PeriodBtn>
              <PeriodBtn
                $active={period === '1y'}
                onClick={() => setPeriod('1y')}
              >
                최근 1년
              </PeriodBtn>
            </PeriodToggle>
          </ChartHeader>

          <ChartContainer>
            {loading ? (
              <LoadingText>데이터 분석 중...</LoadingText>
            ) : chartData.length === 0 ? (
              <LoadingText>매출 통계가 존재하지 않습니다.</LoadingText>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) =>
                      `₩${(val / 10000).toLocaleString()}만`
                    }
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                    formatter={(value) => [
                      `₩${value.toLocaleString()}`,
                      '매출액',
                    ]}
                    contentStyle={{
                      background: '#0d1c2e',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px',
                    }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                    labelStyle={{
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  />
                  <RechartsBar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.highlight ? '#3d646c' : '#e2e8f0'}
                      />
                    ))}
                  </RechartsBar>
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </ChartCard>

        {/* ── 오른쪽: 지역별 매출 순위 (양쪽 행 모두 차지) ── */}
        <RegionCard>
          <RegionCardHeader>
            <RegionTitleRow>
              <div>
                <RegionTitle>지역별 매출 순위</RegionTitle>
                <RegionSub>지역별 실적 TOP 5</RegionSub>
              </div>
              <YearMonthPicker
                year={regionDate.year}
                month={regionDate.month}
                onChange={(y, m) => setRegionDate({ year: y, month: m })}
                availableDates={salesAvailableDates}
              />
            </RegionTitleRow>
          </RegionCardHeader>

          <RegionList>
            {regionLoading ? (
              <LoadingText style={{ height: '140px', position: 'relative' }}>
                데이터 조회 중...
              </LoadingText>
            ) : regionalSales.length === 0 ? (
              <LoadingText style={{ height: '140px', position: 'relative' }}>
                매출 정보가 없습니다.
              </LoadingText>
            ) : (
              regionalSales.map((item, idx) => (
                <RegionItem key={item.areaName}>
                  <RegionRank $rank={idx + 1}>{idx + 1}</RegionRank>
                  <RegionName>{item.areaName}</RegionName>
                  <RegionAmount>
                    ₩{item.totalNetSales.toLocaleString()}
                  </RegionAmount>
                </RegionItem>
              ))
            )}
          </RegionList>

          <RegionFooter>
            <RegionAllBtn onClick={() => setRegionModalOpen(true)}>
              전체 순위 보기 &gt;
            </RegionAllBtn>
          </RegionFooter>
        </RegionCard>
      </Grid>

      {regionModalOpen &&
        createPortal(
          <ModalOverlay onClick={() => setRegionModalOpen(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitleGroup>
                  <ModalTitle>지역별 매출 순위</ModalTitle>
                  <ModalSub>전체 지역 실적</ModalSub>
                </ModalTitleGroup>
                <ModalHeaderRight>
                  <YearMonthPicker
                    year={modalDate.year}
                    month={modalDate.month}
                    onChange={(y, m) => setModalDate({ year: y, month: m })}
                    availableDates={salesAvailableDates}
                  />
                  <ModalCloseBtn onClick={() => setRegionModalOpen(false)}>
                    <X size={18} />
                  </ModalCloseBtn>
                </ModalHeaderRight>
              </ModalHeader>

              <ModalBody>
                <ModalTable>
                  <ModalTHead>
                    <tr>
                      <ModalTH $w="80px">순위</ModalTH>
                      <ModalTH $w="100px">지역</ModalTH>
                      <ModalTH $right>매출 금액</ModalTH>
                    </tr>
                  </ModalTHead>
                  <ModalTBody>
                    {modalRegionLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#94a3b8',
                          }}
                        >
                          데이터 조회 중...
                        </td>
                      </tr>
                    ) : modalRegionalSales.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#94a3b8',
                          }}
                        >
                          매출 정보가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      modalRegionalSales.map((item, idx) => (
                        <ModalTR key={item.areaName}>
                          <ModalTD>
                            <RankBadge $rank={idx + 1}>{idx + 1}</RankBadge>
                          </ModalTD>
                          <ModalTD>
                            <RegionNameCell>{item.areaName}</RegionNameCell>
                          </ModalTD>
                          <ModalTD $right>
                            <AmountCell>
                              ₩{item.totalNetSales.toLocaleString()}
                            </AmountCell>
                          </ModalTD>
                        </ModalTR>
                      ))
                    )}
                  </ModalTBody>
                </ModalTable>
              </ModalBody>
            </ModalBox>
          </ModalOverlay>,
          document.body
        )}
    </>
  );
}

/* ── Styled Components ── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 16px;
`;

/* 왼쪽 상단 — 매출액 카드 2개 묶음 */
const RevenueRow = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const RevenueCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px 24px;
  min-height: 120px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RevenueLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const RevenueIconWrap = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg ?? 'rgba(204, 251, 241, 0.7)'};
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
  background: ${({ $active, theme }) =>
    $active ? theme.colors.white : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.adminPrimary : theme.colors.textMuted};
  box-shadow: ${({ $active }) =>
    $active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'};
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
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f1f5f9;
`;

const RegionTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
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
  &:last-child {
    border-bottom: none;
  }
`;

const RegionRank = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $rank }) =>
    $rank === 1
      ? '#fef9c3'
      : $rank === 2
        ? '#f1f5f9'
        : $rank === 3
          ? '#fff7ed'
          : '#f8fafc'};
  color: ${({ $rank }) =>
    $rank === 1
      ? '#a16207'
      : $rank === 2
        ? '#475569'
        : $rank === 3
          ? '#c2410c'
          : '#94a3b8'};
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
  &:hover {
    color: #244c54;
  }
`;

/* ── 지역별 매출 순위 모달 ── */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
`;

const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0d1c2e;
`;

const ModalSub = styled.p`
  font-size: 13px;
  color: #64748b;
`;

const ModalHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModalCloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: color 0.15s;
  &:hover {
    color: #475569;
  }
`;

const ModalBody = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 0 16px;
`;

const ModalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const ModalTHead = styled.thead`
  position: sticky;
  top: 0;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTH = styled.th`
  padding: 6px 12px;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.3px;
  width: ${({ $w }) => $w || 'auto'};
`;

const ModalTBody = styled.tbody``;

const ModalTR = styled.tr`
  border-bottom: 1px solid #f8fafc;
  transition: background 0.1s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #fafbfc;
  }
`;

const ModalTD = styled.td`
  padding: 9px 12px;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  vertical-align: middle;
`;

const RankBadge = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  background: ${({ $rank }) =>
    $rank === 1
      ? '#fef9c3'
      : $rank === 2
        ? '#f1f5f9'
        : $rank === 3
          ? '#fff7ed'
          : '#f8fafc'};
  color: ${({ $rank }) =>
    $rank === 1
      ? '#a16207'
      : $rank === 2
        ? '#475569'
        : $rank === 3
          ? '#c2410c'
          : '#94a3b8'};
`;

const RegionNameCell = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #0d1c2e;
`;

const AmountCell = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
`;

const LoadingText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
`;
