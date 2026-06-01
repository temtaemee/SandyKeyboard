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
  // 예약
  RESERVATION_COMPLETE: '#3ec9a7',
  RESERVATION_CANCEL:   '#ef4444',
  RESERVATION_REMINDER: '#6366f1',
  // 결제/환불
  PAYMENT_SUCCESS:      '#10b981',
  PAYMENT_FAIL:         '#ef4444',
  REFUND_COMPLETE:      '#f59e0b',
  // 쿠폰
  COUPON_ISSUED:        '#8b5cf6',
  COUPON_EXPIRED:       '#94a3b8',
  // 리뷰
  REVIEW_REQUEST:       '#f59e0b',
  // 공간 심사
  SPACE_PENDING:        '#f59e0b',
  SPACE_APPROVED:       '#10b981',
  SPACE_REJECTED:       '#ef4444',
  SPACE_HIDDEN_BY_ADMIN: '#f97316',
  SPACE_VISIBLE_BY_ADMIN: '#3ec9a7',
};
