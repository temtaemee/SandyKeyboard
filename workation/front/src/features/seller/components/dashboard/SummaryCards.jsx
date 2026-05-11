// src/features/seller/components/dashboard/SummaryCards.jsx
import styled from 'styled-components';
import { SUMMARY_CARDS } from '../../data/dashboardData';

const ICONS = {
  wallet: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d646c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="17" cy="15" r="1" fill="#3d646c" />
    </svg>
  ),
  calendar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d646c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  star: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d646c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  receipt: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d646c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
};

const BADGE_STYLE = {
  green:  { bg: '#f0fdf4', color: '#16a34a' },
  blue:   { bg: '#eff6ff', color: '#2563eb' },
  orange: { bg: '#fff7ed', color: '#ea580c' },
  link:   { bg: 'transparent', color: '#244c54', underline: true },
};

export default function SummaryCards() {
  return (
    <Grid>
      {SUMMARY_CARDS.map((card) => (
        <Card key={card.id}>
          <CardShadow />
          <CardTop>
            <IconBg>{ICONS[card.icon]}</IconBg>
            <Badge
              $bg={BADGE_STYLE[card.badge.color].bg}
              $color={BADGE_STYLE[card.badge.color].color}
              $underline={BADGE_STYLE[card.badge.color].underline}
            >
              {card.badge.text}
            </Badge>
          </CardTop>
          <CardLabel>{card.label}</CardLabel>
          <CardValue>{card.value}</CardValue>
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
  position: relative;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardShadow = styled.div`
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  pointer-events: none;
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const IconBg = styled.div`
  width: 46px;
  height: 40px;
  background: linear-gradient(135deg, #e0f5f8 0%, #f6e5ba 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 10px;
  letter-spacing: 1px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  text-decoration: ${({ $underline }) => ($underline ? 'underline' : 'none')};
  cursor: ${({ $underline }) => ($underline ? 'pointer' : 'default')};
`;

const CardLabel = styled.p`
  font-size: 10px;
  font-weight: 500;
  color: #41484a;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-top: 13px;
`;

const CardValue = styled.p`
  font-size: 24px;
  color: #3d646c;
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1.4;
`;
