// src/features/admin/components/dashboard/SellersStatCards.jsx
//
// 판매자/고객 관리 페이지 상단 통계 카드 4개.
// 이전에는 숫자·라벨이 컴포넌트 안에 하드코딩되어 있었으나,
// adminSellersData.js 의 SELLER_STAT_CARDS / CUSTOMER_STAT_CARDS 를 사용하도록 변경.
// 서버 연동 시 해당 데이터 파일의 value 값만 교체하면 됨.

import styled from 'styled-components';
import { Users, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { SELLER_STAT_CARDS, CUSTOMER_STAT_CARDS } from '../../data/adminSellersData';

// icon 문자열 → 컴포넌트 매핑
// $active prop: 선택된 카드이면 true (아이콘 색이 white로 바뀜)
const ICON_MAP = {
  sellers: ({ $active }) => <Users      size={18} color={$active ? '#ffffff' : '#1e293b'} />,
  active:  ({ $active }) => <CheckCircle size={18} color={$active ? '#ffffff' : '#10b981'} />,
  stopped: ({ $active }) => <XCircle    size={18} color={$active ? '#ffffff' : '#ef4444'} />,
  new:     ({ $active }) => <UserPlus   size={18} color={$active ? '#ffffff' : '#f59e0b'} />,
};

export default function SellersStatCards({ view, filter, onFilterChange }) {
  // view에 따라 카드 데이터 선택
  const cards = view === 'seller' ? SELLER_STAT_CARDS : CUSTOMER_STAT_CARDS;

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
