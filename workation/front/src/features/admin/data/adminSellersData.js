// src/features/admin/data/adminSellersData.js

export const SELLERS_STAT_CARDS = [
  {
    id: 1,
    label: '전체 판매자',
    value: '1,284',
    badge: { text: '+2.4%', color: 'green' },
    icon: 'sellers',
    progressColor: '#1e293b',
    progress: 100,
  },
  {
    id: 2,
    label: '활동 중',
    value: '1,270',
    badge: { text: '+4.2%', color: 'green' },
    icon: 'active',
    progressColor: '#10b981',
    progress: 99,
  },
  {
    id: 3,
    label: '정지됨',
    value: '14',
    badge: { text: '-2.1%', color: 'red' },
    icon: 'stopped',
    progressColor: '#ef4444',
    progress: 1,
  },
  {
    id: 4,
    label: '이달 신규',
    value: '156',
    badge: null,
    icon: 'new',
    progressColor: '#f59e0b',
    progress: 12,
  },
];

export const SELLER_STATUS_MAP = {
  active:  { label: '활동 중', bg: '#dcfce7', color: '#15803d' },
  stopped: { label: '정지됨',  bg: '#fee2e2', color: '#b91c1c' },
};

export const CATEGORY_ICONS = {
  '숙박/호텔':   'hotel',
  '공유오피스':  'office',
  '카페/식음료': 'cafe',
  '캠핑/글램핑': 'camping',
};

export const SELLERS_LIST = [
  {
    id: 'ST-20231024',
    name: '스테이 제주 본점',
    sellerName: '김민준',
    businessNo: '123-45-67890',
    phone: '010-1234-5678',
    joinedAt: '2023.10.24',
    transactions: 1420,
    status: 'active',
    isNew: false,
  },
  {
    id: 'ST-20231102',
    name: '워케이션 웍스',
    sellerName: '이서윤',
    businessNo: '234-56-78901',
    phone: '02-987-6543',
    joinedAt: '2023.11.02',
    transactions: 856,
    status: 'active',
    isNew: false,
  },
  {
    id: 'ST-20231115',
    name: '해변의 정원',
    sellerName: '박지후',
    businessNo: '345-67-89012',
    phone: '010-5555-4444',
    joinedAt: '2023.11.15',
    transactions: 230,
    status: 'stopped',
    isNew: true,
  },
  {
    id: 'ST-20231120',
    name: '포레스트 캠핑',
    sellerName: '최수아',
    businessNo: '456-78-90123',
    phone: '010-7777-8888',
    joinedAt: '2023.11.20',
    transactions: 45,
    status: 'active',
    isNew: true,
  },
];
