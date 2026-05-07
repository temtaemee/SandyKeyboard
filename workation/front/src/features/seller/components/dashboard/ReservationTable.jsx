// src/features/seller/components/dashboard/ReservationTable.jsx
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RECENT_RESERVATIONS, STATUS_MAP, INITIAL_COLORS } from '../../data/dashboardData';

export default function ReservationTable() {
  const navigate = useNavigate();

  return (
    <TableSection>
      <TableHeader>
        <SectionTitle>최근 예약 내역</SectionTitle>
        <ViewAllBtn onClick={() => navigate('/seller/reservations')}>
          전체보기 <ChevronIcon />
        </ViewAllBtn>
      </TableHeader>

      <Table>
        <THead>
          <TR>
            <TH $width="180px">예약자</TH>
            <TH>상품명</TH>
            <TH $width="200px">이용 날짜</TH>
            <TH $width="160px">결제 금액</TH>
            <TH $width="140px" $center>상태</TH>
          </TR>
        </THead>
        <TBody>
          {RECENT_RESERVATIONS.map((row, idx) => (
            <TR key={row.id} $hoverable>
              <TD>
                <GuestCell>
                  <GuestAvatar $bg={INITIAL_COLORS[idx % INITIAL_COLORS.length]}>
                    {row.guestInitial}
                  </GuestAvatar>
                  <GuestName>{row.guestName}</GuestName>
                </GuestCell>
              </TD>
              <TD><ProductName>{row.productName}</ProductName></TD>
              <TD><DateText>{row.date}</DateText></TD>
              <TD><AmountText>{row.amount}</AmountText></TD>
              <TD $center>
                <StatusBadge
                  $bg={STATUS_MAP[row.status].bg}
                  $color={STATUS_MAP[row.status].color}
                >
                  {STATUS_MAP[row.status].label}
                </StatusBadge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </TableSection>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#244c54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ── Styled Components ── */

const TableSection = styled.div`
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid #f8fafc;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: #244c54;
`;

const ViewAllBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #244c54;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.7;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background: #f2f4f6;
`;

const TBody = styled.tbody``;

const TR = styled.tr`
  border-top: ${({ $hoverable }) => ($hoverable ? '1px solid #f8fafc' : 'none')};
  transition: background 0.1s;

  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const TH = styled.th`
  padding: 16px 32px;
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};
  font-size: 10px;
  font-weight: 500;
  color: #41484a;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;

const TD = styled.td`
  padding: 18px 32px;
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};
  vertical-align: middle;
`;

const GuestCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GuestAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: white;
  flex-shrink: 0;
`;

const GuestName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #191c1e;
`;

const ProductName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #191c1e;
`;

const DateText = styled.span`
  font-size: 16px;
  color: #64748b;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const AmountText = styled.span`
  font-size: 16px;
  color: #191c1e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3.5px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;
