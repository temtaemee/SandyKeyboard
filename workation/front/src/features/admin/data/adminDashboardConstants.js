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
