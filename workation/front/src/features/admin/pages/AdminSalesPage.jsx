// src/features/admin/pages/AdminSalesPage.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Wallet, Percent, TrendingUp, ClipboardList, X } from 'lucide-react';
import AdminSearchInput from '../components/common/AdminSearchInput';
import AdminChartPanel from '../components/dashboard/AdminChartPanel';
import YearMonthPicker from '../components/common/YearMonthPicker';
import {
  getAdminSalesSummary,
  getAdminPayoutList,
  getPayoutSummary,
} from '../api/adminSalesApi'; // 💡 백엔드 API 연동
import { SETTLEMENT_STATUS_MAP } from '../data/adminSalesConstants';
import StatusBadge from '../components/common/StatusBadge';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseBtn,
} from '../components/common/AdminModal.styles'; // 모달 공통 스타일

const getTargetDate = () => {
  const today = new Date();
  const currentDate = today.getDate();
  let targetYear = today.getFullYear();
  let targetMonth = today.getMonth() + 1;

  if (currentDate <= 10) {
    targetMonth -= 2;
  } else {
    targetMonth -= 1;
  }

  if (targetMonth <= 0) {
    targetYear -= 1;
    targetMonth += 12;
  }
  return { year: targetYear, month: targetMonth };
};

const DEFAULT_TARGET = getTargetDate();

