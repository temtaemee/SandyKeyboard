import { useState } from 'react';
import styled from 'styled-components';
import {
  CreditCard, FileText, Send, Download, CheckCircle, Clock,
  ChevronDown, X, Building2, AlertCircle
} from 'lucide-react';

const ACCENT = '#3ec9a7';

const TABS = [
  { key: 'history', label: '정산 내역' },
  { key: 'request', label: '정산 요청' },
  { key: 'invoice', label: '세금계산서' },
];

const MOCK_SETTLEMENTS = [
  { id: 1, reservationId: 'RV-2025-001', spaceName: '제주 오션뷰 워크', stayName: '디럭스 오션뷰', checkIn: '2025-05-10', checkOut: '2025-05-13', nights: 3, totalPrice: 450000, feeAmt: 22500, settleAmt: 427500, status: 'SETTLED', settledAt: '2025-05-20' },
  { id: 2, reservationId: 'RV-2025-002', spaceName: '서울 도심 워케이션', stayName: '스탠다드 A룸', checkIn: '2025-05-15', checkOut: '2025-05-18', nights: 3, totalPrice: 330000, feeAmt: 16500, settleAmt: 313500, status: 'PENDING', settledAt: null },
  { id: 3, reservationId: 'RV-2025-003', spaceName: '제주 오션뷰 워크', stayName: '스탠다드 오션뷰', checkIn: '2025-05-18', checkOut: '2025-05-20', nights: 2, totalPrice: 240000, feeAmt: 12000, settleAmt: 228000, status: 'PENDING', settledAt: null },
  { id: 4, reservationId: 'RV-2025-004', spaceName: '강원 힐링 스테이', stayName: '패밀리룸', checkIn: '2025-04-25', checkOut: '2025-04-28', nights: 3, totalPrice: 390000, feeAmt: 19500, settleAmt: 370500, status: 'SETTLED', settledAt: '2025-05-05' },
  { id: 5, reservationId: 'RV-2025-005', spaceName: '서울 도심 워케이션', stayName: '프리미엄 B룸', checkIn: '2025-04-10', checkOut: '2025-04-12', nights: 2, totalPrice: 280000, feeAmt: 14000, settleAmt: 266000, status: 'SETTLED', settledAt: '2025-04-20' },
  { id: 6, reservationId: 'RV-2025-006', spaceName: '강원 힐링 스테이', stayName: '스탠다드 숲뷰', checkIn: '2025-05-22', checkOut: '2025-05-24', nights: 2, totalPrice: 200000, feeAmt: 10000, settleAmt: 190000, status: 'PENDING', settledAt: null },
];

const MOCK_INVOICES = [
  { id: 1, invoiceNo: 'INV-2025-0501', issueDate: '2025-05-01', period: '2025-04-01 ~ 2025-04-30', amount: 2750000, vatAmount: 250000, supplyAmount: 2500000, recipient: '홍길동', bizNo: '123-45-67890', status: 'ISSUED' },
  { id: 2, invoiceNo: 'INV-2025-0401', issueDate: '2025-04-01', period: '2025-03-01 ~ 2025-03-31', amount: 1980000, vatAmount: 180000, supplyAmount: 1800000, recipient: '홍길동', bizNo: '123-45-67890', status: 'ISSUED' },
  { id: 3, invoiceNo: 'INV-2025-0301', issueDate: '2025-03-01', period: '2025-02-01 ~ 2025-02-28', amount: 1320000, vatAmount: 120000, supplyAmount: 1200000, recipient: '홍길동', bizNo: '123-45-67890', status: 'ISSUED' },
];

const MOCK_BANK = { bank: '국민은행', account: '123-456-789012', holder: '홍길동' };

const STATUS_LABEL = { SETTLED: '정산완료', PENDING: '정산대기' };
const STATUS_COLOR = { SETTLED: '#15803d', PENDING: '#c2410c' };
const STATUS_BG = { SETTLED: '#dcfce7', PENDING: '#ffedd5' };
const INV_STATUS_LABEL = { ISSUED: '발행완료', PENDING: '발행대기', CANCELLED: '취소' };
const INV_STATUS_COLOR = { ISSUED: '#15803d', PENDING: '#c2410c', CANCELLED: '#64748b' };
const INV_STATUS_BG = { ISSUED: '#dcfce7', PENDING: '#ffedd5', CANCELLED: '#f1f5f9' };

