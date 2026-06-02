import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  CalendarDays, Search, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, RefreshCw, X, List, Calendar
} from 'lucide-react';
import { reservationApi } from '../api/reservationApi';
import SellerCalendar from '../components/common/SellerCalendar';

const ACCENT = '#3ec9a7';

const STATUS_COLOR = {
  PENDING:           '#64748b',
  PAYMENT_COMPLETED: '#c2410c',
  RESERVED:          '#15803d',
  USER_CANCELLED:    '#dc2626',
  SELLER_CANCELLED:  '#dc2626',
  REFUND_COMPLETED:  '#7c3aed',
  COMPLETED:         '#0369a1',
};
const STATUS_BG = {
  PENDING:           '#f1f5f9',
  PAYMENT_COMPLETED: '#ffedd5',
  RESERVED:          '#dcfce7',
  USER_CANCELLED:    '#fee2e2',
  SELLER_CANCELLED:  '#fee2e2',
  REFUND_COMPLETED:  '#ede9fe',
  COMPLETED:         '#e0f2fe',
};

const fmt = (n) => (n ? Number(n).toLocaleString() + '원' : '-');

export default function ReservationPage() {
  const [list, setList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pno, setPno] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 필터
  const [filterResvId, setFilterResvId] = useState('');
  const [filterGuest, setFilterGuest] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 액션
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  // 상세 모달
  const [detailOpen, setDetailOpen] = useState(null);

  // 뷰 모드
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [calDayDetail, setCalDayDetail] = useState(null); // { date, events }

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchList = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = { pno: page };
      if (filterResvId) params.reservationId = Number(filterResvId);
      if (filterGuest.trim()) params.guestName = filterGuest.trim();
      if (filterDate) params.checkinDate = filterDate;
      // status는 백엔드 미지원 → client-side 처리

      const res = await reservationApi.getList(params);
      const data = res.data;
      setList(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setPno(page);
    } catch (e) {
      setError(e.response?.data?.message ?? '예약 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [filterResvId, filterGuest, filterDate]);

  useEffect(() => { fetchList(0); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchList(0);
  };

  const handleReset = () => {
    setFilterResvId('');
    setFilterGuest('');
    setFilterDate('');
    setFilterStatus('');
    setTimeout(() => fetchList(0), 0);
  };

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve');
    try {
      await reservationApi.approve(id);
      showToast('예약이 승인되었습니다.');
      fetchList(pno);
    } catch (e) {
      showToast(e.response?.data?.message ?? '승인에 실패했습니다.', false);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('이 예약을 거절(취소)하시겠습니까?')) return;
    setActionLoading(id + '_cancel');
    try {
      await reservationApi.cancel(id);
      showToast('예약이 거절되었습니다.');
      fetchList(pno);
    } catch (e) {
      showToast(e.response?.data?.message ?? '거절에 실패했습니다.', false);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Wrap>
      {toast && (
        <Toast $ok={toast.ok}>
          {toast.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {toast.msg}
        </Toast>
      )}

      <PageHeader>
        <TitleGroup>
          <PageTitle>예약 관리</PageTitle>
          <PageSub>공간 및 스테이 예약 내역을 관리합니다 — 총 {totalElements}건</PageSub>
        </TitleGroup>
        <HeaderRight>
          <ViewToggle>
            <ViewBtn $active={viewMode === 'table'} onClick={() => setViewMode('table')}>
              <List size={14} />목록
            </ViewBtn>
            <ViewBtn $active={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}>
              <Calendar size={14} />달력
            </ViewBtn>
          </ViewToggle>
          <RefreshBtn onClick={() => fetchList(pno)} title="새로고침">
            <RefreshCw size={15} />
          </RefreshBtn>
        </HeaderRight>
      </PageHeader>

      {/* 검색 필터 */}
      <FilterForm onSubmit={handleSearch}>
        <FilterInput
          type="number"
          value={filterResvId}
          onChange={(e) => setFilterResvId(e.target.value)}
          placeholder="예약번호"
          min="1"
          style={{ width: 110 }}
        />
        <FilterInput
          type="text"
          value={filterGuest}
          onChange={(e) => setFilterGuest(e.target.value)}
          placeholder="예약자명"
          style={{ width: 120 }}
        />
        <FilterInput
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ width: 140 }}
        />
        <StatusSelect
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">전체 상태</option>
          <option value="PENDING">예약 대기</option>
          <option value="PAYMENT_COMPLETED">결제 완료</option>
          <option value="RESERVED">예약 확정</option>
          <option value="COMPLETED">이용 완료</option>
          <option value="USER_CANCELLED">사용자 취소</option>
          <option value="SELLER_CANCELLED">판매자 취소</option>
          <option value="REFUND_COMPLETED">환불 완료</option>
        </StatusSelect>
        <SearchBtn type="submit">
          <Search size={14} />검색
        </SearchBtn>
        <ResetBtn type="button" onClick={handleReset}>초기화</ResetBtn>
      </FilterForm>

      {/* 캘린더 뷰 */}
      {viewMode === 'calendar' && (
        <CalendarWrap $hasPanel={!!calDayDetail}>
          <SellerCalendar
            events={list.map((r) => ({
              date: r.checkinDate,
              label: `${r.primaryGuestName} · ${r.stayName ?? '숙소'}`,
              color: STATUS_COLOR[r.status],
              bg: STATUS_BG[r.status],
              cancelled: ['USER_CANCELLED', 'SELLER_CANCELLED', 'REFUND_COMPLETED'].includes(r.status),
              tooltip: {
                id: r.id,
                name: r.primaryGuestName,
                space: r.spaceName,
                stay: r.stayName,
                checkin: r.checkinDate,
                checkout: r.checkoutDate,
                amount: r.totalPrice,
                status: r.statusLabel ?? r.status,
              },
            }))}
            onDayClick={(dateStr, evs) => setCalDayDetail(evs.length > 0 ? { date: dateStr, events: evs } : null)}
          />
          {calDayDetail && (
            <CalDayPanel>
              <CalDayTitle>{calDayDetail.date} 예약 {calDayDetail.events.length}건</CalDayTitle>
              {calDayDetail.events.map((ev, i) => (
                <CalDayItem key={i}>
                  <EventDot style={{ background: ev.color }} />
                  {ev.label}
                </CalDayItem>
              ))}
            </CalDayPanel>
          )}
        </CalendarWrap>
      )}

      {/* 테이블 */}
      {viewMode === 'table' && <Card>
        {loading ? (
          <LoadArea>불러오는 중...</LoadArea>
        ) : error ? (
          <LoadArea $error>{error}</LoadArea>
        ) : (
          <>
            <Table>
              <colgroup>
                <col width="70" />
                <col />
                <col width="90" />
                <col width="100" />
                <col width="100" />
                <col width="50" />
                <col width="120" />
                <col width="100" />
                <col width="130" />
              </colgroup>
              <thead>
                <tr>
                  {['예약번호', '숙소', '예약자', '체크인', '체크아웃', '인원', '결제금액', '상태', '액션'].map((h) => (
                    <Th key={h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <Td colSpan={9}>
                      <Empty>
                        <CalendarDays size={36} color="#cbd5e1" />
                        <span>예약 내역이 없습니다</span>
                      </Empty>
                    </Td>
                  </tr>
                ) : (
                  list
                  .filter((r) => !filterStatus || r.status === filterStatus)
                  .map((r) => (
                    <tr key={r.id}>
                      <Td>
                        <IdBtn onClick={() => setDetailOpen(r)}>#{r.id}</IdBtn>
                      </Td>
                      <Td>
                        <StayCell>
                          {r.spaceName && <SpaceName>{r.spaceName}</SpaceName>}
                          <StayName>{r.stayName ?? `숙소 #${r.stayId}`}</StayName>
                        </StayCell>
                      </Td>
                      <Td>
                        <GuestCell>
                          <GuestName>{r.primaryGuestName}</GuestName>
                          <GuestId>{r.username}</GuestId>
                        </GuestCell>
                      </Td>
                      <Td>{r.checkinDate}</Td>
                      <Td>{r.checkoutDate}</Td>
                      <Td>{r.guestCount}명</Td>
                      <Td><PriceText>{fmt(r.totalPrice)}</PriceText></Td>
                      <Td>
                        <StatusBadge $color={STATUS_COLOR[r.status]} $bg={STATUS_BG[r.status]}>
                          {r.statusLabel ?? r.status}
                        </StatusBadge>
                      </Td>
                      <Td>
                        {r.status === 'PAYMENT_COMPLETED' ? (
                          <ActionRow>
                            <ApproveBtn
                              onClick={() => handleApprove(r.id)}
                              disabled={actionLoading === r.id + '_approve'}
                              title="예약 승인"
                            >
                              <CheckCircle size={13} />
                              {actionLoading === r.id + '_approve' ? '...' : '승인'}
                            </ApproveBtn>
                            <RejectBtn
                              onClick={() => handleCancel(r.id)}
                              disabled={actionLoading === r.id + '_cancel'}
                              title="예약 거절"
                            >
                              <XCircle size={13} />
                              {actionLoading === r.id + '_cancel' ? '...' : '거절'}
                            </RejectBtn>
                          </ActionRow>
                        ) : (
                          <NoAction>-</NoAction>
                        )}
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {/* 페이지네이션 — 최대 10개씩 */}
            {totalPages > 1 && (() => {
              const groupStart = Math.floor(pno / 10) * 10;
              const groupEnd   = Math.min(groupStart + 10, totalPages);
              return (
                <Pagination>
                  <PageBtn onClick={() => fetchList(pno - 1)} disabled={pno === 0}>
                    <ChevronLeft size={14} />
                  </PageBtn>
                  {groupStart > 0 && (
                    <PageBtn onClick={() => fetchList(groupStart - 1)}>···</PageBtn>
                  )}
                  {Array.from({ length: groupEnd - groupStart }, (_, i) => {
                    const idx = groupStart + i;
                    return (
                      <PageBtn key={idx} $active={idx === pno} onClick={() => fetchList(idx)}>
                        {idx + 1}
                      </PageBtn>
                    );
                  })}
                  {groupEnd < totalPages && (
                    <PageBtn onClick={() => fetchList(groupEnd)}>···</PageBtn>
                  )}
                  <PageBtn onClick={() => fetchList(pno + 1)} disabled={pno >= totalPages - 1}>
                    <ChevronRight size={14} />
                  </PageBtn>
                </Pagination>
              );
            })()}
          </>
        )}
      </Card>}

      {/* 상세 모달 */}
      {detailOpen && (
        <ModalOverlay onClick={() => setDetailOpen(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>예약 #{detailOpen.id} 상세</ModalTitle>
              <CloseBtn onClick={() => setDetailOpen(null)}><X size={17} /></CloseBtn>
            </ModalHeader>
            <ModalBody>
              <DetailGrid>
                <DetailRow><DLabel>숙소</DLabel><DValue>{detailOpen.stayName ?? `#${detailOpen.stayId}`}</DValue></DetailRow>
                {detailOpen.spaceName && <DetailRow><DLabel>공간</DLabel><DValue>{detailOpen.spaceName}</DValue></DetailRow>}
                <DetailRow><DLabel>예약자</DLabel><DValue>{detailOpen.primaryGuestName} ({detailOpen.username})</DValue></DetailRow>
                <DetailRow><DLabel>연락처</DLabel><DValue>{detailOpen.primaryGuestPhone}</DValue></DetailRow>
                <DetailRow><DLabel>이메일</DLabel><DValue>{detailOpen.primaryGuestEmail}</DValue></DetailRow>
                <DetailRow><DLabel>체크인</DLabel><DValue>{detailOpen.checkinDate}</DValue></DetailRow>
                <DetailRow><DLabel>체크아웃</DLabel><DValue>{detailOpen.checkoutDate}</DValue></DetailRow>
                <DetailRow><DLabel>인원</DLabel><DValue>{detailOpen.guestCount}명</DValue></DetailRow>
                <DetailRow><DLabel>결제금액</DLabel><DValue><PriceText>{fmt(detailOpen.totalPrice)}</PriceText></DValue></DetailRow>
                <DetailRow><DLabel>상태</DLabel>
                  <DValue>
                    <StatusBadge $color={STATUS_COLOR[detailOpen.status]} $bg={STATUS_BG[detailOpen.status]}>
                      {detailOpen.statusLabel ?? detailOpen.status}
                    </StatusBadge>
                  </DValue>
                </DetailRow>
                <DetailRow><DLabel>예약일시</DLabel><DValue>{detailOpen.createdAt?.slice(0, 16).replace('T', ' ')}</DValue></DetailRow>
                {detailOpen.refundBankName && (
                  <DetailRow>
                    <DLabel>환불 계좌</DLabel>
                    <DValue>{detailOpen.refundBankName} {detailOpen.refundAccountNumber} ({detailOpen.refundAccountHolder})</DValue>
                  </DetailRow>
                )}
              </DetailGrid>
            </ModalBody>
            <ModalFooter>
              {detailOpen.status === 'PAYMENT_COMPLETED' && (
                <>
                  <ApproveBtn onClick={() => { handleApprove(detailOpen.id); setDetailOpen(null); }}>
                    <CheckCircle size={13} />승인
                  </ApproveBtn>
                  <RejectBtn onClick={() => { handleCancel(detailOpen.id); setDetailOpen(null); }}>
                    <XCircle size={13} />거절
                  </RejectBtn>
                </>
              )}
              <CloseTextBtn onClick={() => setDetailOpen(null)}>닫기</CloseTextBtn>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 20px;`;

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ $ok }) => ($ok ? '#1e293b' : '#b91c1c')};
  color: white;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 9999;
`;

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

const HeaderRight = styled.div`display: flex; align-items: center; gap: 10px;`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const ViewBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 0 14px; height: 34px;
  font-size: 13px; font-weight: 500; font-family: inherit;
  cursor: pointer;
  background: ${({ $active }) => $active ? ACCENT : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'};
  border: none;
  transition: all 0.15s;
  &:hover { background: ${({ $active }) => $active ? ACCENT : '#f1f5f9'}; }
`;

const CalendarWrap = styled.div`
  display: grid;
  grid-template-columns: ${({ $hasPanel }) => $hasPanel ? '1fr 280px' : '1fr'};
  gap: 0;
  align-items: start;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CalDayPanel = styled.div`
  padding: 20px;
  border-left: 1px solid ${({ theme }) => theme.colors.borderLight};
  min-height: 200px;
`;

const CalDayTitle = styled.p`
  font-size: 13px; font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 12px;
`;

const CalDayItem = styled.div`
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: ${({ theme }) => theme.colors.textMid};
  padding: 5px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const EventDot = styled.div`
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
`;

const RefreshBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  background: white;
  transition: all 0.15s;
  &:hover { color: ${ACCENT}; border-color: ${ACCENT}; }
`;

const FilterForm = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  background: white;
  &:focus { outline: none; border-color: ${ACCENT}; }
`;

const StatusSelect = styled.select`
  height: 38px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  background: white;
  cursor: pointer;
  &:focus { outline: none; border-color: ${ACCENT}; }
`;

const SearchBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  background: ${ACCENT};
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #31b08e; }
`;

const ResetBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: white;
  font-family: inherit;
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const LoadArea = styled.div`
  padding: 60px;
  text-align: center;
  font-size: 14px;
  color: ${({ $error, theme }) => ($error ? '#b91c1c' : theme.colors.textMuted)};
`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
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
  padding: 12px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  vertical-align: middle;
`;

const IdBtn = styled.button`
  font-size: 12px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', monospace;
  color: ${ACCENT};
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const StayCell = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const SpaceName = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textLight};`;
const StayName = styled.p`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.adminTextDark};`;

const GuestCell = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const GuestName = styled.p`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.adminTextDark};`;
const GuestId = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textLight};`;

const PriceText = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
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

const ActionRow = styled.div`display: flex; gap: 5px;`;

const ApproveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-family: inherit;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  &:hover:not(:disabled) { background: #bbf7d0; }
`;

const RejectBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-family: inherit;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  &:hover:not(:disabled) { background: #fecaca; }
`;

const NoAction = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Empty = styled.div`
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PageBtn = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  background: ${({ $active }) => ($active ? ACCENT : 'white')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.textMid)};
  border: 1px solid ${({ $active }) => ($active ? ACCENT : '#e2e8f0')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: all 0.15s;
  &:hover:not(:disabled) { border-color: ${ACCENT}; color: ${ACCENT}; }
`;

/* 모달 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  width: 520px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const CloseBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
`;

const ModalBody = styled.div`padding: 20px 24px;`;

const DetailGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 9px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child { border-bottom: none; }
`;

const DLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 80px;
  flex-shrink: 0;
`;

const DValue = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  text-align: right;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const CloseTextBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  background: white;
  cursor: pointer;
  font-family: inherit;
`;