export default function AdminSalesPage() {
  const [pendingSearch, setPendingSearch] = useState('');
  const [completedDate, setCompletedDate] = useState(DEFAULT_TARGET);
  const [feeDate, setFeeDate] = useState(DEFAULT_TARGET);

  // 모달 제어 State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalStatusFilter, setModalStatusFilter] = useState('ALL'); // 'ALL' | 'READY' | 'COMPLETED'

  // 💡 백엔드 정산 연동용 State (가짜 데이터 원복 적용)
  const [rawPayouts, setRawPayouts] = useState([]);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [feeAmount, setFeeAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 1. 전체 정산 목록 조회
  useEffect(() => {
    async function fetchPayouts() {
      try {
        setLoading(true);
        const resp = await getAdminPayoutList();
        const list = Array.isArray(resp.data) ? resp.data : (resp.data.content || []);
        setRawPayouts(list);
      } catch (err) {
        console.error("정산 목록 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayouts();
  }, []);

  // 2. 선택된 연월별 정산 완료 총액 조회
  useEffect(() => {
    async function fetchCompletedSummary() {
      try {
        const resp = await getPayoutSummary(completedDate.year, completedDate.month);
        setCompletedAmount(resp.data?.totalPayoutAmount ?? 0);
      } catch (err) {
        console.error("정산 완료 요약 조회 실패:", err);
        setCompletedAmount(0);
      }
    }
    fetchCompletedSummary();
  }, [completedDate]);

  // 3. 선택된 연월별 수수료 총액 조회
  useEffect(() => {
    async function fetchFeeSummary() {
      try {
        const resp = await getPayoutSummary(feeDate.year, feeDate.month);
        setFeeAmount(resp.data?.totalFeeAmount ?? 0);
      } catch (err) {
        console.error("수수료 요약 조회 실패:", err);
        setFeeAmount(0);
      }
    }
    fetchFeeSummary();
  }, [feeDate]);

  // 4. 정산 대기 목록 가공 및 필터링 (READY 상태)
  const getFilteredPending = () => {
    return rawPayouts.filter((row) => {
      const isPending = row.statusLabel !== 'COMPLETED';
      const matchSearch =
        !pendingSearch ||
        row.sellerUsername.toLowerCase().includes(pendingSearch.toLowerCase()) ||
        String(row.payoutId).toLowerCase().includes(pendingSearch.toLowerCase());
      return isPending && matchSearch;
    });
  };

  const filteredPending = getFilteredPending();

  // 4-2. 모달 내 정산 목록 필터링 및 검색
  const getFilteredModalPayouts = () => {
    return rawPayouts.filter((row) => {
      const matchStatus =
        modalStatusFilter === 'ALL' || row.statusLabel === modalStatusFilter;
      const matchSearch =
        !modalSearch ||
        row.sellerUsername.toLowerCase().includes(modalSearch.toLowerCase()) ||
        String(row.payoutId).toLowerCase().includes(modalSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  };

  const filteredModalPayouts = getFilteredModalPayouts();

  // 5. 💡 [요구사항] 스케줄러 매달 10일 기준 Top 5 데이터 동적 연산 (실제 DB 데이터만 활용)
  const getTop5Settlements = () => {
    const today = new Date();
    const currentDate = today.getDate(); // 1 ~ 31
    let targetYear = today.getFullYear();
    let targetMonth = today.getMonth() + 1; // 1 ~ 12

    // 10일 기준 분기 처리 (10일 이하면 현재달 -2, 이후면 -1달)
    if (currentDate <= 10) {
      targetMonth -= 2;
    } else {
      targetMonth -= 1;
    }

    if (targetMonth <= 0) {
      targetYear -= 1;
      targetMonth += 12;
    }

    const labelText = `${targetYear}.${String(targetMonth).padStart(2, '0')} 정산`;

    // 해당 타겟 월 데이터만 필터링
    const targetMonthPayouts = rawPayouts.filter((item) => {
      if (!item.payoutDate) return false;
      const pDate = new Date(item.payoutDate);
      return pDate.getFullYear() === targetYear && (pDate.getMonth() + 1) === targetMonth;
    });

    // 내림차순 정렬 후 상위 5개 추출
    const sorted = [...targetMonthPayouts].sort((a, b) => b.payoutAmount - a.payoutAmount);
    return sorted.slice(0, 5).map((item, idx) => ({
      rank: idx + 1,
      name: item.sellerUsername,
      date: labelText,
      amount: `₩${item.payoutAmount.toLocaleString()}`,
    }));
  };

  const top5Settlements = getTop5Settlements();

  return (
    <PageWrapper>
      {/* ── 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>매출/정산 관리</PageTitle>
          <PageSub>전체 거래처의 매출 및 정산 현황을 통합 관리합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ══════════════════════════════════════
          매출 현황
      ══════════════════════════════════════ */}
      <SectionBlock>
        <SectionLabel>
          <TrendingUp size={15} />
          매출 현황
        </SectionLabel>
        <AdminChartPanel />
      </SectionBlock>

      {/* ══════════════════════════════════════
          정산 현황
      ══════════════════════════════════════ */}
      <SectionBlock>
        <SectionLabel>
          <ClipboardList size={15} />
          정산 현황
        </SectionLabel>

        {/* 정산 대기 목록 + Top5 나란히 */}
        <SettlementBottom>
          {/* 왼쪽: 카드 2개 + 대기 목록 */}
          <LeftColumn>
            <SettlementCards>
              <StatCard>
                <StatCardTop>
                  <StatIconWrap $bg="rgba(34,197,94,0.1)" $color="#16a34a">
                    <Wallet size={20} />
                  </StatIconWrap>
                  <YearMonthPicker
                    year={completedDate.year}
                    month={completedDate.month}
                    onChange={(y, m) => setCompletedDate({ year: y, month: m })}
                  />
                </StatCardTop>
                <StatLabel>정산 완료 금액</StatLabel>
                <StatValue>
                  {completedAmount !== null 
                    ? `₩${completedAmount.toLocaleString()}` 
                    : '₩0'}
                </StatValue>
              </StatCard>

              <StatCard>
                <StatCardTop>
                  <StatIconWrap $bg="rgba(249,115,22,0.1)" $color="#ea580c">
                    <Percent size={20} />
                  </StatIconWrap>
                  <YearMonthPicker
                    year={feeDate.year}
                    month={feeDate.month}
                    onChange={(y, m) => setFeeDate({ year: y, month: m })}
                  />
                </StatCardTop>
                <StatLabel>수수료 총액</StatLabel>
                <StatValue>
                  {feeAmount !== null 
                    ? `₩${feeAmount.toLocaleString()}` 
                    : '₩0'}
                </StatValue>
                <StatSubText>평균 수수료율 10.0% 적용</StatSubText>
              </StatCard>
            </SettlementCards>

            {/* 정산 대기 목록 */}
            <PendingSection>
              <PendingHeader>
                <PendingTitle>정산 대기 목록</PendingTitle>
                <AdminSearchInput
                  value={pendingSearch}
                  onChange={setPendingSearch}
                  placeholder="거래처명 / ID 검색..."
                  width="200px"
                />
              </PendingHeader>

              <PendingTable>
                <PTHead>
                  <PTR>
                    <PTH>ID</PTH>
                    <PTH>거래처명</PTH>
                    <PTH>정산 요청일</PTH>
                    <PTH>정산 대상액</PTH>
                    <PTH>상태</PTH>
                  </PTR>
                </PTHead>
                <PTBody>
                  {filteredPending.length === 0 ? (
                    <PTR>
                      <PTD colSpan={5}>
                        <EmptyPending>검색 결과가 없습니다.</EmptyPending>
                      </PTD>
                    </PTR>
                  ) : (
                    filteredPending.map((row) => {
                      const statusInfo = SETTLEMENT_STATUS_MAP[row.statusLabel] || { 
                        label: row.statusLabel, 
                        bg: '#f1f5f9', 
                        color: '#475569' 
                      };
                      return (
                        <PTR key={row.payoutId} $hoverable>
                          <PTD>
                            <PendingId>{row.payoutId}</PendingId>
                          </PTD>
                          <PTD>
                            <SellerName>{row.sellerUsername}</SellerName>
                          </PTD>
                          <PTD>
                            <DateCell>
                              {row.payoutDate ? row.payoutDate.split('T')[0] : '—'}
                            </DateCell>
                          </PTD>
                          <PTD>
                            <AmountCell>
                              {row.payoutAmount ? `₩${row.payoutAmount.toLocaleString()}` : '—'}
                            </AmountCell>
                          </PTD>
                          <PTD>
                            <StatusBadge $bg={statusInfo.bg} $color={statusInfo.color}>
                              {statusInfo.label}
                            </StatusBadge>
                          </PTD>
                        </PTR>
                      );
                    })
                  )}
                </PTBody>
              </PendingTable>

              <ViewAllRow>
                <ViewAllBtn onClick={() => setIsModalOpen(true)}>전체 목록 보기</ViewAllBtn>
              </ViewAllRow>
            </PendingSection>
          </LeftColumn>

          {/* 정산 금액 Top5 */}
          <Top5Card>
            <Top5Title>
              {(() => {
                const today = new Date();
                const currentDate = today.getDate();
                let m = today.getMonth() + 1;
                if (currentDate <= 10) {
                  m -= 2;
                } else {
                  m -= 1;
                }
                if (m <= 0) m += 12;
                return `${m}월`;
              })()} 정산 금액 Top 5 거래처
            </Top5Title>
            <Top5List>
              {top5Settlements.map((item) => (
                <Top5Item key={item.rank}>
                  <Top5Rank $rank={item.rank}>{item.rank}</Top5Rank>
                  <Top5Info>
                    <Top5Name>{item.name}</Top5Name>
                    <Top5Date>
                      <DateDot />
                      {item.date}
                    </Top5Date>
                  </Top5Info>
                  <Top5Amount>{item.amount}</Top5Amount>
                </Top5Item>
              ))}
            </Top5List>
          </Top5Card>
        </SettlementBottom>
      </SectionBlock>

      {/* ── 전체 정산 목록 모달 ── */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent $width="840px" $maxHeight="85vh" onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitleGroup>
                <ModalTitle>전체 정산 내역</ModalTitle>
                <ModalSub>총 {rawPayouts.length}건의 정산 신청/처리 내역이 있습니다.</ModalSub>
              </ModalTitleGroup>
              <ModalCloseBtn onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </ModalCloseBtn>
            </ModalHeader>

            {/* 모달 상단 컨트롤: 상태 탭 + 검색창 */}
            <ModalControlBar>
              <ModalTabGroup>
                <ModalTab 
                  $active={modalStatusFilter === 'ALL'} 
                  onClick={() => setModalStatusFilter('ALL')}
                >
                  전체 ({rawPayouts.length})
                </ModalTab>
                <ModalTab 
                  $active={modalStatusFilter === 'READY'} 
                  onClick={() => setModalStatusFilter('READY')}
                >
                  정산 대기 ({rawPayouts.filter(r => r.statusLabel === 'READY').length})
                </ModalTab>
                <ModalTab 
                  $active={modalStatusFilter === 'COMPLETED'} 
                  onClick={() => setModalStatusFilter('COMPLETED')}
                >
                  정산 완료 ({rawPayouts.filter(r => r.statusLabel === 'COMPLETED').length})
                </ModalTab>
              </ModalTabGroup>
              
              <AdminSearchInput
                value={modalSearch}
                onChange={setModalSearch}
                placeholder="거래처명 / ID 검색..."
                width="220px"
              />
            </ModalControlBar>

            {/* 모달 본문: 테이블 */}
            <ModalBody>
              <ModalTable>
                <ModalThead>
                  <ModalTr>
                    <ModalTh style={{ width: '80px' }}>ID</ModalTh>
                    <ModalTh>거래처명</ModalTh>
                    <ModalTh style={{ textAlign: 'right' }}>매출 금액</ModalTh>
                    <ModalTh style={{ textAlign: 'right' }}>수수료</ModalTh>
                    <ModalTh style={{ textAlign: 'right' }}>정산 대상액</ModalTh>
                    <ModalTh>정산 요청일</ModalTh>
                    <ModalTh style={{ width: '120px' }}>상태</ModalTh>
                  </ModalTr>
                </ModalThead>
                <ModalTbody>
                  {filteredModalPayouts.length === 0 ? (
                    <ModalTr>
                      <ModalTd colSpan={7}>
                        <ModalEmptyPending>조회된 정산 내역이 없습니다.</ModalEmptyPending>
                      </ModalTd>
                    </ModalTr>
                  ) : (
                    filteredModalPayouts.map((row) => {
                      const statusInfo = SETTLEMENT_STATUS_MAP[row.statusLabel] || { 
                        label: row.statusLabel, 
                        bg: '#f1f5f9', 
                        color: '#475569' 
                      };
                      return (
                        <ModalTr key={row.payoutId}>
                          <ModalTd><ModalIdText>{row.payoutId}</ModalIdText></ModalTd>
                          <ModalTd><ModalSellerText>{row.sellerUsername}</ModalSellerText></ModalTd>
                          <ModalTd style={{ textAlign: 'right' }}>
                            <ModalAmountText>
                              {row.originalAmount ? `₩${row.originalAmount.toLocaleString()}` : '₩0'}
                            </ModalAmountText>
                          </ModalTd>
                          <ModalTd style={{ textAlign: 'right' }}>
                            <ModalAmountText $isFee>
                              {row.feeAmount ? `₩${row.feeAmount.toLocaleString()}` : '₩0'}
                            </ModalAmountText>
                          </ModalTd>
                          <ModalTd style={{ textAlign: 'right' }}>
                            <ModalAmountText $isPayout>
                              {row.payoutAmount ? `₩${row.payoutAmount.toLocaleString()}` : '—'}
                            </ModalAmountText>
                          </ModalTd>
                          <ModalTd>
                            <ModalDateText>
                              {row.payoutDate ? row.payoutDate.split('T')[0] : '—'}
                            </ModalDateText>
                          </ModalTd>
                          <ModalTd>
                            <StatusBadge $bg={statusInfo.bg} $color={statusInfo.color}>
                              {statusInfo.label}
                            </StatusBadge>
                          </ModalTd>
                        </ModalTr>
                      );
                    })
                  )}
                </ModalTbody>
              </ModalTable>
            </ModalBody>

            <ModalFooter>
              <ModalFooterInfo>
                검색 결과: 총 {filteredModalPayouts.length}건
              </ModalFooterInfo>
              <ModalCloseFooterBtn onClick={() => setIsModalOpen(false)}>
                닫기
              </ModalCloseFooterBtn>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}

function DateDot() {
  return (
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: '#94a3b8',
        display: 'inline-block',
        marginRight: 5,
        verticalAlign: 'middle',
      }}
    />
  );
}

/* ── Styled Components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const PageHeader = styled.div``;

const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.24px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding-bottom: 4px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
`;

/* ── 정산 현황 ── */
const SettlementCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  flex-shrink: 0;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const StatSubText = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 4px;
`;

/* ── 정산 하단 2열: [카드+대기목록] | Top5 ── */
const SettlementBottom = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
  align-items: stretch;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* 정산 대기 목록 */
const PendingSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PendingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PendingTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const PendingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  flex: 1;
`;

const PTHead = styled.thead`
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PTBody = styled.tbody``;

const PTR = styled.tr`
  border-top: ${({ $hoverable, theme }) =>
    $hoverable ? `1px solid ${theme.colors.borderLight}` : 'none'};
  transition: background 0.1s;
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const PTH = styled.th`
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  letter-spacing: 0.3px;
`;

const PTD = styled.td`
  padding: 13px 16px;
  vertical-align: middle;
`;

const PendingId = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  font-family: ${({ theme }) => theme.fonts.number};
`;

const SellerName = styled.span`
  font-size: 13px;
  color: #334155;
  font-weight: 500;
`;

const DateCell = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const AmountCell = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const EmptyPending = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const ViewAllRow = styled.div`
  display: flex;
  justify-content: center;
  padding: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  margin-top: auto;
`;

const ViewAllBtn = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  padding: 7px 22px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

/* Top5 */
const Top5Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 22px 20px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  align-self: stretch;
`;

const Top5Title = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 16px;
`;

const Top5List = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

const Top5Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  flex: 1;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child {
    border-bottom: none;
  }
`;

const Top5Rank = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
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

const Top5Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Top5Name = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Top5Date = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
`;

const Top5Amount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  white-space: nowrap;
`;

/* ── 모달 관련 Styled Components ── */
const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const ModalSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ModalControlBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: #f8fafc;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ModalTabGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const ModalTab = styled.button`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  font-family: inherit;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? '#244c54' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#64748b')};
  border: 1px solid ${({ $active }) => ($active ? '#244c54' : 'transparent')};
  
  &:hover {
    background: ${({ $active }) => ($active ? '#244c54' : '#f1f5f9')};
    color: ${({ $active }) => ($active ? 'white' : '#334155')};
  }
`;

const ModalBody = styled.div`
  padding: 0;
  overflow-y: auto;
  flex: 1;
  max-height: 50vh;
`;

const ModalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ModalThead = styled.thead`
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ModalTbody = styled.tbody``;

const ModalTr = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
  &:hover {
    background: #fafbfc;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const ModalTh = styled.th`
  padding: 12px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  letter-spacing: 0.3px;
`;

const ModalTd = styled.td`
  padding: 12px 20px;
  vertical-align: middle;
  font-size: 13px;
`;

const ModalIdText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  font-family: ${({ theme }) => theme.fonts.number};
`;

const ModalSellerText = styled.span`
  font-weight: 500;
  color: #1e293b;
`;

const ModalAmountText = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-weight: 600;
  color: ${({ $isPayout, $isFee, theme }) => 
    $isPayout 
      ? theme.colors.adminTextDark 
      : $isFee 
        ? '#ea580c' 
        : '#475569'};
`;

const ModalDateText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const ModalEmptyPending = styled.div`
  padding: 60px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const ModalFooterInfo = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
`;

const ModalCloseFooterBtn = styled.button`
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  transition: all 0.15s;
  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;
