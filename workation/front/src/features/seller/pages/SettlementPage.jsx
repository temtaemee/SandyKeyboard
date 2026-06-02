import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  CreditCard, FileText, Download, Clock,
  X, ChevronLeft, ChevronRight, List, Calendar,
} from 'lucide-react';
import { settlementApi } from '../api/settlementApi';
import SellerCalendar from '../components/common/SellerCalendar';
import SellerPagination from '../components/common/SellerPagination';

const ACCENT = '#3ec9a7';

const TABS = [
  { key: 'history', label: '정산 내역' },
  { key: 'invoice', label: '세금계산서' },
];

const fmt = (n) => (n != null ? Number(n).toLocaleString() + '원' : '-');
const fmtDate = (dt) => (dt ? String(dt).slice(0, 10) : '-');

const PAYOUT_COLOR = { PENDING: '#c2410c', SETTLED: '#15803d', COMPLETED: '#15803d' };
const PAYOUT_BG    = { PENDING: '#ffedd5', SETTLED: '#dcfce7', COMPLETED: '#dcfce7' };
const PAYOUT_LABEL = { PENDING: '정산대기', SETTLED: '정산완료', COMPLETED: '정산완료' };

const INV_COLOR = { ISSUED: '#15803d', PENDING: '#c2410c', CANCELLED: '#64748b' };
const INV_BG    = { ISSUED: '#dcfce7', PENDING: '#ffedd5', CANCELLED: '#f1f5f9' };
const INV_LABEL = { ISSUED: '발행완료', PENDING: '발행대기', CANCELLED: '취소' };

