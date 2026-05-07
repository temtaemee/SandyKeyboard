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
    sub: '현재 등록됨',
    badge: { text: '856 개', color: 'blue' },
    icon: 'space',
  },
  {
    id: 3,
    label: '신규 예약',
    value: '342',
    sub: '최근 24시간 기준',
    badge: { text: '활성', color: 'orange' },
    icon: 'reservation',
  },
  {
    id: 4,
    label: '전체 판매자',
    value: '2,891',
    sub: '인증된 파트너',
    badge: { text: '+58', color: 'purple' },
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

export const SYSTEM_ALERTS = [
  {
    id: 1,
    color: '#3b82f6',
    title: '신규 파트너 입점 신청',
    desc: '제주 워케이션 센터에서 입점 신청서를 제출했습니다.',
    time: '10분 전',
  },
  {
    id: 2,
    color: '#f97316',
    title: '예약 결제 오류 발생',
    desc: 'ID: guest_8829 결제 과정에서 PG사 응답 지연이 발생했습니다.',
    time: '25분 전',
  },
  {
    id: 3,
    color: '#14b8a6',
    title: '정기 점검 완료',
    desc: '데이터베이스 인덱스 최적화 작업이 정상적으로 종료되었습니다.',
    time: '1시간 전',
  },
];

export const ADMIN_ACTIVITY_LOGS = [
  {
    id: '#LOG-29401',
    adminInitials: 'SJ',
    adminName: '김선주',
    avatarBg: '#a5cdd6',
    avatarColor: '#3d646c',
    action: '수수료율 업데이트',
    target: '파트너: Sea Breeze Resort',
    datetime: '2023.10.24 14:22:11',
    status: 'success',
  },
  {
    id: '#LOG-29399',
    adminInitials: 'JW',
    adminName: '이진우',
    avatarBg: '#a6cdd5',
    avatarColor: '#43686f',
    action: '사용자 계정 삭제',
    target: 'ID: user_vivid99',
    datetime: '2023.10.24 13:05:45',
    status: 'success',
  },
  {
    id: '#LOG-29395',
    adminInitials: 'HM',
    adminName: '박한민',
    avatarBg: '#c4c7c7',
    avatarColor: '#5b5f5f',
    action: '환불 처리',
    target: '예약 ID: #RE-90211',
    datetime: '2023.10.24 11:42:30',
    status: 'pending',
  },
  {
    id: '#LOG-29392',
    adminInitials: 'SJ',
    adminName: '김선주',
    avatarBg: '#a5cdd6',
    avatarColor: '#3d646c',
    action: '시스템 설정 변경',
    target: 'API 게이트웨이 설정',
    datetime: '2023.10.24 10:15:12',
    status: 'failed',
  },
];

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
