// src/features/seller/pages/SellerDashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DollarSign, CalendarDays, Star, Building2, ChevronRight } from 'lucide-react';
import { spaceApi } from '../api/spaceApi';
import { salesApi } from '../api/salesApi';
import { reservationApi } from '../api/reservationApi';
import { sellerReviewApi } from '../api/reviewApi';

/* ── 지역 라벨 맵 ── */
const AREA_LABEL = {
  SEOUL: '서울', GYEONGGI: '경기', GANGWON: '강원',
  CHUNGNAM: '충남', CHUNGBUK: '충북', GYEONGNAM: '경남',
  GYEONGBOOK: '경북', JEONNAM: '전남', JEONBUK: '전북', JEJU: '제주',
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getSpaceStatusBadge(space) {
  if (space.adminHidden)                         return { label: '비노출 처리', color: '#f97316' };
  if (space.approvalStatus === 'PENDING')         return { label: '승인 대기중', color: '#f59e0b' };
  if (space.approvalStatus === 'REJECTED')        return { label: '반려됨',     color: '#ef4444' };
  if (space.approvalStatus === 'APPROVED' && space.approvedAt) {
    const elapsed = Date.now() - new Date(space.approvedAt).getTime();
    if (elapsed < SEVEN_DAYS_MS)                 return { label: '승인 완료',   color: '#10b981' };
  }
  return null;
}

const formatLocation = (area, address1) => {
  const label = AREA_LABEL[area] ?? area;
  if (!address1) return label;
  const district = address1.trim().split(/\s+/)[1] ?? '';
  return district ? `${label} · ${district}` : label;
};

/* ── 임시 더미 데이터 (매출/예약/리뷰 API 연동 전까지 사용) ── */

const CHART_DATA = [
  { month: '12월', height: 96 },
  { month: '1월', height: 128 },
  { month: '2월', height: 112 },
  { month: '3월', height: 160 },
  { month: '4월', height: 208, highlight: true },
  { month: '5월', height: 180 },
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

/* ── 스타일 상수 ── */

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

const STATUS_MAP = {
  confirmed: { label: '예약확정', bg: '#dcfce7', color: '#15803d' },
  pending:   { label: '대기중',   bg: '#ffedd5', color: '#c2410c' },
  cancelled: { label: '취소됨',   bg: '#fee2e2', color: '#b91c1c' },
};

/* ── 컴포넌트 ── */

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const [spaces, setSpaces]           = useState([]);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [spacesError, setSpacesError] = useState(false);
  const [togglingIds, setTogglingIds] = useState(new Set());
  const [toastMsg, setToastMsg]       = useState(null);

  // 실제 API 연동 통계
  const [salesSummary, setSalesSummary]     = useState(null);
  const [resvTotal, setResvTotal]           = useState(null);
  const [reviewCount, setReviewCount]       = useState(null);
  const [recentResvs, setRecentResvs]       = useState([]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      // 공간 목록
      try {
        const spacesRes = await spaceApi.getMySpaces();
        setSpaces(spacesRes.data.map((s) => ({
          id: s.id, name: s.name,
          location: formatLocation(s.area, s.address1),
          visible: s.visibleYn === 'Y',
          approvalStatus: s.approvalStatus,
          approvedAt: s.approvedAt,
          adminHidden: s.adminHidden,
        })));
      } catch (e) {
        console.error('공간 목록 로딩 실패', e);
        setSpacesError(true);
      } finally {
        setSpacesLoading(false);
      }

      // 매출 요약
      try {
        const res = await salesApi.getSummary();
        setSalesSummary(res.data);
      } catch { setSalesSummary(null); }

      // 예약 건수
      try {
        const res = await reservationApi.getList({ pno: 0 });
        setResvTotal(res.data?.totalElements ?? 0);
        setRecentResvs((res.data?.content ?? []).slice(0, 5));
      } catch { setResvTotal(0); }

      // 리뷰 수
      try {
        const res = await sellerReviewApi.getCount();
        setReviewCount(res.data?.count ?? 0);
      } catch { setReviewCount(0); }
    };
    load();
  }, []);

  const toggleVisible = async (id) => {
    if (togglingIds.has(id)) return;
    const target = spaces.find((s) => s.id === id);
    if (!target) return;
    if (target.adminHidden) { showToast('관리자가 비노출 처리한 공간입니다. 관리자에게 문의하세요.'); return; }
    if (!target.visible && target.approvalStatus !== 'APPROVED') { showToast('승인 완료 후 노출할 수 있습니다.'); return; }
    const nextYn = target.visible ? 'N' : 'Y';

    setTogglingIds((prev) => new Set(prev).add(id));
    setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
    try {
      await spaceApi.toggleVisible(id, nextYn);
    } catch (e) {
      setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, visible: target.visible } : s)));
      showToast('노출 상태 변경에 실패했습니다. 다시 시도해 주세요.');
      console.error('노출 상태 변경 실패', e);
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const fmtWon = (n) => n != null ? `₩${Number(n).toLocaleString()}` : '-';
  const statCards = [
    {
      id: 1, label: '누적 순매출',
      value: salesSummary ? fmtWon(salesSummary.totalNetSales) : '-',
      icon: 'revenue', to: '/seller/sales',
    },
    {
      id: 2, label: '전체 예약',
      value: resvTotal != null ? `${resvTotal}건` : '-',
      icon: 'calendar', to: '/seller/reservations',
    },
    {
      id: 3, label: '받은 리뷰',
      value: reviewCount != null ? `${reviewCount}건` : '-',
      icon: 'star', to: '/seller/reviews',
    },
    {
      id: 4, label: '등록 공간',
      value: spacesLoading ? '-' : spacesError ? '-' : `${spaces.length}개`,
      icon: 'building', to: '/seller/spaces',
    },
  ];

  return (
    <>
      {toastMsg && <Toast>{toastMsg}</Toast>}

      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitle>대시보드</PageTitle>
        <PageSub>실시간 예약 현황 및 매출 요약</PageSub>
      </PageHeader>

      {/* 통계 카드 */}
      <StatGrid>
        {statCards.map((card) => {
          const { el, bg } = STAT_ICON[card.icon];
          return (
            <StatCard key={card.id} onClick={() => navigate(card.to)}>
              <CardTop>
                <IconBg $bg={bg}>{el}</IconBg>
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
            {spacesLoading ? (
              <SpaceLoadingMsg>불러오는 중...</SpaceLoadingMsg>
            ) : spacesError ? (
              <SpaceErrorMsg>공간 목록을 불러오지 못했습니다.</SpaceErrorMsg>
            ) : spaces.length === 0 ? (
              <SpaceEmptyMsg>등록된 공간이 없습니다</SpaceEmptyMsg>
            ) : (
              spaces.map((space) => {
                const statusBadge = getSpaceStatusBadge(space);
                const toggleBlocked = space.adminHidden || space.approvalStatus !== 'APPROVED';
                return (
                  <SpaceItem key={space.id}>
                    <SpaceIcon>{space.name[0]}</SpaceIcon>
                    <SpaceInfo onClick={() => navigate(`/seller/spaces/${space.id}`)}>
                      <SpaceName>{space.name}</SpaceName>
                      <SpaceLoc>{space.location}</SpaceLoc>
                      {statusBadge && (
                        <SpaceStatusBadge $color={statusBadge.color}>{statusBadge.label}</SpaceStatusBadge>
                      )}
                    </SpaceInfo>
                    <Toggle
                      $on={space.visible}
                      $loading={togglingIds.has(space.id)}
                      $blocked={toggleBlocked}
                      onClick={() => toggleVisible(space.id)}
                      disabled={togglingIds.has(space.id)}
                    >
                      <ToggleThumb $on={space.visible} />
                    </Toggle>
                  </SpaceItem>
                );
              })
            )}
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
            {recentResvs.length === 0 ? (
              <Tr>
                <Td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                  예약 내역이 없습니다
                </Td>
              </Tr>
            ) : recentResvs.map((r) => {
              const s = STATUS_MAP[r.status] ?? { label: r.statusLabel ?? r.status, bg: '#f1f5f9', color: '#64748b' };
              return (
                <Tr key={r.id}>
                  <Td><ResvId>#{r.id}</ResvId></Td>
                  <Td>{r.primaryGuestName ?? '-'}</Td>
                  <Td>{r.spaceName ?? '-'} / {r.stayName ?? '-'}</Td>
                  <Td>{r.checkinDate ?? '-'}</Td>
                  <Td>{r.checkoutDate ?? '-'}</Td>
                  <Td><Amount>₩{Number(r.totalPrice ?? 0).toLocaleString()}</Amount></Td>
                  <Td>
                    <StatusBadge $bg={s.bg} $color={s.color}>{s.label}</StatusBadge>
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
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-color: ${ACCENT};
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

const SpaceLoadingMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 24px;
  text-align: center;
`;

const SpaceEmptyMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 32px 24px;
  text-align: center;
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

const SpaceStatusBadge = styled.span`
  display: inline-block;
  margin-top: 3px;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 999px;
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
`;

const Toggle = styled.button`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? ACCENT : '#e2e8f0')};
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s;
  opacity: ${({ $loading }) => ($loading ? 0.5 : 1)};
  cursor: ${({ $loading, $blocked }) => ($loading || $blocked ? 'not-allowed' : 'pointer')};
  opacity: ${({ $blocked }) => ($blocked ? 0.5 : 1)};
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
  transition: color 0.15s, border-color 0.15s;
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

const SpaceErrorMsg = styled.p`
  font-size: 13px;
  color: #b91c1c;
  padding: 32px 24px;
  text-align: center;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  animation: fadein 0.2s ease;
  @keyframes fadein {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
`;
