// src/features/admin/data/adminSalesData.js

/* ==========================================
   [MOCK DATA] 서버 연결 시 삭제/대체 필요
   ========================================== */

export const SALES_STAT_CARDS = [
  {
    id: 1,
    label: '이번달 정산 완료 금액',
    value: '₩42,850,000',
    badge: '+8.4%',
    trend: 'up',
  },
  {
    id: 2,
    label: '이번달 정산 건수',
    value: '142건',
    progress: 68,
  },
  {
    id: 3,
    label: '이번달 수수료 총액',
    value: '₩4,285,000',
    sub: '평균 수수료율 10.0% 적용',
  },
];

export const MONTHLY_CHART_DATA = [
  { month: '1월', count: 85,  highlight: false },
  { month: '2월', count: 98,  highlight: false },
  { month: '3월', count: 110, highlight: false },
  { month: '4월', count: 142, highlight: true  },
  { month: '5월', count: 126, highlight: false },
];

export const TOP5_SETTLEMENTS = [
  { rank: 1, name: '프리미엄 호텔 평통', date: '05.15', amount: '₩12,450,000' },
  { rank: 2, name: '그랜드 시티 부산',   date: '05.14', amount: '₩9,820,000'  },
  { rank: 3, name: '스타 리조트 제주',   date: '05.10', amount: '₩7,110,000'  },
  { rank: 4, name: '어반 스테이 강남',   date: '05.08', amount: '₩5,890,000'  },
  { rank: 5, name: '포레스트 빌라 가평', date: '05.06', amount: '₩4,320,000'  },
];

export const URGENT_ALERTS = [
  {
    id: 'ST-202405018',
    type: 'review',
    label: '심사하기',
    labelColor: 'gray',
    title: 'ST-202405018',
    desc: '카피 앤 워크 강릉 | 3일 후기',
    urgent: true,
  },
  {
    id: 'alert-02',
    type: 'confirm',
    label: '공지확인',
    labelColor: 'dark',
    title: '운행 정산 오류 안내',
    desc: '(14:00~16:00)',
    urgent: false,
  },
];

export const PENDING_LIST = [
  {
    id: 'ST-202405025',
    seller: '오피스파크 서울',
    dueDate: '2024.05.20',
    amount: '₩2,450,000',
    settlementStatus: 'completed',
    approvalStatus: 'approved',
  },
  {
    id: 'ST-202405024',
    seller: '제주 서핑 스테이',
    dueDate: '2024.05.19',
    amount: '₩1,120,000',
    settlementStatus: 'pending',
    approvalStatus: 'approved',
  },
  {
    id: 'ST-202405018',
    seller: '커피 앤 워크 강릉',
    dueDate: '2024.05.15',
    amount: '₩860,000',
    settlementStatus: 'rejected',
    approvalStatus: 'resubmit',
  },
];
