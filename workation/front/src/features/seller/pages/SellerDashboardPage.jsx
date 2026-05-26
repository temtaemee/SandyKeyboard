// src/features/seller/pages/SellerDashboardPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  DollarSign,
  CalendarDays,
  Star,
  Building2,
  ChevronRight,
} from 'lucide-react';

/* ── Mock Data (서버 연결 시 삭제/대체 필요) ── */

const STAT_CARDS = [
  {
    id: 1,
    label: '이번달 매출',
    value: '₩4,820,000',
    badge: { text: '+12% 전월 대비', color: 'green' },
    icon: 'revenue',
  },
  {
    id: 2,
    label: '이번달 예약',
    value: '38건',
    badge: { text: '취소 2건 포함', color: 'orange' },
    icon: 'calendar',
  },
  {
    id: 3,
    label: '최근 리뷰',
    value: '12건',
    badge: { text: '미답변 3건', color: 'yellow' },
    icon: 'star',
  },
  {
    id: 4,
    label: '등록 공간',
    value: '3개',
    badge: { text: '스테이 9개', color: 'teal' },
    icon: 'building',
  },
];

const CHART_DATA = [
  { month: '12월', height: 96 },
  { month: '1월', height: 128 },
  { month: '2월', height: 112 },
  { month: '3월', height: 160 },
  { month: '4월', height: 208, highlight: true },
  { month: '5월', height: 180 },
];

const INITIAL_SPACES = [
  { id: 1, name: '모래 덮인 키보드', location: '서울 · 강남구', visible: true },
  {
    id: 2,
    name: '제주 오션뷰 워크',
    location: '제주 · 서귀포시',
    visible: true,
  },
  {
    id: 3,
    name: '숲속 힐링 스테이',
    location: '강원 · 평창군',
    visible: false,
  },
];

const RECENT_RESERVATIONS = [
  {
    id: '#RV-2405001',
    guest: '김지수',
    space: '모래 덮인 키보드',
    stay: '스탠다드룸',
    checkIn: '2025.05.10',
    checkOut: '2025.05.12',
    amount: '₩180,000',
    status: 'confirmed',
  },
  {
    id: '#RV-2405002',
    guest: '이민준',
    space: '제주 오션뷰 워크',
    stay: '오션뷰룸',
    checkIn: '2025.05.15',
    checkOut: '2025.05.17',
    amount: '₩320,000',
    status: 'confirmed',
  },
  {
    id: '#RV-2405003',
    guest: '박소연',
    space: '숲속 힐링 스테이',
    stay: '패밀리룸',
    checkIn: '2025.05.20',
    checkOut: '2025.05.22',
    amount: '₩420,000',
    status: 'pending',
  },
  {
    id: '#RV-2405004',
    guest: '최현우',
    space: '모래 덮인 키보드',
    stay: '디럭스룸',
    checkIn: '2025.05.08',
    checkOut: '2025.05.09',
    amount: '₩95,000',
    status: 'confirmed',
  },
  {
    id: '#RV-2405005',
    guest: '정예린',
    space: '제주 오션뷰 워크',
    stay: '스탠다드룸',
    checkIn: '2025.05.25',
    checkOut: '2025.05.27',
    amount: '₩240,000',
    status: 'cancelled',
  },
];

/* ── Style Constants ── */

const ACCENT = '#3ec9a7';

const STAT_ICON = {
  revenue: {
    el: <DollarSign size={28} color="#0d9488" strokeWidth={1.8} />,
    bg: 'rgba(204,251,241,0.5)',
  },
  calendar: {
    el: <CalendarDays size={28} color="#ea580c" strokeWidth={1.8} />,
    bg: 'rgba(255,237,213,0.5)',
  },
  star: {
    el: <Star size={28} color="#ca8a04" strokeWidth={1.8} />,
    bg: 'rgba(254,252,232,0.5)',
  },
  building: {
    el: <Building2 size={28} color="#0891b2" strokeWidth={1.8} />,
    bg: 'rgba(224,242,254,0.5)',
  },
};

