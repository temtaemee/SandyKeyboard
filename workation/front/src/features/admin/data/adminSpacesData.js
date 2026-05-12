// src/features/admin/data/adminSpacesData.js

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */
export const SPACES_STAT_CARDS = [
  {
    id: 1,
    label: '전체 숙소 수',
    value: '1,284',
    badge: { text: '+12%', color: 'green' },
    icon: 'space',
  },
  {
    id: 2,
    label: '운영 중인 숙소',
    value: '1,182',
    badge: { text: '92% 운영 중', color: 'blue' },
    icon: 'check',
  },
  {
    id: 3,
    label: '승인 대기 중',
    value: '24',
    badge: { text: '조치 필요', color: 'orange' },
    icon: 'alert',
  },
];

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */
export const SPACES_STATUS_MAP = {
  active:   { label: '운영중', bg: '#dcfce7', color: '#15803d' },
  stopped:  { label: '중지됨', bg: '#f1f5f9', color: '#475569' },
  pending:  { label: '대기중', bg: '#fef9c3', color: '#a16207' },
};

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */
export const SPACES_LIST = [
  {
    id: 1,
    name: '제주 오션빌라 라운지',
    location: '제주특별자치도 서귀포시',
    seller: '제주스테이 주식회사',
    price: '₩245,000',
    status: 'active',
    registeredAt: '2023.11.12',
    thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=80&h=60&fit=crop',
  },
  {
    id: 2,
    name: '서울 시티 타워 스위트',
    location: '서울특별시 중구',
    seller: '(주)호텔코리아',
    price: '₩420,000',
    status: 'active',
    registeredAt: '2023.11.10',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=60&fit=crop',
  },
  {
    id: 3,
    name: '양양 서프 스테이',
    location: '강원특별자치도 양양군',
    seller: '개인판매자(이바다)',
    price: '₩158,000',
    status: 'stopped',
    registeredAt: '2023.10.28',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=80&h=60&fit=crop',
  },
  {
    id: 4,
    name: '경주 한옥 고택',
    location: '경상북도 경주시',
    seller: '전통스테이 협동조합',
    price: '₩310,000',
    status: 'active',
    registeredAt: '2023.10.15',
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=80&h=60&fit=crop',
  },
  {
    id: 5,
    name: '평창 워터 마운틴뷰',
    location: '강원특별자치도 평창군',
    seller: '평창리조트밸리',
    price: '₩289,000',
    status: 'active',
    registeredAt: '2023.10.02',
    thumbnail: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=80&h=60&fit=crop',
  },
];
