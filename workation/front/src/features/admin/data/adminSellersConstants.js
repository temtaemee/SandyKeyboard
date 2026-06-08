// src/features/admin/data/adminSellersConstants.js

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

export const SELLER_STATUS_MAP = {
  active:  { label: '활동 중', bg: '#dcfce7', color: '#15803d' },
  stopped: { label: '정지됨',  bg: '#fee2e2', color: '#b91c1c' },
};

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

