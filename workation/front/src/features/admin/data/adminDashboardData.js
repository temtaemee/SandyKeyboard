// src/features/admin/data/adminDashboardData.js

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */

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
    status: 'paid',
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
