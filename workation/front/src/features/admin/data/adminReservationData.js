// src/features/admin/data/adminReservationData.js

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */
export const RESERVATION_STAT_CARDS = [
  {
    id: 1,
    label: '이번 달 예약',
    value: '1,284',
    badge: { text: '+12%', color: 'green' },
  },
  {
    id: 2,
    label: '결제 취소',
    value: '₩42.5M',
    badge: { text: '-2%', color: 'red' },
  },
];

export const RESERVATION_LIST = [
  {
    id: '#RSV-2931',
    customerName: '김민수',
    customerInitial: '김',
    customerEmail: 'minsu.k@example.com',
    spaceName: '오션블루 스위트',
    date: '2023.10.15\n10:18',
    amount: '₩780,000',
    status: 'confirmed',
    avatarColor: '#a5cdd6',
  },
  {
    id: '#RSV-2932',
    customerName: '박지원',
    customerInitial: 'P',
    customerEmail: 'jiwon.p@nexus.inc',
    spaceName: '포레스트 캐빈 102',
    date: '2023.10.20\n12:22',
    amount: '₩420,000',
    status: 'waiting',
    avatarColor: '#c3edf6',
  },
  {
    id: '#RSV-2935',
    customerName: '이서연',
    customerInitial: '이',
    customerEmail: 'sy.lee@designco.kr',
    spaceName: '시티뷰 펜트하우스',
    date: '2023.10.25\n15:30',
    amount: '₩1,250,000',
    status: 'cancelled',
    avatarColor: '#d4b8e0',
  },
];

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */
export const RESERVATION_STATUS_MAP = {
  confirmed: { label: '예약확정', bg: '#dcfce7', color: '#15803d' },
  waiting:   { label: '대기',     bg: '#fef9c3', color: '#a16207' },
  cancelled: { label: '취소',     bg: '#fee2e2', color: '#b91c1c' },
};

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */
export const PARTNER_COMPANIES = [
  {
    id: 1,
    name: 'Nexus Technologies',
    reservationCount: 8,
    status: 'active',
    iconBg: '#e0f2fe',
    iconColor: '#0369a1',
  },
  {
    id: 2,
    name: 'Creative Studio Lab',
    reservationCount: 3,
    status: 'active',
    iconBg: '#f0fdf4',
    iconColor: '#15803d',
  },
];