const fmt = (n) => n.toLocaleString() + '원';

export default function SettlementPage() {
  const [tab, setTab] = useState('history');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // 정산 요청
  const [reqPeriodFrom, setReqPeriodFrom] = useState('');
  const [reqPeriodTo, setReqPeriodTo] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [reqDone, setReqDone] = useState(false);

  // 세금계산서 상세 모달
  const [detailInvoice, setDetailInvoice] = useState(null);

  const pendingAmt = MOCK_SETTLEMENTS
    .filter((s) => s.status === 'PENDING')
    .reduce((sum, s) => sum + s.settleAmt, 0);

  const filteredHistory = filterStatus === 'ALL'
    ? MOCK_SETTLEMENTS
    : MOCK_SETTLEMENTS.filter((s) => s.status === filterStatus);

  const handleRequest = async () => {
    if (!reqPeriodFrom || !reqPeriodTo) return;
    setRequesting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRequesting(false);
    setReqDone(true);
    setTimeout(() => setReqDone(false), 3000);
  };

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>정산 관리</PageTitle>
          <PageSub>매출 정산 신청 및 세금계산서를 관리합니다</PageSub>
        </TitleGroup>
      </PageHeader>

      {/* 요약 카드 */}
      <SummaryGrid>
        <SummaryCard>
          <IconBg $color="#dcfce7"><CreditCard size={20} color="#15803d" /></IconBg>
          <SummaryLabel>총 정산완료</SummaryLabel>
          <SummaryValue>
            {fmt(MOCK_SETTLEMENTS.filter((s) => s.status === 'SETTLED').reduce((sum, s) => sum + s.settleAmt, 0))}
          </SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ffedd5"><Clock size={20} color="#c2410c" /></IconBg>
          <SummaryLabel>미정산 금액</SummaryLabel>
          <SummaryValue>{fmt(pendingAmt)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ede9fe"><FileText size={20} color="#7c3aed" /></IconBg>
          <SummaryLabel>발행된 세금계산서</SummaryLabel>
          <SummaryValue>{MOCK_INVOICES.length}건</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      {/* 탭 */}
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
            <FilterBar>
              <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="ALL">전체 상태</option>
                <option value="SETTLED">정산완료</option>
                <option value="PENDING">정산대기</option>
              </FilterSelect>
              <InfoNote>
                <AlertCircle size={13} />
                수수료 5% 적용 기준 (실제 정산액 = 결제금액 × 0.95)
              </InfoNote>
            </FilterBar>

            <Table>
              <colgroup>
                <col width="130" />
                <col />
                <col width="100" />
                <col width="100" />
                <col width="110" />
                <col width="110" />
                <col width="90" />
                <col width="110" />
              </colgroup>
              <thead>
                <tr>
                  {['예약번호', '공간 / 스테이', '체크인', '체크아웃', '결제금액', '정산금액', '상태', '정산일'].map((h) => (
                    <Th key={h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredHistory.length === 0 ? (
                  <tr><Td colSpan={8}><Empty>내역이 없습니다</Empty></Td></tr>
                ) : (
                  filteredHistory.map((s) => (
                    <tr key={s.id}>
                      <Td><MonoText>{s.reservationId}</MonoText></Td>
                      <Td>
                        <SpaceCell>
                          <SpaceName>{s.spaceName}</SpaceName>
                          <StayName>{s.stayName}</StayName>
                        </SpaceCell>
                      </Td>
                      <Td>{s.checkIn}</Td>
                      <Td>{s.checkOut}</Td>
                      <Td><PriceText>{fmt(s.totalPrice)}</PriceText></Td>
                      <Td><SettleText>{fmt(s.settleAmt)}</SettleText></Td>
                      <Td>
                        <StatusBadge $color={STATUS_COLOR[s.status]} $bg={STATUS_BG[s.status]}>
                          {STATUS_LABEL[s.status]}
                        </StatusBadge>
                      </Td>
                      <Td>{s.settledAt ?? '-'}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TabContent>
        )}

        {/* ─── 정산 요청 ─── */}
        {tab === 'request' && (
          <TabContent>
            <RequestGrid>
              {/* 미정산 금액 */}
              <AmountCard>
                <AmountLabel>현재 미정산 금액</AmountLabel>
                <AmountValue>{fmt(pendingAmt)}</AmountValue>
                <AmountNote>정산 대기 {MOCK_SETTLEMENTS.filter((s) => s.status === 'PENDING').length}건</AmountNote>
                <PendingList>
                  {MOCK_SETTLEMENTS.filter((s) => s.status === 'PENDING').map((s) => (
                    <PendingItem key={s.id}>
                      <PendingName>{s.stayName}</PendingName>
                      <PendingAmt>{fmt(s.settleAmt)}</PendingAmt>
                    </PendingItem>
                  ))}
                </PendingList>
              </AmountCard>

              {/* 정산 신청 폼 */}
              <RequestForm>
                <FormTitle>정산 신청</FormTitle>

                <FormSection>
                  <FormLabel>정산 기간 선택</FormLabel>
                  <DateRow>
                    <DateInput type="date" value={reqPeriodFrom} onChange={(e) => setReqPeriodFrom(e.target.value)} />
                    <DateSep>~</DateSep>
                    <DateInput type="date" value={reqPeriodTo} onChange={(e) => setReqPeriodTo(e.target.value)} />
                  </DateRow>
                </FormSection>

                <FormSection>
                  <FormLabel>정산 계좌 정보</FormLabel>
                  <BankCard>
                    <Building2 size={16} color="#475569" />
                    <BankInfo>
                      <BankName>{MOCK_BANK.bank}</BankName>
                      <BankAccount>{MOCK_BANK.account} ({MOCK_BANK.holder})</BankAccount>
                    </BankInfo>
                    <BankNote>API 연동 후 실제 등록 계좌가 표시됩니다</BankNote>
                  </BankCard>
                </FormSection>

                {reqDone && (
                  <SuccessMsg>
                    <CheckCircle size={15} />
                    정산 신청이 완료되었습니다. 영업일 기준 3~5일 내 입금됩니다.
                  </SuccessMsg>
                )}

                <RequestBtn
                  onClick={handleRequest}
                  disabled={requesting || !reqPeriodFrom || !reqPeriodTo || pendingAmt === 0}
                >
                  {requesting ? '신청 중...' : (
                    <><Send size={15} />정산 신청하기</>
                  )}
                </RequestBtn>

                {pendingAmt === 0 && (
                  <GuideText>미정산 금액이 없습니다.</GuideText>
                )}
              </RequestForm>
            </RequestGrid>
          </TabContent>
        )}

        {/* ─── 세금계산서 ─── */}
        {tab === 'invoice' && (
          <TabContent>
            <Table>
              <colgroup>
                <col width="160" />
                <col width="120" />
                <col />
                <col width="140" />
                <col width="140" />
                <col width="90" />
                <col width="120" />
              </colgroup>
              <thead>
                <tr>
                  {['계산서 번호', '발행일', '정산 기간', '공급가액', '부가세(10%)', '상태', ''].map((h) => (
                    <Th key={h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_INVOICES.length === 0 ? (
                  <tr><Td colSpan={7}><Empty>발행된 세금계산서가 없습니다</Empty></Td></tr>
                ) : (
                  MOCK_INVOICES.map((inv) => (
                    <tr key={inv.id}>
                      <Td><MonoText>{inv.invoiceNo}</MonoText></Td>
                      <Td>{inv.issueDate}</Td>
                      <Td>{inv.period}</Td>
                      <Td><PriceText>{fmt(inv.supplyAmount)}</PriceText></Td>
                      <Td>{fmt(inv.vatAmount)}</Td>
                      <Td>
                        <StatusBadge $color={INV_STATUS_COLOR[inv.status]} $bg={INV_STATUS_BG[inv.status]}>
                          {INV_STATUS_LABEL[inv.status]}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <ActionRow>
                          <ActionBtn onClick={() => setDetailInvoice(inv)}>상세</ActionBtn>
                          <ActionBtn $primary onClick={() => alert('다운로드 기능은 API 연동 후 제공됩니다.')}>
                            <Download size={13} />
                          </ActionBtn>
                        </ActionRow>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
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
              <InvoiceRow><InvLabel>계산서 번호</InvLabel><InvValue><MonoText>{detailInvoice.invoiceNo}</MonoText></InvValue></InvoiceRow>
              <InvoiceRow><InvLabel>발행일</InvLabel><InvValue>{detailInvoice.issueDate}</InvValue></InvoiceRow>
              <InvoiceRow><InvLabel>정산 기간</InvLabel><InvValue>{detailInvoice.period}</InvValue></InvoiceRow>
              <InvoiceRow><InvLabel>수신자</InvLabel><InvValue>{detailInvoice.recipient}</InvValue></InvoiceRow>
              <InvoiceRow><InvLabel>사업자번호</InvLabel><InvValue>{detailInvoice.bizNo}</InvValue></InvoiceRow>
              <InvDivider />
              <InvoiceRow><InvLabel>공급가액</InvLabel><InvValue><PriceText>{fmt(detailInvoice.supplyAmount)}</PriceText></InvValue></InvoiceRow>
              <InvoiceRow><InvLabel>부가세 (10%)</InvLabel><InvValue>{fmt(detailInvoice.vatAmount)}</InvValue></InvoiceRow>
              <InvoiceRow $total>
                <InvLabel>합계 금액</InvLabel>
                <InvValue><TotalText>{fmt(detailInvoice.amount)}</TotalText></InvValue>
              </InvoiceRow>
            </ModalBody>
            <ModalFooter>
              <DownloadBtn onClick={() => alert('다운로드 기능은 API 연동 후 제공됩니다.')}>
                <Download size={15} />PDF 다운로드
              </DownloadBtn>
              <CloseTextBtn onClick={() => setDetailInvoice(null)}>닫기</CloseTextBtn>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const SummaryCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const IconBg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
`;

const SummaryLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SummaryValue = styled.p`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const TabRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 24px;
`;

const TabBtn = styled.button`
  padding: 14px 16px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  color: ${({ $active, theme }) => ($active ? ACCENT : theme.colors.textMuted)};
  border-bottom: 2px solid ${({ $active }) => ($active ? ACCENT : 'transparent')};
  transition: all 0.15s;
  font-family: inherit;
  &:hover {
    color: ${ACCENT};
  }
`;

const TabContent = styled.div`
  padding: 24px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const FilterSelect = styled.select`
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  cursor: pointer;
`;

const InfoNote = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

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

const Empty = styled.div`
  padding: 48px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const MonoText = styled.span`
  font-family: 'Plus Jakarta Sans', monospace;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SpaceCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SpaceName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const StayName = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PriceText = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const SettleText = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-weight: 700;
  color: ${ACCENT};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
`;

const ActionRow = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${({ $primary, theme }) => ($primary ? ACCENT : theme.colors.border)};
  background: ${({ $primary }) => ($primary ? `${ACCENT}15` : 'white')};
  color: ${({ $primary, theme }) => ($primary ? ACCENT : theme.colors.textMid)};
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  &:hover {
    background: ${({ $primary }) => ($primary ? `${ACCENT}25` : '#f8fafc')};
  }
`;

/* 정산 요청 */
const RequestGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const AmountCard = styled.div`
  background: ${({ theme }) => theme.colors.bgSection};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 24px;
`;

const AmountLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const AmountValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const AmountNote = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
  margin-bottom: 20px;
`;

const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const PendingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const PendingName = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
`;

const PendingAmt = styled.p`
  font-size: 13px;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.number};
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const RequestForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateInput = styled.input`
  flex: 1;
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  background: white;
`;

const DateSep = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BankCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.bgSection};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const BankInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BankName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const BankAccount = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const BankNote = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 4px;
`;

const SuccessMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #15803d;
`;

const RequestBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#e2e8f0' : ACCENT)};
  color: ${({ disabled }) => (disabled ? '#94a3b8' : 'white')};
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #31b08e;
  }
`;

const GuideText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

/* 세금계산서 모달 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  width: 480px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
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
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const InvoiceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${({ $total, theme }) => ($total ? theme.colors.border : theme.colors.borderLight)};
  background: ${({ $total }) => ($total ? '#f8fafc' : 'transparent')};
  ${({ $total }) => $total && 'margin-top: 4px; border-radius: 6px; padding: 12px 8px;'}
`;

const InvLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const InvValue = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const InvDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 8px 0;
`;

const TotalText = styled.span`
  font-size: 16px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.number};
  color: ${ACCENT};
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const DownloadBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${ACCENT};
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #31b08e;
  }
`;

const CloseTextBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  background: white;
  cursor: pointer;
  font-family: inherit;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;
