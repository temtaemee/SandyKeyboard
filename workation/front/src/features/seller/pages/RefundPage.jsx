import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { RefreshCw, X } from 'lucide-react';
import { sellerRefundApi } from '../api/refundApi';
import SellerPagination from '../components/common/SellerPagination';

const ACCENT = '#3ec9a7';
const fmt = (n) => Number(n || 0).toLocaleString() + '원';

const REASON_LABEL = {
  SIMPLE_CHANGE:   '단순 변심',
  SCHEDULE_CHANGE: '일정 변경',
  PRODUCT_CHANGE:  '상품 변경',
  METHOD_CHANGE:   '결제수단 변경',
};

export default function RefundPage() {
  const [list, setList]             = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pno, setPno]               = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [detail, setDetail]         = useState(null);

  const load = useCallback(async (page = 0) => {
    setLoading(true); setError(null);
    try {
      const res = await sellerRefundApi.getList(page);
      const data = res.data;
      setList(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setPno(page);
    } catch (e) {
      setError(e.response?.data?.message ?? '환불 내역을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(0); }, []);

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>환불 관리</PageTitle>
          <PageSub>내 공간 예약 환불 내역 — 총 {totalElements}건</PageSub>
        </TitleGroup>
        <RefreshBtn onClick={() => load(pno)} disabled={loading}>
          <RefreshCw size={14} />새로고침
        </RefreshBtn>
      </PageHeader>

      {error && <ErrorBar>{error}</ErrorBar>}

      <Card>
        <Table>
          <colgroup>
            <col width="70" /><col width="90" /><col /><col width="130" />
            <col width="130" /><col width="110" /><col width="80" />
          </colgroup>
          <thead>
            <tr>
              {['환불#', '예약#', '공간 / 스테이', '환불금액', '환불사유', '처리일시', '상세'].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={7}><Empty>불러오는 중...</Empty></Td></tr>
            ) : list.length === 0 ? (
              <tr><Td colSpan={7}><Empty>환불 내역이 없습니다</Empty></Td></tr>
            ) : list.map((r) => (
              <Tr key={r.refundId ?? r.id}>
                <Td><IdText>#{r.refundId ?? r.id}</IdText></Td>
                <Td><IdText>#{r.reservationId}</IdText></Td>
                <Td>
                  <StayCell>
                    <SpaceText>{r.spaceName ?? '-'}</SpaceText>
                    <StayText>{r.stayName ?? '-'}</StayText>
                  </StayCell>
                </Td>
                <Td><AmtText>{fmt(r.refundAmount)}</AmtText></Td>
                <Td>{REASON_LABEL[r.refundReason] ?? r.refundReason ?? '-'}</Td>
                <Td>{r.refundedAt?.slice(0, 16).replace('T', ' ') ?? '-'}</Td>
                <Td>
                  <DetailBtn onClick={() => setDetail(r)}>상세</DetailBtn>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        <SellerPagination pno={pno} total={totalPages} onPage={load} />
      </Card>

      {/* 상세 모달 */}
      {detail && (
        <ModalOverlay onClick={() => setDetail(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>환불 #{detail.refundId ?? detail.id} 상세</ModalTitle>
              <CloseBtn onClick={() => setDetail(null)}><X size={17} /></CloseBtn>
            </ModalHeader>
            <ModalBody>
              {[
                ['예약번호',  `#${detail.reservationId}`],
                ['공간',      detail.spaceName],
                ['스테이',    detail.stayName],
                ['환불금액',  fmt(detail.refundAmount)],
                ['환불사유',  REASON_LABEL[detail.refundReason] ?? detail.refundReason],
                ['처리일시',  detail.refundedAt?.slice(0, 16).replace('T', ' ')],
                ['트랜잭션키', detail.transactionKey],
              ].map(([k, v]) => (
                <DRow key={k}>
                  <DKey>{k}</DKey>
                  <DVal>{v ?? '-'}</DVal>
                </DRow>
              ))}
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 20px;`;
const PageHeader = styled.div`display: flex; align-items: flex-start; justify-content: space-between;`;
const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const PageTitle  = styled.h1`font-size: 24px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark}; letter-spacing: -0.4px;`;
const PageSub    = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;
const RefreshBtn = styled.button`
  display: flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border}; font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid}; background: white; font-family: inherit;
  cursor: pointer; opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  &:hover:not(:disabled) { border-color: ${ACCENT}; color: ${ACCENT}; }
`;
const ErrorBar = styled.p`padding: 12px 16px; background: #fee2e2; color: #b91c1c; font-size: 13px; border-radius: 8px;`;

const Card = styled.div`background: white; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 12px; box-shadow: ${({ theme }) => theme.shadows.card}; overflow: hidden;`;
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600; color: ${({ theme }) => theme.colors.textMuted}; text-transform: uppercase; letter-spacing: 0.4px; background: ${({ theme }) => theme.colors.bgSection}; border-bottom: 1px solid ${({ theme }) => theme.colors.border};`;
const Td = styled.td`padding: 12px 14px; font-size: 13px; color: ${({ theme }) => theme.colors.textMid}; border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight}; vertical-align: middle;`;
const Tr = styled.tr`&:hover { background: ${({ theme }) => theme.colors.bgSection}; }`;
const IdText = styled.span`font-size: 12px; font-weight: 600; color: ${ACCENT};`;
const StayCell = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const SpaceText = styled.p`font-size: 11px; color: ${({ theme }) => theme.colors.textLight};`;
const StayText = styled.p`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.adminTextDark};`;
const AmtText = styled.span`font-weight: 700; color: #dc2626;`;
const DetailBtn = styled.button`font-size: 12px; font-weight: 600; color: ${ACCENT}; cursor: pointer; font-family: inherit; &:hover { text-decoration: underline; }`;
const Empty = styled.div`padding: 60px; text-align: center; font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;


const ModalOverlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 300; display: flex; align-items: center; justify-content: center;`;
const Modal = styled.div`width: 480px; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: hidden;`;
const ModalHeader = styled.div`display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid ${({ theme }) => theme.colors.border};`;
const ModalTitle = styled.h3`font-size: 16px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark};`;
const CloseBtn = styled.button`width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: ${({ theme }) => theme.colors.textMuted}; cursor: pointer; &:hover { background: ${({ theme }) => theme.colors.borderLight}; }`;
const ModalBody = styled.div`padding: 20px 24px; display: flex; flex-direction: column; gap: 0;`;
const DRow = styled.div`display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight}; &:last-child { border-bottom: none; }`;
const DKey = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textMuted}; min-width: 80px;`;
const DVal = styled.p`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.adminTextDark}; text-align: right; word-break: break-all;`;
