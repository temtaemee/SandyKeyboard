// src/features/admin/components/dashboard/AdminStatCards.jsx
import styled from 'styled-components';
import { ADMIN_STAT_CARDS } from '../../data/adminDashboardData';
import { STAT_ICON_BG, STAT_BADGE_STYLE } from '../../data/adminDashboardConstants';
import { DollarSign, Home, Calendar, Users } from 'lucide-react';

const ICONS = {
  revenue:     <DollarSign size={28} color="#0d9488" strokeWidth={1.8} />,
  space:       <Home size={28} color="#2563eb" strokeWidth={1.8} />,
  reservation: <Calendar size={28} color="#ea580c" strokeWidth={1.8} />,
  seller:      <Users size={28} color="#9333ea" strokeWidth={1.8} />,
};


export default function AdminStatCards() {
  return (
    <Grid>
      {ADMIN_STAT_CARDS.map((card) => (
        <Card key={card.id}>
          <CardTop>
            <IconBg $bg={STAT_ICON_BG[card.icon]}>{ICONS[card.icon]}</IconBg>
            <Badge $bg={STAT_BADGE_STYLE[card.badge.color].bg} $color={STAT_BADGE_STYLE[card.badge.color].color}>
              {card.badge.text}
            </Badge>
          </CardTop>
          <CardLabel>{card.label}</CardLabel>
          <CardValue>{card.value}</CardValue>
          <CardSub>{card.sub}</CardSub>
        </Card>
      ))}
    </Grid>
  );
}

/* ── Styled Components ── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const IconBg = styled.div`
  width: 46px; height: 40px;
  background: ${({ $bg }) => $bg};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const CardLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding-top: 12px;
`;

const CardValue = styled.p`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.6px;
  line-height: 1.27;
  font-family: ${({ theme }) => theme.fonts.number};
`;

const CardSub = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  padding-top: 3px;
`;
