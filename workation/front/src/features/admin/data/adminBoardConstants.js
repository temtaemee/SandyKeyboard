// src/features/admin/data/adminBoardConstants.js

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

export const BOARD_TABS = ['공지사항', 'FAQ', '리뷰', '이벤트', '쿠폰'];

export const POST_STATUS_MAP = {
  published: { label: '게시중',   bg: '#dcfce7', color: '#15803d' },
  ended:     { label: '게시종료', bg: '#f1f5f9', color: '#475569' },
  draft:     { label: '임시저장', bg: '#fef9c3', color: '#a16207' },
};
