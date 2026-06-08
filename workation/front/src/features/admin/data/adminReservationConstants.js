// src/features/admin/data/adminReservationConstants.js

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

export const RESERVATION_STATUS_MAP = {
  PAYMENT_COMPLETED: { label: '대기', bg: '#fef9c3', color: '#a16207' },
  RESERVED: { label: '예약 확정', bg: '#dcfce7', color: '#15803d' },
  COMPLETED: { label: '이용 완료', bg: '#e0f2fe', color: '#0369a1' },
  USER_CANCELLED: { label: '사용자 취소', bg: '#fee2e2', color: '#b91c1c' },
  SELLER_CANCELLED: { label: '판매자 취소', bg: '#fee2e2', color: '#b91c1c' },
  REFUND_COMPLETED: { label: '환불 완료', bg: '#fce7f3', color: '#9d174d' },
};
