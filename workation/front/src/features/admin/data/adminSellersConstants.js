// src/features/admin/data/adminSellersConstants.js

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

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

/* ── 페이지 설정값 ── */
export const TOTAL_PAGES = 3;
export const FILTER_TABS = ['전체', '활동 중', '정지됨', '신규'];
export const AVATAR_COLORS = ['#dbeafe','#dcfce7','#fef9c3','#fce7f3','#ede9fe','#ffedd5','#cffafe','#f1f5f9'];

/**
 * 가입일이 현재 기준 3개월 이내인지 확인 (신규 멤버 여부)
 */
export const isNewMember = (dateStr) => {
  if (!dateStr) return false;
  const joined = new Date(dateStr.replace(/\./g, '-'));
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 3);
  return joined >= cutoff;
};

/* ── 쿠폰 발급 템플릿 (관리자 UI에서 고객에게 발급 시 사용) ── */
export const COUPON_TEMPLATES = [
  { id: 'TPL-01', title: '첫 예약 10% 할인',       discount: '10%',     validDays: 30 },
  { id: 'TPL-02', title: '주중 숙박 ₩50,000 할인', discount: '₩50,000', validDays: 60 },
  { id: 'TPL-03', title: '제주 지역 한정 15% 할인', discount: '15%',     validDays: 45 },
  { id: 'TPL-04', title: '신규 가입 웰컴 쿠폰',     discount: '20%',     validDays: 14 },
  { id: 'TPL-05', title: '재방문 감사 ₩30,000 할인',discount: '₩30,000', validDays: 90 },
];
