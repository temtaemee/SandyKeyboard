// src/features/admin/data/adminDashboardData.js

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */

export const ADMIN_STAT_CARDS = [
  {
    id: 1,
    label: '총 매출액',
    value: '₩142,500,000',
    sub: '',
    badge: { text: '+12.5%', color: 'green' },
    icon: 'revenue',
  },
  {
    id: 2,
    label: '활성 숙소 수',
    value: '1,248',
    sub: '',
    badge: { text: '856 개', color: 'blue' },
    icon: 'space',
  },
  {
    id: 3,
    label: '신규 고객 수',
    value: '342',
    sub: '최근 3개월 기준',
    badge: { text: '급증', color: 'orange' },
    icon: 'reservation',
  },
  {
    id: 4,
    label: '전체 판매자',
    value: '2,891',
    sub: '',
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

export const ADMIN_CHART_DATA_12M = [
  { month: '7월', height: 88 },
  { month: '8월', height: 104 },
  { month: '9월', height: 136 },
  { month: '10월', height: 152 },
  { month: '11월', height: 120 },
  { month: '12월', height: 160 },
  { month: '1월', height: 128 },
  { month: '2월', height: 176 },
  { month: '3월', height: 144 },
  { month: '4월', height: 224, highlight: true },
  { month: '5월', height: 192 },
  { month: '6월', height: 240 },
];

export const REGIONAL_SALES_DATA = [
  { rank: 1, region: '서울', amount: '₩64,400,000' },
  { rank: 2, region: '제주', amount: '₩42,800,000' },
  { rank: 3, region: '부산', amount: '₩31,200,000' },
  { rank: 4, region: '경기', amount: '₩28,500,000' },
  { rank: 5, region: '강원', amount: '₩19,100,000' },
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
    status: 'paid',
  },
];

/* ── 관리 활동 내역 목데이터 ── */
export const ADMIN_ACTIVITY_LOGS = [
  {
    id: 'ACT-20230520-001',
    avatarBg: '#dbeafe',
    avatarColor: '#1d4ed8',
    adminInitials: '김',
    adminName: '김관리자',
    action: '숙소 승인 처리',
    target: '오션 브리즈 리조트 #SP-1024',
    datetime: '2023.05.20 14:30',
    status: 'success',
  },
  {
    id: 'ACT-20230520-002',
    avatarBg: '#dcfce7',
    avatarColor: '#15803d',
    adminInitials: '이',
    adminName: '이담당자',
    action: '판매자 계정 정지',
    target: '포레스트 캠핑 (ID: MB-2041)',
    datetime: '2023.05.20 13:15',
    status: 'success',
  },
  {
    id: 'ACT-20230520-003',
    avatarBg: '#fef9c3',
    avatarColor: '#a16207',
    adminInitials: '박',
    adminName: '박슈퍼바이저',
    action: '정산 승인 요청',
    target: '마운틴 뷰 빌라 정산 ST-20230520',
    datetime: '2023.05.20 11:50',
    status: 'pending',
  },
  {
    id: 'ACT-20230520-004',
    avatarBg: '#fee2e2',
    avatarColor: '#b91c1c',
    adminInitials: '최',
    adminName: '최어드민',
    action: '쿠폰 일괄 발급',
    target: '신규 가입 웰컴 쿠폰 (대상 342명)',
    datetime: '2023.05.20 10:05',
    status: 'failed',
  },
];

/* ── 알림 목데이터 ── */
export const NOTIFICATIONS = [
  { id: 1, type: 'warning', title: '긴급 정산 지연 건 발생', desc: 'ST-20231115 해변의 정원 — 3일 이상 지연 중', time: '방금 전', unread: true },
  { id: 2, type: 'info', title: '신규 판매자 가입 승인 요청', desc: '포레스트 캠핑 외 2건 승인 대기 중입니다.', time: '12분 전', unread: true },
  { id: 3, type: 'info', title: '이달 신규 고객 급증 알림', desc: '이번 달 신규 가입자가 342명으로 전달 대비 12% 증가했습니다.', time: '1시간 전', unread: true },
  { id: 4, type: 'success', title: '숙소 승인 처리 완료', desc: '오션 브리즈 리조트 신규 등록이 승인되었습니다.', time: '3시간 전', unread: false },
  { id: 5, type: 'info', title: '시스템 점검 예정 안내', desc: '2024.06.01 02:00 ~ 04:00 정기 점검이 예정되어 있습니다.', time: '어제', unread: false },
];