const BADGE_STYLE = {
  green: { bg: '#f0fdfa', color: '#0d9488' },
  orange: { bg: '#fff7ed', color: '#ea580c' },
  yellow: { bg: '#fefce8', color: '#ca8a04' },
  teal: { bg: '#ecfeff', color: '#0891b2' },
};

const STATUS_MAP = {
  confirmed: { label: '예약확정', bg: '#dcfce7', color: '#15803d' },
  pending: { label: '대기중', bg: '#ffedd5', color: '#c2410c' },
  cancelled: { label: '취소됨', bg: '#fee2e2', color: '#b91c1c' },
};

/* ── Component ── */

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState(INITIAL_SPACES);

  const toggleVisible = (id) =>
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitle>대시보드</PageTitle>
        <PageSub>실시간 예약 현황 및 매출 요약</PageSub>
      </PageHeader>

      {/* 통계 카드 */}
      <StatGrid>
        {STAT_CARDS.map((card) => {
          const { el, bg } = STAT_ICON[card.icon];
          const badge = BADGE_STYLE[card.badge.color];
          return (
            <StatCard key={card.id}>
              <CardTop>
                <IconBg $bg={bg}>{el}</IconBg>
                <Badge $bg={badge.bg} $color={badge.color}>
                  {card.badge.text}
                </Badge>
              </CardTop>
              <CardLabel>{card.label}</CardLabel>
              <CardValue>{card.value}</CardValue>
            </StatCard>
          );
        })}
      </StatGrid>

      {/* 차트 + 공간 목록 */}
      <PanelGrid>
        {/* 월간 매출 트렌드 */}
        <ChartCard>
          <CardHeader>
            <CardTitleGroup>
              <CardTitle>월간 매출 트렌드</CardTitle>
              <CardSub>최근 6개월 결제 데이터 추이</CardSub>
            </CardTitleGroup>
          </CardHeader>

          <BarChart>
            <GridLines>
              {[0, 1, 2, 3].map((i) => (
                <GridLine key={i} />
              ))}
            </GridLines>
            <Bars>
              {CHART_DATA.map((d, i) => (
                <BarCol key={`${d.month}-${i}`}>
                  <Bar $height={d.height} $highlight={d.highlight} />
                  <BarLabel $highlight={d.highlight}>{d.month}</BarLabel>
                </BarCol>
              ))}
            </Bars>
          </BarChart>
        </ChartCard>

        {/* 내 공간 목록 */}
        <SpaceCard>
          <SpaceCardHeader>
            <CardTitleGroup>
              <CardTitle>내 공간 목록</CardTitle>
              <CardSub>노출 여부 빠른 설정</CardSub>
            </CardTitleGroup>
          </SpaceCardHeader>

          <SpaceList>
            {spaces.map((space) => (
              <SpaceItem key={space.id}>
                <SpaceIcon>{space.name[0]}</SpaceIcon>
                <SpaceInfo
                  onClick={() => navigate(`/seller/spaces/${space.id}`)}
                >
                  <SpaceName>{space.name}</SpaceName>
                  <SpaceLoc>{space.location}</SpaceLoc>
                </SpaceInfo>
                <Toggle
                  $on={space.visible}
                  onClick={() => toggleVisible(space.id)}
                >
                  <ToggleThumb $on={space.visible} />
                </Toggle>
              </SpaceItem>
            ))}
          </SpaceList>

          <SpaceCardFooter>
            <FooterBtn onClick={() => navigate('/seller/spaces')}>
              전체 공간 보기 &gt;
            </FooterBtn>
          </SpaceCardFooter>
        </SpaceCard>
      </PanelGrid>

      {/* 최근 예약 내역 */}
      <TableCard>
        <TableHeader>
          <CardTitleGroup>
            <CardTitle>최근 예약 내역</CardTitle>
            <CardSub>로그인한 셀러의 공간에 한해 조회</CardSub>
          </CardTitleGroup>
          <ViewAllBtn onClick={() => navigate('/seller/reservations')}>
            전체 보기 <ChevronRight size={14} />
          </ViewAllBtn>
        </TableHeader>

        <Table>
          <thead>
            <tr>
              <Th>예약번호</Th>
              <Th>예약자</Th>
              <Th>공간 / 스테이</Th>
              <Th>체크인</Th>
              <Th>체크아웃</Th>
              <Th>결제금액</Th>
              <Th>상태</Th>
            </tr>
          </thead>
          <tbody>
            {RECENT_RESERVATIONS.map((r) => {
              const s = STATUS_MAP[r.status];
              return (
                <Tr key={r.id}>
                  <Td>
                    <ResvId>{r.id}</ResvId>
                  </Td>
                  <Td>{r.guest}</Td>
                  <Td>
                    {r.space} / {r.stay}
                  </Td>
                  <Td>{r.checkIn}</Td>
                  <Td>{r.checkOut}</Td>
                  <Td>
                    <Amount>{r.amount}</Amount>
                  </Td>
                  <Td>
                    <StatusBadge $bg={s.bg} $color={s.color}>
                      {s.label}
                    </StatusBadge>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </TableCard>
    </>
  );
}

/* ── Styled Components ── */

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.4px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── Stat Cards ── */

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition:
    transform 0.2s,
    box-shadow 0.2s;
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
  width: 46px;
  height: 40px;
  background: ${({ $bg }) => $bg};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Badge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
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

/* ── Panel Grid ── */

const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const CardTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.4;
`;

const CardSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── Bar Chart ── */

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 25px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const BarChart = styled.div`
  position: relative;
  height: 300px;
  padding: 0 16px;
`;

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 1px;
`;

const GridLine = styled.div`
  width: 100%;
  border-top: 1px solid #f8fafc;
`;

const Bars = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 24px;
`;

const BarCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 48px;
`;

const Bar = styled.div`
  width: 100%;
  height: ${({ $height }) => $height}px;
  background: ${({ $highlight }) => ($highlight ? ACCENT : '#f1f5f9')};
  border-radius: 4px 4px 0 0;
  box-shadow: ${({ $highlight }) =>
    $highlight
      ? '0 10px 15px -3px rgba(62,201,167,0.2), 0 4px 6px -4px rgba(62,201,167,0.1)'
      : 'none'};
  transition: background 0.2s;
`;

const BarLabel = styled.span`
  font-size: 12px;
  font-weight: ${({ $highlight }) => ($highlight ? '700' : '600')};
  color: ${({ $highlight }) => ($highlight ? '#0d9488' : '#94a3b8')};
  letter-spacing: 0.6px;
`;

/* ── Space List ── */

const SpaceCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SpaceCardHeader = styled.div`
  padding: 24px 24px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const SpaceList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SpaceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child {
    border-bottom: none;
  }
`;

const SpaceIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #1c3442;
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SpaceInfo = styled.div`
  flex: 1;
  cursor: pointer;
  &:hover p:first-child {
    color: ${ACCENT};
  }
`;

const SpaceName = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  transition: color 0.15s;
  line-height: 1.4;
`;

const SpaceLoc = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const Toggle = styled.button`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? ACCENT : '#e2e8f0')};
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s;
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ $on }) => ($on ? '21px' : '3px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: left 0.2s;
`;

const SpaceCardFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: 16px 24px;
  text-align: right;
`;

const FooterBtn = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  transition: color 0.15s;
  &:hover {
    color: ${ACCENT};
  }
`;

/* ── Recent Reservations ── */

const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ViewAllBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-family: inherit;
  transition:
    color 0.15s,
    border-color 0.15s;
  &:hover {
    color: ${ACCENT};
    border-color: ${ACCENT};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const ResvId = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Amount = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-weight: 600;
`;

const StatusBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;
