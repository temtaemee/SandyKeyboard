// src/features/admin/data/adminSpacesData.js

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */

export const SPACES_TOTAL = 1284;
export const SPACES_TOTAL_PAGES = 12;

export const PENDING_SPACES = [
  {
    id: 101,
    name: '남해 힐링 펜션',
    location: '경상남도 남해군',
    seller: '남해바다사랑',
    price: '₩120,000',
    registeredAt: '2023.11.20',
    thumbnail: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=80&h=60&fit=crop',
    status: 'pending',
  },
  {
    id: 102,
    name: '부산 해운대 요트 스테이',
    location: '부산광역시 해운대구',
    seller: '요트클럽부산',
    price: '₩450,000',
    registeredAt: '2023.11.21',
    thumbnail: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=80&h=60&fit=crop',
    status: 'pending',
  },
];

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
