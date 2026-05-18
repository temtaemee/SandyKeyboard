import styled from 'styled-components';
import { AVATAR_COLORS, isNewMember } from '../../data/adminSellersConstants';

export default function CustomersTable({ customers, isSuspended, onToggleClick }) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>고객 ID</TH>
          <TH>이름</TH>
          <TH>이메일</TH>
          <TH $width="140px">전화번호</TH>
          <TH $width="120px">가입일</TH>
          <TH $width="90px">총 예약</TH>
          <TH $width="60px">신규</TH>
          <TH $width="90px">활동정지</TH>
        </TR>
      </THead>
      <TBody>
        {customers.map((customer, i) => {
          const sus = isSuspended(customer);
          return (
            <TR key={customer.id} $hoverable>
              <TD><AccountId>{customer.id}</AccountId></TD>
              <TD>
                <NameCell>
                  <Avatar $bg={AVATAR_COLORS[i % AVATAR_COLORS.length]}>{customer.name[0]}</Avatar>
                  {customer.name}
                </NameCell>
              </TD>
              <TD><EmailText>{customer.email}</EmailText></TD>
              <TD><PhoneText>{customer.phone}</PhoneText></TD>
              <TD><DateText>{customer.joinDate}</DateText></TD>
              <TD><TransactionText>{customer.resvCount}건</TransactionText></TD>
              <TD>{isNewMember(customer.joinDate) && <NewBadge>NEW</NewBadge>}</TD>
              <TD>
                <ToggleRow onClick={() => onToggleClick(customer, sus)}>
                  <ToggleTrack $on={sus}><ToggleThumb $on={sus} /></ToggleTrack>
                  <ToggleLabel $on={sus}>{sus ? '정지' : '활성'}</ToggleLabel>
                </ToggleRow>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}

/* ── Styled Components ── */
const Table = styled.table`width: 100%; border-collapse: collapse;`;
const THead = styled.thead`background: #f8fafc; border-bottom: 1px solid #f1f5f9;`;
const TBody = styled.tbody``;
const TR = styled.tr`
  border-top: ${({ $hoverable }) => ($hoverable ? '1px solid #f1f5f9' : 'none')};
  transition: background 0.1s;
  &:hover { background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')}; }
`;
const TH = styled.th`
  padding: 11px 24px; text-align: left;
  font-size: 11px; font-weight: 600; color: #64748b;
  letter-spacing: 0.4px; white-space: nowrap;
  width: ${({ $width }) => $width || 'auto'};
`;
const TD = styled.td`padding: 14px 24px; vertical-align: middle;`;

const AccountId = styled.span`font-size: 12px; font-weight: 600; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif;`;
const NameCell = styled.div`display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: #0d1c2e;`;
const Avatar = styled.div`
  width: 30px; height: 30px; border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #244c54; flex-shrink: 0;
`;
const EmailText = styled.span`font-size: 12px; color: #64748b;`;
const PhoneText = styled.span`
  font-size: 13px; color: #475569;
  font-family: 'Plus Jakarta Sans', sans-serif;
  white-space: nowrap;
`;
const DateText = styled.span`font-size: 12px; color: #94a3b8; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap;`;
const TransactionText = styled.span`font-size: 14px; font-weight: 700; color: #0d1c2e; font-family: 'Plus Jakarta Sans', sans-serif;`;

const NewBadge = styled.span`
  display: inline-block;
  padding: 2px 7px; border-radius: 999px;
  font-size: 10px; font-weight: 700;
  background: #fef3c7;
  color: #b45309;
  letter-spacing: 0.4px;
  white-space: nowrap;
`;

const ToggleRow = styled.div`
  display: flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none;
`;
const ToggleTrack = styled.div`
  width: 40px; height: 22px; border-radius: 999px;
  background: ${({ $on }) => ($on ? '#ef4444' : '#22c55e')};
  position: relative; transition: background 0.2s; flex-shrink: 0;
`;
const ToggleThumb = styled.div`
  position: absolute; top: 3px;
  left: ${({ $on }) => ($on ? '21px' : '3px')};
  width: 16px; height: 16px; border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: left 0.2s;
`;
const ToggleLabel = styled.span`
  font-size: 12px; font-weight: 500;
  color: ${({ $on }) => ($on ? '#dc2626' : '#16a34a')};
  min-width: 24px;
`;
