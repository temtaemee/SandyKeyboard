// src/features/admin/data/adminSellersData.js

/* ── 쿠폰 발급 템플릿 (관리자 UI에서 고객에게 발급 시 사용) ── */
export const COUPON_TEMPLATES = [
  { id: 'TPL-01', title: '첫 예약 10% 할인',       discount: '10%',     validDays: 30 },
  { id: 'TPL-02', title: '주중 숙박 ₩50,000 할인', discount: '₩50,000', validDays: 60 },
  { id: 'TPL-03', title: '제주 지역 한정 15% 할인', discount: '15%',     validDays: 45 },
  { id: 'TPL-04', title: '신규 가입 웰컴 쿠폰',     discount: '20%',     validDays: 14 },
  { id: 'TPL-05', title: '재방문 감사 ₩30,000 할인',discount: '₩30,000', validDays: 90 },
];
