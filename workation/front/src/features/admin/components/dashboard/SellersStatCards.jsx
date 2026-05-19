import styled from 'styled-components';
import { Users, CheckCircle, XCircle, UserPlus } from 'lucide-react';

export default function SellersStatCards({ view, filter, onFilterChange }) {
  return view === 'seller' ? (
    <StatsSection>
      <StatCard $active={filter === '전체'} onClick={() => onFilterChange('전체')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '전체' ? 'rgba(255,255,255,0.2)' : 'rgba(30,41,59,0.08)'}><SellersIcon $active={filter === '전체'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '전체'}>전체 판매자</StatLabel>
        <StatValue $active={filter === '전체'}>1,284</StatValue>
      </StatCard>
      <StatCard $active={filter === '활동 중'} onClick={() => onFilterChange('활동 중')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '활동 중' ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.1)'}><ActiveIcon $active={filter === '활동 중'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '활동 중'}>활동 중</StatLabel>
        <StatValue $active={filter === '활동 중'}>1,270</StatValue>
      </StatCard>
      <StatCard $active={filter === '정지됨'} onClick={() => onFilterChange('정지됨')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '정지됨' ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.08)'}><StoppedIcon $active={filter === '정지됨'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '정지됨'}>정지됨</StatLabel>
        <StatValue $active={filter === '정지됨'}>14</StatValue>
      </StatCard>
      <StatCard $active={filter === '신규'} onClick={() => onFilterChange('신규')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '신규' ? 'rgba(255,255,255,0.2)' : 'rgba(245,158,11,0.1)'}><NewSellerIcon $active={filter === '신규'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '신규'}>이달 신규</StatLabel>
        <StatValue $active={filter === '신규'}>156</StatValue>
      </StatCard>
    </StatsSection>
  ) : (
    <StatsSection>
      <StatCard $active={filter === '전체'} onClick={() => onFilterChange('전체')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '전체' ? 'rgba(255,255,255,0.2)' : 'rgba(59,130,246,0.1)'}><SellersIcon $active={filter === '전체'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '전체'}>전체 고객</StatLabel>
        <StatValue $active={filter === '전체'}>8,420</StatValue>
      </StatCard>
      <StatCard $active={filter === '활동 중'} onClick={() => onFilterChange('활동 중')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '활동 중' ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.1)'}><ActiveIcon $active={filter === '활동 중'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '활동 중'}>활성 고객</StatLabel>
        <StatValue $active={filter === '활동 중'}>8,180</StatValue>
      </StatCard>
      <StatCard $active={filter === '정지됨'} onClick={() => onFilterChange('정지됨')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '정지됨' ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.08)'}><StoppedIcon $active={filter === '정지됨'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '정지됨'}>활동정지</StatLabel>
        <StatValue $active={filter === '정지됨'}>240</StatValue>
      </StatCard>
      <StatCard $active={filter === '신규'} onClick={() => onFilterChange('신규')}>
        <StatCardTop>
          <StatIconWrap $bg={filter === '신규' ? 'rgba(255,255,255,0.2)' : 'rgba(245,158,11,0.1)'}><NewSellerIcon $active={filter === '신규'} /></StatIconWrap>
        </StatCardTop>
        <StatLabel $active={filter === '신규'}>이달 신규</StatLabel>
        <StatValue $active={filter === '신규'}>342</StatValue>
      </StatCard>
    </StatsSection>
  );
}

/* ── Icons ── */
function SellersIcon({ $active }) { return <Users size={18} color={$active ? '#ffffff' : '#1e293b'} />; }
function ActiveIcon({ $active }) { return <CheckCircle size={18} color={$active ? '#ffffff' : '#10b981'} />; }
function StoppedIcon({ $active }) { return <XCircle size={18} color={$active ? '#ffffff' : '#ef4444'} />; }
function NewSellerIcon({ $active }) { return <UserPlus size={18} color={$active ? '#ffffff' : '#f59e0b'} />; }

/* ── Styled Components ── */
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const StatCard = styled.div`
  background: ${({ $active }) => ($active ? 'linear-gradient(135deg, #244c54 0%, #2d6470 100%)' : 'white')};
  border: 2px solid ${({ $active }) => ($active ? '#244c54' : '#e2e8f0')};
  border-radius: 10px;
  padding: 20px 22px 18px;
  box-shadow: ${({ $active }) => ($active ? '0 6px 20px rgba(36,76,84,0.35)' : '0 1px 2px rgba(0,0,0,0.05)')};
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $active }) => ($active ? '0 8px 24px rgba(36,76,84,0.4)' : '0 4px 12px rgba(0,0,0,0.1)')};
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


const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ $active }) => ($active ? 'rgba(255,255,255,0.75)' : '#64748b')};
`;
const StatValue = styled.p`
  font-size: 30px; font-weight: 700;
  color: ${({ $active }) => ($active ? '#ffffff' : '#0d1c2e')};
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px; line-height: 1.2;
`;

