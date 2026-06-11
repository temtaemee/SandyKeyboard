import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { DollarSign, TrendingUp, BarChart2, RefreshCw, List, Calendar } from 'lucide-react';
import { salesApi } from '../api/salesApi';
import SellerCalendar from '../components/common/SellerCalendar';
import SellerPagination from '../components/common/SellerPagination';

const ACCENT = '#3ec9a7';
const fmt = (n) => Number(n || 0).toLocaleString() + '원';

function getYM(dtStr) {
  return dtStr ? String(dtStr).slice(0, 7) : null;
}

export default function SalesPage() {
  const [summary, setSummary]   = useState(null);
  const [list, setList]         = useState([]);
  const [chartBase, setChartBase] = useState([]); // 차트 전용 — 페이지 이동해도 고정
  const [totalPages, setTotalPages] = useState(0);
  const [pno, setPno]           = useState(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  // 날짜 범위 필터 (client-side, salesDate 기준)
  const todayStr      = new Date().toISOString().slice(0, 10);
  const thisMonthStart = todayStr.slice(0, 7) + '-01';
  const [fromDate, setFromDate] = useState(thisMonthStart);
  const [toDate, setToDate]     = useState(todayStr);
  const [activeQuick, setActiveQuick] = useState('this');

  const setQuick = (key) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const y = now.getFullYear(), m = now.getMonth();
    if (key === 'this') {
      setFromDate(`${y}-${pad(m + 1)}-01`);
      setToDate(now.toISOString().slice(0, 10));
    } else if (key === 'prev') {
      const pm = new Date(y, m - 1, 1);
      const last = new Date(y, m, 0).getDate();
      setFromDate(`${pm.getFullYear()}-${pad(pm.getMonth() + 1)}-01`);
      setToDate(`${pm.getFullYear()}-${pad(pm.getMonth() + 1)}-${last}`);
    } else if (key === '3m') {
      const d = new Date(y, m - 2, 1);
      setFromDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`);
      setToDate(now.toISOString().slice(0, 10));
    } else {
      setFromDate(''); setToDate('');
    }
    setActiveQuick(key);
  };

  const loadSummary = async () => {
    try {
      const res = await salesApi.getSummary();
      setSummary(res.data);
    } catch { setSummary(null); }
  };

  const loadList = useCallback(async (page = 0) => {
    setLoading(true); setError(null);
    try {
      const res = await salesApi.getList(page);
      const data = res.data;
      setList(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setPno(page);
    } catch (e) {
      setError(e.response?.data?.message ?? '매출 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 차트용 전체 데이터 — 최초 1회만 모든 페이지 로드
  const loadAllForChart = useCallback(async () => {
    try {
      const res0 = await salesApi.getList(0);
      const data0 = res0.data;
      const totalPgs = data0.totalPages ?? 0;
      const all = [...(data0.content ?? [])];
      if (totalPgs > 1) {
        const rest = await Promise.all(
          Array.from({ length: totalPgs - 1 }, (_, i) => salesApi.getList(i + 1))
        );
        rest.forEach(r => all.push(...(r.data?.content ?? [])));
      }
      setChartBase(all);
    } catch {}
  }, []);

  const load = async () => {
    setFetchedAt(new Date().toLocaleTimeString());
    await Promise.all([loadSummary(), loadList(0)]);
    loadAllForChart(); // 차트 데이터는 백그라운드로 전체 로드
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { setPno(0); }, [fromDate, toDate]);

  // client-side 날짜 범위 필터 (salesDate 기준) — chartBase(전체 데이터) 기준으로 필터
  const inRange = (dtStr) => {
    if (!dtStr) return true;
    const d = String(dtStr).slice(0, 10);
    if (fromDate && d < fromDate) return false;
    if (toDate   && d > toDate)   return false;
    return true;
  };
  const filteredAll = chartBase.filter((s) => inRange(s.salesDate));
  const PAGE_SIZE = 10;
  const clientTotalPages = Math.ceil(filteredAll.length / PAGE_SIZE);
  const filtered = filteredAll.slice(pno * PAGE_SIZE, (pno + 1) * PAGE_SIZE);

  // 월별 차트 — chartBase 기준 (페이지 이동 시 변하지 않음)
  const byMonth = chartBase.reduce((acc, s) => {
    const m = getYM(s.salesDate);
    if (!m) return acc;
    if (!acc[m]) acc[m] = { net: 0, count: 0 };
    acc[m].net   += Number(s.netSalesAmount || 0);
    acc[m].count += 1;
    return acc;
  }, {});
  const last6Months = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
  })();
  const chartMax = Math.max(...last6Months.map((m) => byMonth[m]?.net ?? 0), 1);

  const rangeLabel = fromDate && toDate
    ? `${fromDate} ~ ${toDate}`
    : fromDate ? `${fromDate} ~` : toDate ? `~ ${toDate}` : '전체 기간';

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>매출 관리</PageTitle>
          <PageSub>공간 및 스테이 실시간 매출 현황 {fetchedAt && <FetchTime>— {fetchedAt} 기준</FetchTime>}</PageSub>
        </TitleGroup>
        <HeaderRight>
          <ViewToggle>
            <ViewBtn $active={viewMode === 'table'} onClick={() => setViewMode('table')}><List size={13} />목록</ViewBtn>
            <ViewBtn $active={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}><Calendar size={13} />달력</ViewBtn>
          </ViewToggle>
          <RefreshBtn onClick={load} disabled={loading}><RefreshCw size={14} />새로고침</RefreshBtn>
        </HeaderRight>
      </PageHeader>

      {error && <ErrorBar>{error}</ErrorBar>}

      {/* 날짜 범위 필터 */}
      <DateFilterBar>
        <QuickBtns>
          {[['this','이번달'],['prev','저번달'],['3m','최근 3개월'],['all','전체']].map(([k,l]) => (
            <QuickBtn key={k} $active={activeQuick === k} onClick={() => setQuick(k)}>{l}</QuickBtn>
          ))}
        </QuickBtns>
        <DateRangeGroup>
          <DateInput type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setActiveQuick('custom'); }} />
          <DateSep>~</DateSep>
          <DateInput type="date" value={toDate}   onChange={(e) => { setToDate(e.target.value);   setActiveQuick('custom'); }} />
        </DateRangeGroup>
        <RangeLabel>{rangeLabel} · {filteredAll.length}건</RangeLabel>
      </DateFilterBar>

      {/* 요약 카드 — API 전체 데이터 기준 */}
      <SummaryGrid>
        <SummaryCard>
          <IconBg $color="#dcfce7"><DollarSign size={20} color="#15803d" /></IconBg>
          <SummaryLabel>총 매출 (누적)</SummaryLabel>
          <SummaryValue>{fmt(summary?.totalSales)}</SummaryValue>
          <SummaryNote>전체 결제 발생 금액</SummaryNote>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#fee2e2"><TrendingUp size={20} color="#dc2626" /></IconBg>
          <SummaryLabel>총 취소액 (누적)</SummaryLabel>
          <SummaryValue>{fmt(summary?.totalCancel)}</SummaryValue>
          <SummaryNote>환불 처리된 금액</SummaryNote>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#dbeafe"><BarChart2 size={20} color="#1d4ed8" /></IconBg>
          <SummaryLabel>순 매출 (누적)</SummaryLabel>
          <SummaryValue>{fmt(summary?.totalNetSales)}</SummaryValue>
          <SummaryNote>취소 차감 후 실매출</SummaryNote>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ede9fe"><BarChart2 size={20} color="#7c3aed" /></IconBg>
          <SummaryLabel>선택 기간 순매출</SummaryLabel>
          <SummaryValue>{fmt(filteredAll.reduce((s,r)=>s+Number(r.netSalesAmount||0),0))}</SummaryValue>
          <SummaryNote>{rangeLabel}</SummaryNote>
        </SummaryCard>
      </SummaryGrid>

      {/* 달력 뷰 */}
      {viewMode === 'calendar' && (
        <CalCard>
          <SellerCalendar
            events={filteredAll.map((s) => ({
              date: s.salesDate?.slice(0, 10),
              label: `${Number(s.netSalesAmount||0).toLocaleString()}원`,
              color: s.cancelAmount > 0 ? '#dc2626' : '#15803d',
              bg:    s.cancelAmount > 0 ? '#fee2e2' : '#dcfce7',
              cancelled: s.netSalesAmount === 0,
              tooltip: {
                id: s.salesId,
                space: s.spaceName,
                stay: s.stayName,
                amount: s.salesAmount,
                status: s.cancelAmount > 0 ? `취소 ${fmt(s.cancelAmount)}` : '정상',
              },
            })).filter((e) => e.date)}
          />
        </CalCard>
      )}

      {/* 목록 뷰 */}
      {viewMode === 'table' && (
        <>
          {/* 월별 차트 */}
          <Card>
            <CardTitle>월별 순매출 추이 (최근 6개월)</CardTitle>
            <ChartArea>
              {last6Months.map((m) => {
                const net = byMonth[m]?.net ?? 0;
                const pct = chartMax > 0 ? (net / chartMax) * 100 : 0;
                const label = net >= 100000000
                  ? `${(net / 100000000).toFixed(1)}억`
                  : net >= 10000
                  ? `${Math.round(net / 10000)}만`
                  : net > 0 ? net.toLocaleString() : '';
                return (
                  <BarGroup key={m}>
                    <BarAmount $empty={net === 0}>{label}</BarAmount>
                    <BarWrap>
                      <Bar $pct={pct} $empty={net === 0} title={net > 0 ? net.toLocaleString() + '원' : '-'} />
                    </BarWrap>
                    <BarLabel>{m.slice(5)}월</BarLabel>
                  </BarGroup>
                );
              })}
            </ChartArea>
          </Card>

          {/* 매출 내역 테이블 */}
          <Card>
            <TableHeaderRow>
              <CardTitle style={{ marginBottom: 0 }}>매출 내역</CardTitle>
            </TableHeaderRow>
            <Table>
              <colgroup>
                <col width="70" /><col /><col /><col width="130" />
                <col width="130" /><col width="120" /><col width="100" />
              </colgroup>
              <thead>
                <tr>
                  {['#','공간','스테이','매출금액','취소금액','순매출','일자'].map((h) => (
                    <Th key={h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><Td colSpan={7}><Empty>로딩 중...</Empty></Td></tr>
                ) : filteredAll.length === 0 ? (
                  <tr><Td colSpan={7}><Empty>해당 기간 매출 내역이 없습니다</Empty></Td></tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.salesId}>
                      <Td><IdText>#{s.salesId}</IdText></Td>
                      <Td>{s.spaceName ?? '-'}</Td>
                      <Td>{s.stayName ?? '-'}</Td>
                      <Td><AmtText>{fmt(s.salesAmount)}</AmtText></Td>
                      <Td>
                        {s.cancelAmount > 0
                          ? <CancelText>-{fmt(s.cancelAmount)}</CancelText>
                          : <span style={{color:'#94a3b8'}}>-</span>}
                      </Td>
                      <Td><NetText $cancelled={s.netSalesAmount === 0}>{fmt(s.netSalesAmount)}</NetText></Td>
                      <Td>{s.salesDate?.slice(0, 10) ?? '-'}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <SellerPagination pno={pno} total={clientTotalPages} onPage={(p) => setPno(p)} />
          </Card>
        </>
      )}
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 24px;`;

const PageHeader = styled.div`display: flex; align-items: flex-start; justify-content: space-between;`;
const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const PageTitle  = styled.h1`font-size: 24px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark}; letter-spacing: -0.4px;`;
const PageSub    = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;
const FetchTime  = styled.span`font-size: 12px; color: ${({ theme }) => theme.colors.textLight};`;

const HeaderRight = styled.div`display: flex; align-items: center; gap: 10px;`;

const ViewToggle = styled.div`display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;`;
const ViewBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 0 14px; height: 34px; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer;
  background: ${({ $active }) => $active ? ACCENT : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'}; border: none; transition: all 0.15s;
  &:hover { background: ${({ $active }) => $active ? ACCENT : '#f1f5f9'}; }
`;

const RefreshBtn = styled.button`
  display: flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border}; font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid}; background: white; font-family: inherit;
  cursor: pointer; opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  &:hover:not(:disabled) { border-color: ${ACCENT}; color: ${ACCENT}; }
`;

const ErrorBar = styled.p`padding: 12px 16px; background: #fee2e2; color: #b91c1c; font-size: 13px; border-radius: 8px;`;

const DateFilterBar = styled.div`
  display: flex; align-items: center; gap: 16px; padding: 14px 20px;
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; box-shadow: ${({ theme }) => theme.shadows.card}; flex-wrap: wrap;
`;
const QuickBtns = styled.div`display: flex; gap: 6px;`;
const QuickBtn = styled.button`
  height: 32px; padding: 0 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
  font-family: inherit; cursor: pointer;
  border: 1px solid ${({ $active }) => $active ? ACCENT : '#e2e8f0'};
  background: ${({ $active }) => $active ? ACCENT : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'}; transition: all 0.15s;
  &:hover { border-color: ${ACCENT}; }
`;
const DateRangeGroup = styled.div`display: flex; align-items: center; gap: 8px;`;
const DateInput = styled.input`
  height: 34px; padding: 0 10px; border-radius: 8px; border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px; font-family: inherit; color: ${({ theme }) => theme.colors.adminTextDark}; background: white;
  &:focus { outline: none; border-color: ${ACCENT}; }
`;
const DateSep = styled.span`font-size: 14px; color: #94a3b8;`;
const RangeLabel = styled.span`font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; margin-left: auto;`;

const SummaryGrid = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;`;
const SummaryCard = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px;
  padding: 20px; display: flex; flex-direction: column; gap: 6px; box-shadow: ${({ theme }) => theme.shadows.card};
`;
const IconBg = styled.div`
  width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  background: ${({ $color }) => $color};
`;
const SummaryLabel = styled.p`font-size: 12px; font-weight: 500; color: ${({ theme }) => theme.colors.textMuted}; padding-top: 8px;`;
const SummaryValue = styled.p`font-size: 22px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark}; letter-spacing: -0.4px;`;
const SummaryNote  = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textLight};`;

const CalCard = styled.div`
  background: white; border: 1px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden;
`;

const Card = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card}; overflow: hidden;
`;
const CardTitle = styled.h2`font-size: 16px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark}; margin-bottom: 16px; padding: 20px 20px 0;`;
const TableHeaderRow = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 0;`;

const ChartArea = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 20px;
  padding: 20px 32px 16px;
  height: 180px;
`;
const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 52px;
  height: 100%;
  flex-shrink: 0;
`;
const BarAmount = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $empty }) => $empty ? '#cbd5e1' : '#0f172a'};
  white-space: nowrap;
  min-height: 16px;
`;
const BarWrap = styled.div`flex: 1; width: 100%; display: flex; align-items: flex-end;`;
const Bar = styled.div`
  width: 100%;
  height: ${({ $pct, $empty }) => $empty ? '3px' : `${Math.max($pct, 4)}%`};
  background: ${({ $empty }) => $empty ? '#e2e8f0' : ACCENT};
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
`;
const BarLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`
  text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted}; text-transform: uppercase; letter-spacing: 0.4px;
  background: ${({ theme }) => theme.colors.bgSection}; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const Td = styled.td`
  padding: 12px 14px; font-size: 13px; color: ${({ theme }) => theme.colors.textMid};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight}; vertical-align: middle;
`;
const IdText     = styled.span`font-size: 12px; font-weight: 600; color: ${ACCENT};`;
const AmtText    = styled.span`font-weight: 600; color: ${({ theme }) => theme.colors.adminTextDark};`;
const CancelText = styled.span`font-weight: 600; color: #dc2626;`;
const NetText    = styled.span`
  font-weight: 700;
  color: ${({ $cancelled }) => $cancelled ? '#94a3b8' : '#15803d'};
  text-decoration: ${({ $cancelled }) => $cancelled ? 'line-through' : 'none'};
`;
const Empty = styled.div`padding: 48px; text-align: center; font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};`;

