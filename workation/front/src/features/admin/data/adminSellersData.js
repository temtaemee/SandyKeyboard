// src/features/admin/data/adminSellersData.js

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */

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
  },
  {
    id: 'ST-20260315',
    name: '해변의 정원',
    sellerName: '박지후',
    businessNo: '345-67-89012',
    phone: '010-5555-4444',
    joinedAt: '2026.03.15',
    transactions: 230,
    status: 'stopped',
  },
  {
    id: 'ST-20260420',
    name: '포레스트 캠핑',
    sellerName: '최수아',
    businessNo: '456-78-90123',
    phone: '010-7777-8888',
    joinedAt: '2026.04.20',
    transactions: 45,
    status: 'active',
  },
];

/* ── 고객 계정 목데이터 ── */
export const CUSTOMER_LIST = [
  { id: 'USR-001', name: '강다은', email: 'daeun.kang@example.com', phone: '010-1111-2222', joinDate: '2023-02-10', resvCount: 14, status: 'active' },
  { id: 'USR-002', name: '윤지오', email: 'jio.yoon@example.com', phone: '010-2222-3333', joinDate: '2023-04-25', resvCount: 6, status: 'active' },
  { id: 'USR-003', name: '서하준', email: 'hajun.seo@example.com', phone: '010-3333-4444', joinDate: '2023-06-14', resvCount: 2, status: 'stopped' },
  { id: 'USR-004', name: '김도연', email: 'doyeon.kim@example.com', phone: '010-4444-5555', joinDate: '2023-08-30', resvCount: 9, status: 'active' },
  { id: 'USR-005', name: '이나영', email: 'nayoung.lee@example.com', phone: '010-5555-6666', joinDate: '2023-11-05', resvCount: 3, status: 'active' },
  { id: 'USR-006', name: '박성민', email: 'sungmin.park@example.com', phone: '010-6666-7777', joinDate: '2026-03-10', resvCount: 1, status: 'active' },
  { id: 'USR-007', name: '조현우', email: 'hyunwoo.jo@example.com', phone: '010-7777-8888', joinDate: '2026-04-07', resvCount: 0, status: 'stopped' },
  { id: 'USR-008', name: '신예진', email: 'yejin.shin@example.com', phone: '010-8888-9999', joinDate: '2026-05-01', resvCount: 5, status: 'active' },
];
