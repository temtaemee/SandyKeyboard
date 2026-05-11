// src/features/seller/data/dashboardData.js
// 대시보드 더미 데이터 - API 연동 시 이 파일의 데이터를 교체하세요

export const SUMMARY_CARDS = [
  {
    id: 1,
    label: '이번 달 총 매출',
    value: '₩12,850,000',
    badge: { text: '+12.5%', color: 'green' },
    icon: 'wallet',
  },
  {
    id: 2,
    label: '예약 건수',
    value: '142건',
    badge: { text: '신규 8건', color: 'blue' },
    icon: 'calendar',
  },
  {
    id: 3,
    label: '평균 평점',
    value: '4.9 / 5.0',
    badge: { text: '상위 5%', color: 'orange' },
    icon: 'star',
  },
  {
    id: 4,
    label: '정산 예정 금액',
    value: '₩4,230,000',
    badge: { text: '상세보기', color: 'link' },
    icon: 'receipt',
  },
];

export const CHART_DATA = {
  2023: [
    { month: '1월', value: 6200000 },
    { month: '2월', value: 5800000 },
    { month: '3월', value: 7100000 },
    { month: '4월', value: 6500000 },
    { month: '5월', value: 8200000 },
    { month: '6월', value: 7600000 },
  ],
  2024: [
    { month: '1월', value: 8100000 },
    { month: '2월', value: 7500000 },
    { month: '3월', value: 9800000 },
    { month: '4월', value: 9200000 },
    { month: '5월', value: 12850000 },
    { month: '6월', value: 11000000 },
  ],
};

export const RECENT_RESERVATIONS = [
  {
    id: 1,
    guestName: '김철수',
    guestInitial: '김',
    productName: '바다 전망 디럭스 룸',
    date: '2024.05.28 - 05.30',
    amount: '₩340,000',
    status: 'confirmed',
  },
  {
    id: 2,
    guestName: '이영희',
    guestInitial: '이',
    productName: '해변 앞 서핑 레슨',
    date: '2024.05.29',
    amount: '₩85,000',
    status: 'completed',
  },
  {
    id: 3,
    guestName: '박지민',
    guestInitial: '박',
    productName: '루프탑 바비큐 패키지',
    date: '2024.06.01',
    amount: '₩120,000',
    status: 'pending',
  },
  {
    id: 4,
    guestName: '최유나',
    guestInitial: '최',
    productName: '스탠다드 가든 뷰',
    date: '2024.06.05 - 06.07',
    amount: '₩280,000',
    status: 'confirmed',
  },
  {
    id: 5,
    guestName: '정우성',
    guestInitial: '정',
    productName: '프라이빗 요트 투어',
    date: '2024.05.27',
    amount: '₩500,000',
    status: 'cancelled',
  },
];

export const SELLER_NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', path: '/seller/dashboard', icon: 'grid' },
  { id: 'sales', label: '매출 분석', path: '/seller/sales', icon: 'chart' },
  { id: 'spaces', label: '숙소 관리', path: '/seller/spaces', icon: 'home' },
  { id: 'reservations', label: '예약 관리', path: '/seller/reservations', icon: 'bookmark' },
  { id: 'settings', label: '설정', path: '/seller/settings', icon: 'settings' },
];

export const STATUS_MAP = {
  confirmed: { label: '예약확정', bg: '#c0eaf3', color: '#244c54' },
  completed: { label: '이용완료', bg: '#eceef0', color: '#41484a' },
  pending:   { label: '결제대기', bg: '#c3e7ff', color: '#094c67' },
  cancelled: { label: '취소요청', bg: '#ffdad6', color: '#ba1a1a' },
};

export const INITIAL_COLORS = [
  '#3d646c', '#5b8fa8', '#7b9ea6', '#4a7c88',
  '#6b8e99', '#3a6b78', '#527d8a', '#2d5c6a',
];
