// src/features/admin/data/adminDashboardConstants.js

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

export const PAYMENT_STATUS_MAP = {
  paid: { label: '결제완료', bg: '#dcfce7', color: '#15803d' },
  pending: { label: '결제대기', bg: '#ffedd5', color: '#c2410c' },
  refunded: { label: '환불완료', bg: '#fee2e2', color: '#b91c1c' },
};

export const NOTIF_TYPE_COLOR = { warning: '#ef4444', info: '#3b82f6', success: '#16a34a' };

export const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', path: '/admin/dashboard', icon: 'chart' },
  {
    id: 'reservations',
    label: '예약/기업 관리',
    path: '/admin/reservations',
    icon: 'bookmark',
  },
  {
    id: 'accounts',
    label: '계정/판매자 관리',
    path: '/admin/accounts',
    icon: 'users',
  },
  { id: 'spaces', label: '숙소 관리', path: '/admin/spaces', icon: 'home' },
  { id: 'board', label: '게시판 관리', path: '/admin/board', icon: 'file' },
  { id: 'sales', label: '매출/정산 관리', path: '/admin/sales', icon: 'coin' },
];

export const STATUS_MAP = {
  success: { label: '성공', bg: '#dcfce7', color: '#15803d' },
  pending: { label: '대기', bg: '#ffedd5', color: '#c2410c' },
  failed: { label: '실패', bg: '#fee2e2', color: '#b91c1c' },
};

/* ── 대시보드 UI 스타일 상수 ── */
export const STAT_ICON_BG = {
  revenue: 'rgba(204,251,241,0.5)',
  space:   'rgba(219,234,254,0.5)',
  reservation: 'rgba(255,237,213,0.5)',
  seller:  'rgba(243,232,255,0.5)',
};

export const STAT_BADGE_STYLE = {
  green:  { bg: '#f0fdfa', color: '#0d9488' },
  blue:   { bg: '#eff6ff', color: '#2563eb' },
  orange: { bg: '#fff7ed', color: '#ea580c' },
  purple: { bg: '#faf5ff', color: '#9333ea' },
};

export const NAV_CARD_CONFIG = [
  {
    id: 'reservations',
    path: '/admin/reservations',
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
    iconBg: 'rgba(34,197,94,0.1)',
    iconColor: '#16a34a',
    title: '매출/정산 관리',
    desc: '월간 매출 트렌드 및 정산 현황',
    statLabel: '총 매출액',
    statKey: 'totalRevenue',
  },
];

// 6열 그리드 기준 colStart 지정 (상단 3개: span 2, 하단 2개: 중앙 정렬)
export const NAV_CARD_COL_START = [null, null, null, 2, 4];
