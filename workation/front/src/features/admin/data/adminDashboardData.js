// src/features/admin/data/adminDashboardData.js

export const ADMIN_STAT_CARDS = [
  {
    id: 1,
    label: '총 매출액',
    value: '₩142.5M',
    sub: '전월 대비',
    badge: { text: '+12.5%', color: 'green' },
    icon: 'revenue',
  },
  {
    id: 2,
    label: '활성 숙소 수',
    value: '1,248',
    sub: '전체 등록된 숙소',
    badge: { text: '856 개', color: 'blue' },
    icon: 'space',
  },
  {
    id: 3,
    label: '신규 고객 수',
    value: '342',
    sub: '최근 24시간 기준',
    badge: { text: '급증', color: 'orange' },
    icon: 'reservation',
  },
  {
    id: 4,
    label: '전체 판매자',
    value: '2,891',
    sub: '인증된 파트너',
    badge: { text: '+3.2%', color: 'purple' },
    icon: 'seller',
  },
];

export const ADMIN_CHART_DATA = [
  { month: '1월', height: 128 },
  { month: '2월', height: 176 },
  { month: '3월', height: 144 },
  { month: '4월', height: 224, highlight: true },
  { month: '5월', height: 192 },
  { month: '6월', height: 240 },
];

export const REGIONAL_SALES_DATA = [
  { rank: 1, region: '서울', amount: '₩64.4M' },
  { rank: 2, region: '제주', amount: '₩42.8M' },
  { rank: 3, region: '부산', amount: '₩31.2M' },
  { rank: 4, region: '경기', amount: '₩28.5M' },
];

export const RECENT_PAYMENTS = [
  {
    id: '#ORD-20230520-01',
    buyer: '김민준',
    product: '오션 브리즈 리조트',
    amount: '₩420,000',
    datetime: '2023.05.20 14:30',
    status: 'paid',
  },
  {
    id: '#ORD-20230520-02',
    buyer: '이서윤',
    product: '마운틴 뷰 빌라',
    amount: '₩312,000',
    datetime: '2023.05.20 13:15',
    status: 'paid',
  },
  {
    id: '#ORD-20230520-03',
    buyer: '박지후',
    product: '어반 시티 호텔',
    amount: '₩285,000',
    datetime: '2023.05.20 12:45',
    status: 'pending',
  },
  {
    id: '#ORD-20230520-04',
    buyer: '최수아',
    product: '포레스트 캠핑',
    amount: '₩194,000',
    datetime: '2023.05.20 11:20',
    status: 'paid',
  },
  {
    id: '#ORD-20230520-05',
    buyer: '정우전',
    product: '오션 브리즈 리조트',
    amount: '₩420,000',
    datetime: '2023.05.20 10:05',
    status: 'refunded',
  },
  {
    id: '#ORD-20230520-06',
    buyer: '한소희',
    product: '마운틴 뷰 빌라',
    amount: '₩312,000',
    datetime: '2023.05.20 09:40',
    status: 'shipping',
  },
];

export const PAYMENT_STATUS_MAP = {
  paid:     { label: '결제완료', bg: '#dcfce7', color: '#15803d' },
  pending:  { label: '결제대기', bg: '#ffedd5', color: '#c2410c' },
  refunded: { label: '환불완료', bg: '#fee2e2', color: '#b91c1c' },
  shipping: { label: '배송중',   bg: '#dbeafe', color: '#1d4ed8' },
};

export const ADMIN_NAV_ITEMS = [
  { id: 'dashboard',    label: '대시보드',      path: '/admin/dashboard',    icon: 'grid' },
  { id: 'spaces',       label: '숙소 관리',      path: '/admin/spaces',       icon: 'home' },
  { id: 'reservations', label: '예약/기업 관리', path: '/admin/reservations', icon: 'bookmark' },
  { id: 'sellers',      label: '판매자 관리',    path: '/admin/sellers',      icon: 'users' },
  { id: 'board',        label: '게시판 관리',    path: '/admin/board',        icon: 'file' },
  { id: 'sales',        label: '정산/매출',      path: '/admin/sales',        icon: 'coin' },
];

export const STATUS_MAP = {
  success: { label: '성공', bg: '#dcfce7', color: '#15803d' },
  pending: { label: '대기', bg: '#ffedd5', color: '#c2410c' },
  failed:  { label: '실패', bg: '#fee2e2', color: '#b91c1c' },
};
