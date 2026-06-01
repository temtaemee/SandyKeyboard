export const SELLER_NAV_ITEMS = [
  { id: 'dashboard',   label: '대시보드',   path: '/seller',              icon: 'chart',    end: true },
  { id: 'space',       label: '공간 관리',  path: '/seller/spaces',       icon: 'building' },
  { id: 'stay',        label: '스테이 관리', path: '/seller/stays',        icon: 'bed' },
  { id: 'reservation', label: '예약 관리',  path: '/seller/reservations', icon: 'calendar' },
  { id: 'sales',       label: '매출 관리',  path: '/seller/sales',        icon: 'trending' },
  { id: 'settlement',  label: '정산 관리',  path: '/seller/settlements',  icon: 'credit' },
  { id: 'review',      label: '리뷰 관리',  path: '/seller/reviews',      icon: 'star' },
  { id: 'account',     label: '계정 관리',  path: '/seller/account',      icon: 'user' },
];


export const SELLER_NOTIF_TYPE_COLOR = {
  reservation: '#3ec9a7',
  review:      '#f59e0b',
  cancel:      '#ef4444',
};