export default function SettlementPage() {
  const [tab, setTab] = useState('history');
  const [viewMode, setViewMode] = useState('table');

  // ── 정산 내역 상태 ──
  const [payouts, setPayouts]         = useState([]);
  const [payoutPages, setPayoutPages] = useState(0);
  const [payoutPno, setPayoutPno]     = useState(0);
  const [payoutLoading, setPayoutLoading] = useState(false);

  // ── 세금계산서 상태 ──
  const [invoices, setInvoices]           = useState([]);
  const [invoicePages, setInvoicePages]   = useState(0);
  const [invoicePno, setInvoicePno]       = useState(0);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);


  const fetchPayouts = useCallback(async (pno = 0) => {
    setPayoutLoading(true);
    try {
      const res = await settlementApi.getPayoutList(pno);
      setPayouts(res.data.content ?? []);
      setPayoutPages(res.data.totalPages ?? 0);
      setPayoutPno(pno);
    } catch {
      setPayouts([]);
    } finally {
      setPayoutLoading(false);
    }
  }, []);

  const fetchInvoices = useCallback(async (pno = 0) => {
    setInvoiceLoading(true);
    try {
      const res = await settlementApi.getInvoiceList(pno);
      setInvoices(res.data.content ?? []);
      setInvoicePages(res.data.totalPages ?? 0);
      setInvoicePno(pno);
    } catch {
      setInvoices([]);
    } finally {
      setInvoiceLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'history') fetchPayouts(0);
    if (tab === 'invoice') fetchInvoices(0);
  }, [tab]);

  const openDetail = async (inv) => {
    setDetailLoading(true);
    setDetailInvoice(inv);
    try {
      const res = await settlementApi.getInvoiceDetail(inv.invoiceId);
      setDetailInvoice(res.data);
    } catch {
      // 목록에서 받은 데이터 그대로 표시
    } finally {
      setDetailLoading(false);
    }
  };


  const settledTotal  = payouts.filter((p) => p.statusLabel !== 'PENDING').reduce((s, p) => s + (p.payoutAmount ?? 0), 0);
  const pendingTotal  = payouts.filter((p) => p.statusLabel === 'PENDING').reduce((s, p) => s + (p.payoutAmount ?? 0), 0);

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>정산 관리</PageTitle>
          <PageSub>매출 정산 신청 및 세금계산서를 관리합니다</PageSub>
        </TitleGroup>
        <ViewToggle>
          <ViewBtn $active={viewMode === 'table'} onClick={() => setViewMode('table')}><List size={13} />목록</ViewBtn>
          <ViewBtn $active={viewMode === 'calendar'} onClick={() => setViewMode('calendar')}><Calendar size={13} />달력</ViewBtn>
        </ViewToggle>
      </PageHeader>

      {viewMode === 'calendar' && (
        <CalCard>
          <SellerCalendar
            events={payouts.map((p) => ({
              date: (p.payoutDate ?? p.createdAt ?? '').slice(0, 10),
              label: `${fmt(p.payoutAmount)}`,
              color: p.statusLabel === 'PENDING' ? '#c2410c' : '#15803d',
              bg:    p.statusLabel === 'PENDING' ? '#ffedd5' : '#dcfce7',
              cancelled: false,
              tooltip: {
                id: p.payoutId,
                amount: p.payoutAmount,
                status: PAYOUT_LABEL[p.statusLabel] ?? p.statusLabel,
              },
            })).filter((e) => e.date)}
          />
        </CalCard>
      )}

      {/* 요약 카드 */}
      <SummaryGrid>
        <SummaryCard>
          <IconBg $color="#dcfce7"><CreditCard size={20} color="#15803d" /></IconBg>
          <SummaryLabel>총 정산완료</SummaryLabel>
          <SummaryValue>{fmt(settledTotal)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ffedd5"><Clock size={20} color="#c2410c" /></IconBg>
          <SummaryLabel>미정산 금액</SummaryLabel>
          <SummaryValue>{fmt(pendingTotal)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ede9fe"><FileText size={20} color="#7c3aed" /></IconBg>
          <SummaryLabel>발행된 세금계산서</SummaryLabel>
          <SummaryValue>{invoices.length}건</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <Card>
        <TabRow>
          {TABS.map((t) => (
            <TabBtn key={t.key} $active={tab === t.key} onClick={() => setTab(t.key)}>
              {t.label}
            </TabBtn>
          ))}
        </TabRow>

        {/* ─── 정산 내역 ─── */}
        {tab === 'history' && (
          <TabContent>
            {payoutLoading ? (
              <LoadArea>불러오는 중...</LoadArea>
            ) : (
              <>
                <Table>
                  <colgroup>
                    <col width="80" />
                    <col width="140" />
                    <col width="130" />
                    <col width="130" />
                    <col width="90" />
                    <col width="120" />
                  </colgroup>
                  <thead>
                    <tr>
                      {['정산 ID', '결제 원금', '수수료', '정산금액', '상태', '정산일'].map((h) => (
                        <Th key={h}>{h}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.length === 0 ? (
                      <tr><Td colSpan={6}><Empty>정산 내역이 없습니다</Empty></Td></tr>
                    ) : payouts.map((p) => (
                      <tr key={p.payoutId}>
                        <Td><MonoText>#{p.payoutId}</MonoText></Td>
                        <Td><PriceText>{fmt(p.originalAmount)}</PriceText></Td>
                        <Td><FeeText>-{fmt(p.feeAmount)}</FeeText></Td>
                        <Td><SettleText>{fmt(p.payoutAmount)}</SettleText></Td>
                        <Td>
                          <StatusBadge
                            $color={PAYOUT_COLOR[p.statusLabel] ?? '#64748b'}
                            $bg={PAYOUT_BG[p.statusLabel] ?? '#f1f5f9'}
                          >
                            {PAYOUT_LABEL[p.statusLabel] ?? p.statusLabel}
                          </StatusBadge>
                        </Td>
                        <Td>{fmtDate(p.payoutDate)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <SellerPagination pno={payoutPno} total={payoutPages} onPage={fetchPayouts} />
              </>
            )}
          </TabContent>
        )}

        {/* ─── 세금계산서 ─── */}
        {tab === 'invoice' && (
          <TabContent>
            {invoiceLoading ? (
              <LoadArea>불러오는 중...</LoadArea>
            ) : (
              <>
                <Table>
                  <colgroup>
                    <col width="160" />
                    <col width="140" />
                    <col width="140" />
                    <col width="140" />
                    <col width="90" />
                    <col width="100" />
                  </colgroup>
                  <thead>
                    <tr>
                      {['계산서 번호', '발행일', '공급가액', '부가세(10%)', '상태', ''].map((h) => (
                        <Th key={h}>{h}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr><Td colSpan={6}><Empty>발행된 세금계산서가 없습니다</Empty></Td></tr>
                    ) : invoices.map((inv) => (
                      <tr key={inv.invoiceId}>
                        <Td><MonoText>{inv.issueNo}</MonoText></Td>
                        <Td>{fmtDate(inv.issuedAt)}</Td>
                        <Td><PriceText>{fmt(inv.supplyValue)}</PriceText></Td>
                        <Td>{fmt(inv.taxAmount)}</Td>
                        <Td>
                          <StatusBadge
                            $color={INV_COLOR[inv.status] ?? '#64748b'}
                            $bg={INV_BG[inv.status] ?? '#f1f5f9'}
                          >
                            {INV_LABEL[inv.status] ?? inv.status}
                          </StatusBadge>
                        </Td>
                        <Td>
                          <ActionBtn onClick={() => openDetail(inv)}>상세</ActionBtn>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <SellerPagination pno={invoicePno} total={invoicePages} onPage={fetchInvoices} />
              </>
            )}
          </TabContent>
        )}
      </Card>

      {/* 세금계산서 상세 모달 */}
      {detailInvoice && (
        <ModalOverlay onClick={() => setDetailInvoice(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>세금계산서 상세</ModalTitle>
              <CloseBtn onClick={() => setDetailInvoice(null)}><X size={18} /></CloseBtn>
            </ModalHeader>
            <ModalBody>
              {detailLoading ? (
                <LoadArea>불러오는 중...</LoadArea>
              ) : (
                <>
                  <InvoiceRow><InvLabel>계산서 번호</InvLabel><InvValue><MonoText>{detailInvoice.issueNo}</MonoText></InvValue></InvoiceRow>
                  <InvoiceRow><InvLabel>발행일</InvLabel><InvValue>{fmtDate(detailInvoice.issuedAt)}</InvValue></InvoiceRow>
                  <InvoiceRow><InvLabel>상호명</InvLabel><InvValue>{detailInvoice.sellerAccountName}</InvValue></InvoiceRow>
                  <InvoiceRow><InvLabel>사업자번호</InvLabel><InvValue>{detailInvoice.sellerBusinessNo}</InvValue></InvoiceRow>
                  <InvDivider />
                  <InvoiceRow><InvLabel>공급가액</InvLabel><InvValue><PriceText>{fmt(detailInvoice.supplyValue)}</PriceText></InvValue></InvoiceRow>
                  <InvoiceRow><InvLabel>부가세 (10%)</InvLabel><InvValue>{fmt(detailInvoice.taxAmount)}</InvValue></InvoiceRow>
                  <InvoiceRow $total>
                    <InvLabel>합계 금액</InvLabel>
                    <InvValue><TotalText>{fmt(detailInvoice.totalAmount)}</TotalText></InvValue>
                  </InvoiceRow>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <CloseTextBtn onClick={() => setDetailInvoice(null)}>닫기</CloseTextBtn>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 24px;`;

const PageHeader = styled.div`display: flex; align-items: flex-start; justify-content: space-between;`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const ViewBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  padding: 0 14px; height: 34px;
  font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer;
  background: ${({ $active }) => $active ? ACCENT : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'};
  border: none; transition: all 0.15s;
  &:hover { background: ${({ $active }) => $active ? ACCENT : '#f1f5f9'}; }
`;

const CalCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
`;
const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;

const PageTitle = styled.h1`
  font-size: 24px; font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark}; letter-spacing: -0.4px;
`;
const PageSub = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;

const SummaryGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;`;

const SummaryCard = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; padding: 22px; display: flex; flex-direction: column; gap: 6px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;
const IconBg = styled.div`
  width: 40px; height: 40px; border-radius: 10px; background: ${({ $color }) => $color};
  display: flex; align-items: center; justify-content: center; margin-bottom: 2px;
`;
const SummaryLabel = styled.p`
  font-size: 12px; font-weight: 500; color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase; letter-spacing: 0.5px;
`;
const SummaryValue = styled.p`
  font-size: 22px; font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const Card = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px; box-shadow: ${({ theme }) => theme.shadows.card}; overflow: hidden;
`;
const TabRow = styled.div`display: flex; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; padding: 0 24px;`;
const TabBtn = styled.button`
  padding: 14px 16px; font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  color: ${({ $active, theme }) => ($active ? ACCENT : theme.colors.textMuted)};
  border-bottom: 2px solid ${({ $active }) => ($active ? ACCENT : 'transparent')};
  transition: all 0.15s; font-family: inherit;
  &:hover { color: ${ACCENT}; }
`;
const TabContent = styled.div`padding: 24px;`;

const LoadArea = styled.div`padding: 60px; text-align: center; font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;
const Th = styled.th`
  text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted}; text-transform: uppercase; letter-spacing: 0.4px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}; white-space: nowrap;
`;
const Td = styled.td`
  padding: 12px 14px; font-size: 13px; color: ${({ theme }) => theme.colors.textMid};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight}; vertical-align: middle;
`;
const Empty = styled.div`padding: 48px; text-align: center; color: ${({ theme }) => theme.colors.textMuted}; font-size: 14px;`;
const MonoText = styled.span`font-family: 'Plus Jakarta Sans', monospace; font-size: 12px; color: ${({ theme }) => theme.colors.textMuted};`;
const PriceText = styled.span`font-family: ${({ theme }) => theme.fonts.number}; font-weight: 600; color: ${({ theme }) => theme.colors.adminTextDark};`;
const FeeText = styled.span`font-family: ${({ theme }) => theme.fonts.number}; font-size: 13px; color: #b91c1c;`;
const SettleText = styled.span`font-family: ${({ theme }) => theme.fonts.number}; font-weight: 700; color: ${ACCENT};`;
const StatusBadge = styled.span`
  display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600;
  color: ${({ $color }) => $color}; background: ${({ $bg }) => $bg};
`;
const ActionBtn = styled.button`
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border}; background: white;
  color: ${({ theme }) => theme.colors.textMid}; cursor: pointer; font-family: inherit;
  &:hover { background: #f8fafc; }
`;


/* 정산 요청 */
const RequestGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 24px;`;
const AmountCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSection};
  border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 10px; padding: 24px;
`;
const AmountLabel = styled.p`font-size: 12px; font-weight: 500; color: ${({ theme }) => theme.colors.textMuted}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;`;
const AmountValue = styled.p`font-size: 32px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark}; font-family: ${({ theme }) => theme.fonts.number};`;
const AmountNote = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; margin-top: 4px;`;
const RequestForm = styled.div`display: flex; flex-direction: column; gap: 20px;`;
const FormTitle = styled.h3`font-size: 16px; font-weight: 600; color: ${({ theme }) => theme.colors.adminTextDark};`;
const FormSection = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const FormLabel = styled.label`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.textMid};`;
const DateRow = styled.div`display: flex; align-items: center; gap: 8px;`;
const DateInput = styled.input`
  flex: 1; height: 38px; padding: 0 12px; border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px; color: ${({ theme }) => theme.colors.adminTextDark}; font-family: inherit; background: white;
`;
const DateSep = styled.span`font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;
const BankCard = styled.div`
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: ${({ theme }) => theme.colors.bgSection};
  border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: 8px;
`;
const BankNote = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.textLight};`;
const SuccessMsg = styled.div`
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  background: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px;
  font-size: 13px; font-weight: 500; color: #15803d;
`;
const RequestBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 8px;
  height: 44px; border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#e2e8f0' : ACCENT)};
  color: ${({ disabled }) => (disabled ? '#94a3b8' : 'white')};
  font-size: 14px; font-weight: 600; font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s;
  &:hover:not(:disabled) { background: #31b08e; }
`;

/* 모달 */
const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 300;
  display: flex; align-items: center; justify-content: center;
`;
const Modal = styled.div`width: 480px; background: white; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: hidden;`;
const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const ModalTitle = styled.h3`font-size: 16px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark};`;
const CloseBtn = styled.button`
  width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted}; transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
`;
const ModalBody = styled.div`padding: 20px 24px; display: flex; flex-direction: column; gap: 0;`;
const InvoiceRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: ${({ $total }) => ($total ? '12px 8px' : '10px 0')};
  border-bottom: 1px solid ${({ $total, theme }) => ($total ? theme.colors.border : theme.colors.borderLight)};
  background: ${({ $total }) => ($total ? '#f8fafc' : 'transparent')};
  ${({ $total }) => $total && 'margin-top: 4px; border-radius: 6px;'}
`;
const InvLabel = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};`;
const InvValue = styled.p`font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.adminTextDark};`;
const InvDivider = styled.hr`border: none; border-top: 1px solid ${({ theme }) => theme.colors.border}; margin: 8px 0;`;
const TotalText = styled.span`font-size: 16px; font-weight: 700; font-family: ${({ theme }) => theme.fonts.number}; color: ${ACCENT};`;
const ModalFooter = styled.div`
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 14px 24px; border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
const CloseTextBtn = styled.button`
  padding: 8px 16px; border-radius: 8px; border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.textMid};
  background: white; cursor: pointer; font-family: inherit;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;
