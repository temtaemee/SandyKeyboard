import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DollarSign, TrendingUp, CalendarDays, Users, RefreshCw } from 'lucide-react';
import { reservationApi } from '../api/reservationApi';

const ACCENT = '#3ec9a7';

// 매출로 집계할 상태 (취소/환불 제외)
const SALES_STATUSES = ['PAYMENT_COMPLETED', 'RESERVED', 'COMPLETED'];

const STATUS_COLOR = {
  PAYMENT_COMPLETED: '#c2410c',
  RESERVED:          '#15803d',
  USER_CANCELLED:    '#dc2626',
  SELLER_CANCELLED:  '#dc2626',
  REFUND_COMPLETED:  '#7c3aed',
  COMPLETED:         '#0369a1',
  PENDING:           '#64748b',
};
const STATUS_BG = {
  PAYMENT_COMPLETED: '#ffedd5',
  RESERVED:          '#dcfce7',
  USER_CANCELLED:    '#fee2e2',
  SELLER_CANCELLED:  '#fee2e2',
  REFUND_COMPLETED:  '#ede9fe',
  COMPLETED:         '#e0f2fe',
  PENDING:           '#f1f5f9',
};

const fmt = (n) => Number(n || 0).toLocaleString() + '원';

function getYearMonth(dateStr) {
  if (!dateStr) return null;
  return String(dateStr).slice(0, 7);
}

