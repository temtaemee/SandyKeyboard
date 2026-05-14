import styled from 'styled-components';
import { Store } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { isNewMember } from '../../data/adminSellersConstants';

export default function SellersTable({ sellers, isSuspended, onToggleClick }) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>상호명</TH>
          <TH $width="80px">판매자명</TH>
          <TH $width="140px">사업자번호</TH>
          <TH $width="150px">연락처</TH>
          <TH $width="110px">가입일</TH>
          <TH $width="90px">거래 건수</TH>
          <TH $width="60px">신규</TH>
          <TH $width="80px">상태</TH>
          <TH $width="90px">활동정지</TH>
        </TR>
      </THead>
      <TBody>
        {sellers.map((seller) => {
          const sus = isSuspended(seller);
          return (
            <TR key={seller.id} $hoverable>
              <TD>
                <SellerCell>
                  <SellerIconWrap><StoreIcon /></SellerIconWrap>
                  <SellerInfo>
                    <SellerName>{seller.name}</SellerName>
                    <SellerId><IdDots />{seller.id}</SellerId>
                  </SellerInfo>
                </SellerCell>
              </TD>
              <TD><SellerPersonName>{seller.sellerName}</SellerPersonName></TD>
              <TD><BusinessNoText>{seller.businessNo}</BusinessNoText></TD>
              <TD><PhoneText>{seller.phone}</PhoneText></TD>
              <TD><DateText>{seller.joinedAt}</DateText></TD>
              <TD><TransactionText>{seller.transactions.toLocaleString()}</TransactionText></TD>
              <TD>{isNewMember(seller.joinedAt) && <NewBadge>NEW</NewBadge>}</TD>
              <TD>
                <StatusBadge $bg={sus ? '#fee2e2' : '#dcfce7'} $color={sus ? '#b91c1c' : '#15803d'}>
                  {sus ? '정지됨' : '활동 중'}
                </StatusBadge>
              </TD>
              <TD>
                <ToggleRow onClick={() => onToggleClick(seller, sus)}>
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

/* ── Icons ── */
function StoreIcon() { return <Store size={16} color="#475569" strokeWidth={1.8} />; }
function IdDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 1.5, marginRight: 5, verticalAlign: 'middle' }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ width: 3, height: 9, borderRadius: 1, background: i < 3 ? '#94a3b8' : '#e2e8f0', display: 'inline-block' }} />
      ))}
    </span>
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

const SellerCell = styled.div`display: flex; align-items: center; gap: 12px;`;
const SellerIconWrap = styled.div`
  width: 38px; height: 38px;
  border-radius: 8px; background: #f1f5f9;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
`;
const SellerInfo = styled.div`display: flex; flex-direction: column; gap: 3px;`;
const SellerName = styled.span`font-size: 13px; font-weight: 600; color: #0d1c2e;`;
const SellerId = styled.span`
  font-size: 11px; color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex; align-items: center;
`;

const SellerPersonName = styled.span`font-size: 13px; font-weight: 500; color: #334155; white-space: nowrap;`;
const BusinessNoText = styled.span`font-size: 12px; color: #475569; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; letter-spacing: 0.3px;`;
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
