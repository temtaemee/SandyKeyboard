// src/features/admin/components/dashboard/AdminPaymentTable.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft as LucideChevronLeft, ChevronRight as LucideChevronRight, Filter } from 'lucide-react';
import AdminPagination from '../common/AdminPagination';
import StatusBadge from '../common/StatusBadge';
import { RECENT_PAYMENTS, PAYMENT_STATUS_MAP } from '../../data/adminDashboardData';

const TOTAL = 2401;
const TOTAL_PAGES = 3;

export default function AdminPaymentTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <TableSection>
      <TableHeader>
        <HeaderLeft>
          <TableTitle>최근 결제 내역</TableTitle>
          <TableSub>실시간 주문 및 거래 현황</TableSub>
        </HeaderLeft>
        <HeaderRight>
          <DotsBtn aria-label="더보기">···</DotsBtn>
          <FilterBtn aria-label="필터">
            <FilterIcon />
          </FilterBtn>
        </HeaderRight>
      </TableHeader>

      <Table>
        <THead>
          <TR>
            <TH>주문 번호</TH>
            <TH>구매자</TH>
            <TH>상품명</TH>
            <TH>결제 금액</TH>
            <TH>일시</TH>
            <TH>상태</TH>
          </TR>
        </THead>
        <TBody>
          {RECENT_PAYMENTS.map((row) => (
            <TR key={row.id} $hoverable>
              <TD><OrderId>{row.id}</OrderId></TD>
              <TD><BuyerText>{row.buyer}</BuyerText></TD>
              <TD><ProductText>{row.product}</ProductText></TD>
              <TD><AmountText>{row.amount}</AmountText></TD>
              <TD><DateText>{row.datetime}</DateText></TD>
              <TD>
                <StatusBadge
                  $bg={PAYMENT_STATUS_MAP[row.status].bg}
                  $color={PAYMENT_STATUS_MAP[row.status].color}
                >
                  {PAYMENT_STATUS_MAP[row.status].label}
                </StatusBadge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <TableFooter>
        <FooterInfo>총 {TOTAL.toLocaleString()}개</FooterInfo>
        <AdminPagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
        <div style={{ width: '80px' }} />
      </TableFooter>
    </TableSection>
  );
}

function ChevronLeft() { return <LucideChevronLeft size={14} color="#475569" strokeWidth={1.5} />; }
function ChevronRight() { return <LucideChevronRight size={14} color="#475569" strokeWidth={1.5} />; }
function FilterIcon() { return <Filter size={14} color="#64748b" />; }

/* ── Styled Components ── */

const TableSection = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TableTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #0d1c2e;
  line-height: 1.4;
`;

const TableSub = styled.p`
  font-size: 13px;
  color: #64748b;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DotsBtn = styled.button`
  color: #94a3b8;
  font-size: 18px;
  letter-spacing: 1px;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover { background: #f1f5f9; }
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover { background: #f8fafc; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
`;

const TBody = styled.tbody``;

const TR = styled.tr`
  border-top: ${({ $hoverable }) => ($hoverable ? '1px solid #f1f5f9' : 'none')};
  transition: background 0.1s;
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const TH = styled.th`
  padding: 12px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
`;

const TD = styled.td`
  padding: 18px 24px;
  vertical-align: middle;
`;

const OrderId = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const BuyerText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #334155;
`;

const ProductText = styled.span`
  font-size: 13px;
  color: #475569;
`;

const AmountText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const DateText = styled.span`
  font-size: 13px;
  color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;



/* 페이지네이션 푸터 */
const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
`;

const FooterInfo = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.6px;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;
