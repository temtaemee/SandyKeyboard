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

export const SELLER_NOTIFICATIONS = [
  { id: 1, type: 'reservation', title: '새 예약이 들어왔습니다',   desc: '모래 덮인 키보드 / 스탠다드룸',  time: '방금 전',  unread: true  },
  { id: 2, type: 'review',      title: '새 리뷰가 등록되었습니다', desc: '제주 오션뷰 워크 ★★★★☆',        time: '10분 전',  unread: true  },
  { id: 3, type: 'cancel',      title: '예약이 취소되었습니다',   desc: '숲속 힐링 스테이 / 패밀리룸',    time: '1시간 전', unread: false },
];

export const SELLER_NOTIF_TYPE_COLOR = {
  reservation: '#3ec9a7',
  review:      '#f59e0b',
  cancel:      '#ef4444',
};
