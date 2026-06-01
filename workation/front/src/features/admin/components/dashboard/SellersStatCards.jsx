// src/features/admin/components/dashboard/SellersStatCards.jsx
import styled from 'styled-components';
import { Users, CheckCircle, XCircle, UserPlus } from 'lucide-react';

const ICON_MAP = {
  sellers: ({ $active }) => <Users      size={18} color={$active ? '#ffffff' : '#1e293b'} />,
  active:  ({ $active }) => <CheckCircle size={18} color={$active ? '#ffffff' : '#10b981'} />,
  stopped: ({ $active }) => <XCircle    size={18} color={$active ? '#ffffff' : '#ef4444'} />,
  new:     ({ $active }) => <UserPlus   size={18} color={$active ? '#ffffff' : '#f59e0b'} />,
};

/**
 * @param {string}   view           - 'seller' | 'customer'
 * @param {string}   filter         - 현재 선택된 필터키
 * @param {function} onFilterChange - 필터 변경 핸들러
 * @param {object}   stats          - { total, active, stopped, new } — 백엔드 실데이터
 */
export default function SellersStatCards({ view, filter, onFilterChange, stats = {} }) {
  const { total = 0, active = 0, stopped = 0, new: newCount = 0 } = stats;

  const sellerCards = [
    { filterKey: '전체',   label: '전체 판매자', value: total.toLocaleString(),   icon: 'sellers', iconBg: 'rgba(30,41,59,0.08)'  },
    { filterKey: '활동 중', label: '활동 중',    value: active.toLocaleString(),   icon: 'active',  iconBg: 'rgba(16,185,129,0.1)' },
    { filterKey: '정지됨', label: '정지됨',     value: stopped.toLocaleString(),  icon: 'stopped', iconBg: 'rgba(239,68,68,0.08)'  },
    { filterKey: '신규',   label: '신규',       value: newCount.toLocaleString(), icon: 'new',     iconBg: 'rgba(245,158,11,0.1)'  },
  ];

  const customerCards = [
    { filterKey: '전체',   label: '전체 고객', value: total.toLocaleString(),   icon: 'sellers', iconBg: 'rgba(59,130,246,0.1)'  },
    { filterKey: '활동 중', label: '활성 고객', value: active.toLocaleString(),   icon: 'active',  iconBg: 'rgba(16,185,129,0.1)' },
    { filterKey: '정지됨', label: '활동정지',  value: stopped.toLocaleString(),  icon: 'stopped', iconBg: 'rgba(239,68,68,0.08)'  },
    { filterKey: '신규',   label: '신규 고객', value: newCount.toLocaleString(), icon: 'new',     iconBg: 'rgba(245,158,11,0.1)', sub: '최근 3개월 기준' },
  ];

  const cards = view === 'seller' ? sellerCards : customerCards;

  return (
    <StatsSection>
      {cards.map((card) => {
        const isActive = filter === card.filterKey;
        const Icon = ICON_MAP[card.icon];

        return (
          <StatCard key={card.filterKey} $active={isActive} onClick={() => onFilterChange(card.filterKey)}>
            <StatCardTop>
              <StatIconWrap $bg={isActive ? 'rgba(255,255,255,0.2)' : card.iconBg}>
                <Icon $active={isActive} />
              </StatIconWrap>
            </StatCardTop>
            <StatLabel $active={isActive}>{card.label}</StatLabel>
            <StatValue $active={isActive}>{card.value}</StatValue>
            {card.sub && <StatSub $active={isActive}>{card.sub}</StatSub>}
          </StatCard>
        );
      })}
    </StatsSection>
  );
}

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
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ $active }) => ($active ? 'rgba(255,255,255,0.75)' : '#64748b')};
`;

const StatValue = styled.p`
  font-size: 30px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? '#ffffff' : '#0d1c2e')};
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const StatSub = styled.p`
  font-size: 11px;
  color: ${({ $active }) => ($active ? 'rgba(255,255,255,0.6)' : '#94a3b8')};
  margin-top: 2px;
`;
