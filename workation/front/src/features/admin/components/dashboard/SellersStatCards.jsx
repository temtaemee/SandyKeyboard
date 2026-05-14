import styled from 'styled-components';
import { Users, CheckCircle, XCircle, UserPlus } from 'lucide-react';

export default function SellersStatCards({ view, filter, onFilterChange }) {
  return view === 'seller' ? (
    <StatsSection>
      <StatCard $active={filter === '전체'} onClick={() => onFilterChange('전체')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(30,41,59,0.08)"><SellersIcon /></StatIconWrap>
          <StatBadge $green>+2.4%</StatBadge>
        </StatCardTop>
        <StatLabel>전체 판매자</StatLabel>
        <StatValue>1,284</StatValue>
        <StatProgress $color="#1e293b" $width={100} />
      </StatCard>
      <StatCard $active={filter === '활동 중'} onClick={() => onFilterChange('활동 중')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(16,185,129,0.1)"><ActiveIcon /></StatIconWrap>
          <StatBadge $green>+4.2%</StatBadge>
        </StatCardTop>
        <StatLabel>활동 중</StatLabel>
        <StatValue>1,270</StatValue>
        <StatProgress $color="#10b981" $width={99} />
      </StatCard>
      <StatCard $active={filter === '정지됨'} onClick={() => onFilterChange('정지됨')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(239,68,68,0.08)"><StoppedIcon /></StatIconWrap>
          <StatBadge $red>-2.1%</StatBadge>
        </StatCardTop>
        <StatLabel>정지됨</StatLabel>
        <StatValue>14</StatValue>
        <StatProgress $color="#ef4444" $width={8} />
      </StatCard>
      <StatCard $active={filter === '신규'} onClick={() => onFilterChange('신규')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(245,158,11,0.1)"><NewSellerIcon /></StatIconWrap>
        </StatCardTop>
        <StatLabel>이달 신규</StatLabel>
        <StatValue>156</StatValue>
        <StatProgress $color="#f59e0b" $width={30} />
      </StatCard>
    </StatsSection>
  ) : (
    <StatsSection>
      <StatCard $active={filter === '전체'} onClick={() => onFilterChange('전체')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(59,130,246,0.1)"><SellersIcon /></StatIconWrap>
        </StatCardTop>
        <StatLabel>전체 고객</StatLabel>
        <StatValue>8,420</StatValue>
        <StatProgress $color="#3b82f6" $width={100} />
      </StatCard>
      <StatCard $active={filter === '활동 중'} onClick={() => onFilterChange('활동 중')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(16,185,129,0.1)"><ActiveIcon /></StatIconWrap>
          <StatBadge $green>+3.1%</StatBadge>
        </StatCardTop>
        <StatLabel>활성 고객</StatLabel>
        <StatValue>8,180</StatValue>
        <StatProgress $color="#10b981" $width={97} />
      </StatCard>
      <StatCard $active={filter === '정지됨'} onClick={() => onFilterChange('정지됨')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(239,68,68,0.08)"><StoppedIcon /></StatIconWrap>
          <StatBadge $red>-0.8%</StatBadge>
        </StatCardTop>
        <StatLabel>활동정지</StatLabel>
        <StatValue>240</StatValue>
        <StatProgress $color="#ef4444" $width={3} />
      </StatCard>
      <StatCard $active={filter === '신규'} onClick={() => onFilterChange('신규')}>
        <StatCardTop>
          <StatIconWrap $bg="rgba(245,158,11,0.1)"><NewSellerIcon /></StatIconWrap>
        </StatCardTop>
        <StatLabel>이달 신규</StatLabel>
        <StatValue>342</StatValue>
        <StatProgress $color="#f59e0b" $width={25} />
      </StatCard>
    </StatsSection>
  );
}

/* ── Icons ── */
function SellersIcon() { return <Users size={18} color="#1e293b" />; }
function ActiveIcon() { return <CheckCircle size={18} color="#10b981" />; }
function StoppedIcon() { return <XCircle size={18} color="#ef4444" />; }
function NewSellerIcon() { return <UserPlus size={18} color="#f59e0b" />; }

/* ── Styled Components ── */
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid ${({ $active }) => ($active ? '#244c54' : '#e2e8f0')};
  border-radius: 10px;
  padding: 20px 22px 18px;
  box-shadow: ${({ $active }) => ($active ? '0 0 0 3px rgba(36,76,84,0.1)' : '0 1px 2px rgba(0,0,0,0.05)')};
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const StatCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const StatIconWrap = styled.div`
  width: 40px; height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex; align-items: center; justify-content: center;
`;

const StatBadge = styled.span`
  font-size: 11px; font-weight: 700;
  padding: 3px 8px; border-radius: 999px;
  background: ${({ $green, $red }) => $green ? '#f0fdf4' : $red ? '#fff1f1' : '#f8fafc'};
  color: ${({ $green, $red }) => $green ? '#16a34a' : $red ? '#dc2626' : '#64748b'};
`;

const StatLabel = styled.p`font-size: 12px; color: #64748b;`;
const StatValue = styled.p`
  font-size: 30px; font-weight: 700; color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px; line-height: 1.2;
`;

const StatProgress = styled.div`
  margin-top: 8px;
  height: 4px; border-radius: 999px;
  background: #f1f5f9;
  position: relative; overflow: hidden;
  &::after {
    content: '';
    position: absolute; left: 0; top: 0;
    height: 100%;
    width: ${({ $width }) => $width}%;
    background: ${({ $color }) => $color};
    border-radius: 999px;
  }
`;