export default function SalesPage() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterMonth, setFilterMonth] = useState('ALL');
  const [fetchedAt, setFetchedAt] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // 한 번에 최대 500건 조회 (size 파라미터 백엔드 추가 필요)
      const res = await reservationApi.getList({ pno: 0, size: 500 });
      const content = res.data?.content ?? [];
      setAllData(content);
      setFetchedAt(new Date().toLocaleTimeString());
    } catch (e) {
      setError(e.response?.data?.message ?? '데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // 매출로 집계되는 예약만 필터
  const salesData = allData.filter((r) => SALES_STATUSES.includes(r.status));

  // 월별 그룹핑
  const byMonth = salesData.reduce((acc, r) => {
    const m = getYearMonth(r.checkinDate);
    if (!m) return acc;
    if (!acc[m]) acc[m] = { revenue: 0, count: 0 };
    acc[m].revenue += Number(r.totalPrice || 0);
    acc[m].count += 1;
    return acc;
  }, {});

  const monthKeys = Object.keys(byMonth).sort();
  const thisMonthKey = monthKeys[monthKeys.length - 1] ?? null;
  const prevMonthKey = monthKeys[monthKeys.length - 2] ?? null;
  const thisMonthData = thisMonthKey ? byMonth[thisMonthKey] : { revenue: 0, count: 0 };
  const prevMonthData = prevMonthKey ? byMonth[prevMonthKey] : null;
  const growth = prevMonthData && prevMonthData.revenue > 0
    ? Math.round(((thisMonthData.revenue - prevMonthData.revenue) / prevMonthData.revenue) * 100)
    : null;

  const totalRevenue = salesData.reduce((s, r) => s + Number(r.totalPrice || 0), 0);

  // 스테이별 매출 집계
  const byStay = salesData.reduce((acc, r) => {
    const key = r.stayName ?? `숙소 #${r.stayId}`;
    if (!acc[key]) acc[key] = { stayName: key, spaceName: r.spaceName ?? '', revenue: 0, count: 0 };
    acc[key].revenue += Number(r.totalPrice || 0);
    acc[key].count += 1;
    return acc;
  }, {});
  const topStays = Object.values(byStay)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const maxRevenue = topStays[0]?.revenue ?? 0;

  // 차트 데이터
  const chartMonths = monthKeys.slice(-6); // 최근 6개월
  const chartMax = Math.max(...chartMonths.map((m) => byMonth[m]?.revenue ?? 0), 1);

  // 테이블 필터
  const tableMonths = ['ALL', ...monthKeys];
  const filteredRecords = filterMonth === 'ALL'
    ? allData
    : allData.filter((r) => getYearMonth(r.checkinDate) === filterMonth);

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>매출 관리</PageTitle>
          <PageSub>
            공간 및 스테이 매출 현황 {fetchedAt && <FetchTime>— {fetchedAt} 기준</FetchTime>}
          </PageSub>
        </TitleGroup>
        <RefreshBtn onClick={load} disabled={loading}>
          <RefreshCw size={14} />새로고침
        </RefreshBtn>
      </PageHeader>

      {error && <ErrorBar>{error}</ErrorBar>}

      {/* 요약 카드 */}
      <SummaryGrid>
        <SummaryCard>
          <IconBg $color="#dcfce7"><DollarSign size={20} color="#15803d" /></IconBg>
          <SummaryLabel>총 매출 (누적)</SummaryLabel>
          <SummaryValue>{fmt(totalRevenue)}</SummaryValue>
          <SummaryNote>결제완료 + 예약확정 + 이용완료 합산</SummaryNote>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#dbeafe"><TrendingUp size={20} color="#1d4ed8" /></IconBg>
          <SummaryLabel>이번 달 매출</SummaryLabel>
          <SummaryValue>{fmt(thisMonthData.revenue)}</SummaryValue>
          <SummaryNote $positive={growth !== null ? growth >= 0 : undefined}>
            {growth !== null ? `전월 대비 ${growth >= 0 ? '+' : ''}${growth}%` : '이전 데이터 없음'}
          </SummaryNote>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ffedd5"><CalendarDays size={20} color="#c2410c" /></IconBg>
          <SummaryLabel>이번 달 예약</SummaryLabel>
          <SummaryValue>{thisMonthData.count}건</SummaryValue>
          <SummaryNote>매출 집계 기준</SummaryNote>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ede9fe"><Users size={20} color="#7c3aed" /></IconBg>
          <SummaryLabel>전체 예약 건수</SummaryLabel>
          <SummaryValue>{salesData.length}건</SummaryValue>
          <SummaryNote>취소/환불 제외</SummaryNote>
        </SummaryCard>
      </SummaryGrid>

      <BottomGrid>
        {/* 월별 매출 차트 */}
        <Card>
          <CardTitle>월별 매출 추이 (최근 6개월)</CardTitle>
          {loading ? (
            <ChartLoading>로딩 중...</ChartLoading>
          ) : chartMonths.length === 0 ? (
            <ChartLoading>데이터 없음</ChartLoading>
          ) : (
            <ChartArea>
              {chartMonths.map((m) => {
                const rev = byMonth[m]?.revenue ?? 0;
                const pct = chartMax > 0 ? (rev / chartMax) * 100 : 0;
                return (
                  <BarGroup key={m}>
                    <BarTooltip>{rev.toLocaleString()}원</BarTooltip>
                    <BarWrap><Bar $pct={pct} /></BarWrap>
                    <BarLabel>{m.slice(5)}월</BarLabel>
                  </BarGroup>
                );
              })}
            </ChartArea>
          )}
        </Card>

        {/* 스테이별 매출 */}
        <Card>
          <CardTitle>매출 상위 스테이</CardTitle>
          {loading ? (
            <ChartLoading>로딩 중...</ChartLoading>
          ) : topStays.length === 0 ? (
            <ChartLoading>데이터 없음</ChartLoading>
          ) : (
            <TopList>
              {topStays.map((s, i) => {
                const pct = maxRevenue > 0 ? (s.revenue / maxRevenue) * 100 : 0;
                return (
                  <TopItem key={i}>
                    <RankBadge $top={i === 0}>{i + 1}</RankBadge>
                    <TopInfo>
                      <TopName>{s.stayName}</TopName>
                      {s.spaceName && <TopSpace>{s.spaceName}</TopSpace>}
                      <TopBar><TopBarFill $pct={pct} /></TopBar>
                    </TopInfo>
                    <TopRevenue>
                      <RevenueAmt>{s.revenue.toLocaleString()}원</RevenueAmt>
                      <RevenueCount>{s.count}건</RevenueCount>
                    </TopRevenue>
                  </TopItem>
                );
              })}
            </TopList>
          )}
        </Card>
      </BottomGrid>

      {/* 매출 내역 테이블 */}
      <Card>
        <TableHeaderRow>
          <CardTitle style={{ marginBottom: 0 }}>예약 내역</CardTitle>
          <FilterSelect value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            {tableMonths.map((m) => (
              <option key={m} value={m}>{m === 'ALL' ? '전체 기간' : `${m.slice(5)}월`}</option>
            ))}
          </FilterSelect>
        </TableHeaderRow>

        <Table>
          <colgroup>
            <col width="70" />
            <col />
            <col width="90" />
            <col width="100" />
            <col width="100" />
            <col width="50" />
            <col width="120" />
            <col width="90" />
          </colgroup>
          <thead>
            <tr>
              {['예약번호', '공간 / 스테이', '예약자', '체크인', '체크아웃', '박', '결제금액', '상태'].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={8}><Empty>로딩 중...</Empty></Td></tr>
            ) : filteredRecords.length === 0 ? (
              <tr><Td colSpan={8}><Empty>해당 기간 내역이 없습니다</Empty></Td></tr>
            ) : (
              filteredRecords.map((r) => {
                const nights = r.checkinDate && r.checkoutDate
                  ? Math.max(
                      Math.round((new Date(r.checkoutDate) - new Date(r.checkinDate)) / (1000 * 60 * 60 * 24)),
                      0
                    )
                  : '-';
                return (
                  <tr key={r.id}>
                    <Td><IdText>#{r.id}</IdText></Td>
                    <Td>
                      <SpaceCell>
                        {r.spaceName && <SpaceNameSm>{r.spaceName}</SpaceNameSm>}
                        <StayNameSm>{r.stayName ?? `숙소 #${r.stayId}`}</StayNameSm>
                      </SpaceCell>
                    </Td>
                    <Td>{r.primaryGuestName}</Td>
                    <Td>{r.checkinDate}</Td>
                    <Td>{r.checkoutDate}</Td>
                    <Td>{nights}</Td>
                    <Td>
                      <AmtText $cancelled={['USER_CANCELLED', 'SELLER_CANCELLED', 'REFUND_COMPLETED'].includes(r.status)}>
                        {fmt(r.totalPrice)}
                      </AmtText>
                    </Td>
                    <Td>
                      <StatusBadge $color={STATUS_COLOR[r.status]} $bg={STATUS_BG[r.status]}>
                        {r.statusLabel ?? r.status}
                      </StatusBadge>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Card>
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 24px;`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.4px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FetchTime = styled.span`font-size: 12px; color: ${({ theme }) => theme.colors.textLight};`;

const RefreshBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  background: white;
  font-family: inherit;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  &:hover:not(:disabled) { border-color: ${ACCENT}; color: ${ACCENT}; }
`;

const ErrorBar = styled.p`
  padding: 12px 16px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 13px;
  border-radius: 8px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const SummaryCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const IconBg = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
`;

const SummaryLabel = styled.p`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const SummaryValue = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const SummaryNote = styled.p`
  font-size: 12px;
  color: ${({ $positive, theme }) =>
    $positive === undefined ? theme.colors.textMuted :
    $positive ? '#15803d' : '#dc2626'};
  font-weight: ${({ $positive }) => ($positive !== undefined ? '600' : '400')};
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 16px;
`;

const ChartLoading = styled.div`
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ChartArea = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 160px;
  padding: 0 8px;
`;

const BarGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  &:hover > div:first-child { opacity: 1; }
`;

const BarTooltip = styled.div`
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
  z-index: 1;
`;

const BarWrap = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
`;

const Bar = styled.div`
  width: 100%;
  height: ${({ $pct }) => Math.max($pct, 4)}%;
  background: ${ACCENT};
  border-radius: 4px 4px 0 0;
  opacity: 0.85;
  transition: opacity 0.15s;
  &:hover { opacity: 1; }
`;

const BarLabel = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TopList = styled.div`display: flex; flex-direction: column; gap: 12px;`;

const TopItem = styled.div`display: flex; align-items: center; gap: 10px;`;

const RankBadge = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${({ $top }) => ($top ? ACCENT : '#f1f5f9')};
  color: ${({ $top }) => ($top ? 'white' : '#64748b')};
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const TopInfo = styled.div`flex: 1; display: flex; flex-direction: column; gap: 3px;`;

const TopName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const TopSpace = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textMuted};`;

const TopBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 999px;
  overflow: hidden;
  margin-top: 2px;
`;

const TopBarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${ACCENT};
  border-radius: 999px;
`;

const TopRevenue = styled.div`text-align: right; display: flex; flex-direction: column; gap: 2px; flex-shrink: 0;`;

const RevenueAmt = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const RevenueCount = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textMuted};`;

const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const FilterSelect = styled.select`
  height: 34px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  cursor: pointer;
`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 11px 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  vertical-align: middle;
`;

const Empty = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const IdText = styled.span`
  font-family: 'Plus Jakarta Sans', monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SpaceCell = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const SpaceNameSm = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textLight};`;
const StayNameSm = styled.p`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.adminTextDark};`;

const AmtText = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-weight: 600;
  color: ${({ $cancelled, theme }) => ($cancelled ? theme.colors.textLight : theme.colors.adminTextDark)};
  text-decoration: ${({ $cancelled }) => ($cancelled ? 'line-through' : 'none')};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
  white-space: nowrap;
`;
