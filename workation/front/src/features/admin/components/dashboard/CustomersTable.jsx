import styled from 'styled-components';
import { AVATAR_COLORS, isNewMember } from '../../data/adminSellersConstants';
import Toggle from '../common/Toggle'; // 활성/정지 토글 공통 컴포넌트

export default function CustomersTable({ customers, isSuspended, onToggleClick, onRowClick }) {
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
            <TR key={customer.id} $hoverable $clickable onClick={() => onRowClick?.(customer)}>
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
                {/* 행 클릭(모달 열기)과 토글 클릭이 겹치지 않도록 stopPropagation */}
                <Toggle
                  on={sus}
                  onClick={(e) => { e.stopPropagation(); onToggleClick(customer, sus); }}
                  onLabel="정지"
                  offLabel="활성"
                />
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
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
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

// Toggle 스타일은 components/common/Toggle.jsx 에서 관리
