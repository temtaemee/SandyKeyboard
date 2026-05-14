// src/features/admin/data/adminReservationConstants.js

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

export const RESERVATION_STATUS_MAP = {
  confirmed: { label: '예약확정', bg: '#dcfce7', color: '#15803d' },
  waiting:   { label: '대기',     bg: '#fef9c3', color: '#a16207' },
  cancelled: { label: '취소',     bg: '#fee2e2', color: '#b91c1c' },
};

/* ── 페이지 설정값 ── */
export const TOTAL_RESERVATIONS = 1284;
export const TOTAL_PAGES = 3;
