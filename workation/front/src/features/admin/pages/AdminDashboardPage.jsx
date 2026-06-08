// src/features/admin/pages/AdminDashboardPage.jsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Home,
  FileText,
  Wallet,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import useAdminDashboard from '../hooks/useAdminDashboard';

const NAV_CARD_CONFIG = [
  {
    id: 'reservations',
    path: '/admin/reservations',
    icon: Calendar,
    iconBg: 'rgba(59,130,246,0.1)',
    iconColor: '#2563eb',
    title: '예약/기업 관리',
    desc: '예약 현황 조회 및 기업 파트너 관리',
    statLabel: '이번 달 예약',
    statKey: 'thisMonthReservationCount',
    unit: '건',
  },
  {
    id: 'accounts',
    path: '/admin/accounts',
    icon: Users,
    iconBg: 'rgba(147,51,234,0.1)',
    iconColor: '#9333ea',
    title: '계정/판매자 관리',
    desc: '고객 및 판매자 계정 현황 관리',
    statLabel: '전체 판매자',
    statKey: 'totalSellers',
    unit: '명',
  },
  {
    id: 'spaces',
    path: '/admin/spaces',
    icon: Home,
    iconBg: 'rgba(37,99,235,0.08)',
    iconColor: '#2563eb',
    title: '숙소 관리',
    desc: '등록된 숙소 승인·노출·통계 관리',
    statLabel: '전체 숙소',
    statKey: 'activeSpaces',
    unit: '개',
  },
  {
    id: 'board',
    path: '/admin/board',
    icon: FileText,
    iconBg: 'rgba(20,184,166,0.1)',
    iconColor: '#0d9488',
    title: '게시판 관리',
    desc: '공지사항 · FAQ · 쿠폰 관리',
    statLabel: null,
    statKey: null,
  },
  {
    id: 'sales',
    path: '/admin/sales',
    icon: Wallet,
    iconBg: 'rgba(34,197,94,0.1)',
    iconColor: '#16a34a',
    title: '매출/정산 관리',
    desc: '월간 매출 트렌드 및 정산 현황',
    statLabel: '총 매출액',
    statKey: 'totalRevenue', // API 없음 — fallback mock 사용
  },
];

// 6열 그리드 기준 colStart 지정 (상단 3개: span 2, 하단 2개: 중앙 정렬)
const COL_START = [null, null, null, 2, 4];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { thisMonthReservationCount, totalSellers, activeSpaces } =
    useAdminDashboard();

  // 각 카드의 statValue를 실데이터 또는 fallback으로 결정
  const getStatValue = (card) => {
    if (!card.statKey) return null;
    if (card.statKey === 'thisMonthReservationCount') {
      return thisMonthReservationCount !== null
        ? `${thisMonthReservationCount.toLocaleString()}${card.unit}`
        : '—';
    }
    if (card.statKey === 'totalSellers') {
      return totalSellers !== null
        ? `${totalSellers.toLocaleString()}${card.unit}`
        : '—';
    }
    if (card.statKey === 'activeSpaces') {
      return activeSpaces !== null
        ? `${activeSpaces.toLocaleString()}${card.unit}`
        : '—';
    }
    if (card.statKey === 'totalRevenue') {
      // 총 매출액 API 미지원 — fallback mock값 적용
      return '₩142,500,000';
    }
    return '—';
  };

  return (
    <>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>대시보드</PageTitle>
          <PageSub>각 관리 영역의 현황을 한눈에 확인하고 바로 이동하세요.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      <NavCardGrid>
        {NAV_CARD_CONFIG.map((card, i) => {
          const Icon = card.icon;
          const statValue = getStatValue(card);
          return (
            <NavCard
              key={card.id}
              $colStart={COL_START[i]}
              onClick={() => navigate(card.path)}
            >
              <NavCardTop>
                <NavIconWrap $bg={card.iconBg}>
                  <Icon size={22} color={card.iconColor} strokeWidth={1.8} />
                </NavIconWrap>
                <ChevronRight size={15} color="#cbd5e1" />
              </NavCardTop>
              <NavTitle>{card.title}</NavTitle>
              <NavDesc>{card.desc}</NavDesc>
              {card.statLabel && (
                <NavStat>
                  <NavStatLabel>{card.statLabel}</NavStatLabel>
                  <NavStatValue>{statValue}</NavStatValue>
                </NavStat>
              )}
            </NavCard>
          );
        })}
      </NavCardGrid>
    </>
  );
}

/* ── Styled Components ── */

const PageHeader = styled.div``;

const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.24px;
  line-height: 1.33;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* 6열 그리드 — 상단 3개는 각 2칸, 하단 2개는 2칸씩 중앙 배치 */
const NavCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
`;

const NavCard = styled.div`
  grid-column: ${({ $colStart }) =>
    $colStart ? `${$colStart} / span 2` : 'span 2'};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
    border-color: ${({ theme }) => theme.colors.adminPrimary};
  }
`;

const NavCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const NavIconWrap = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.4;
`;

const NavDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

const NavStat = styled.div`
  margin-top: 10px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const NavStatLabel = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NavStatValue = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  letter-spacing: -0.4px;
`;
