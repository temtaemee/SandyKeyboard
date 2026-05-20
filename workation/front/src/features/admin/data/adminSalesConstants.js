// src/features/admin/data/adminSalesConstants.js

/* ==========================================
   [CONSTANTS] 서버 연결 후에도 유지 (UI 설정값)
   ========================================== */

export const SETTLEMENT_STATUS_MAP = {
  completed: { label: '정산완료', bg: '#dcfce7', color: '#15803d' },
  pending:   { label: '정산대기', bg: '#f1f5f9', color: '#475569' },
  rejected:  { label: '정산지연', bg: '#fee2e2', color: '#b91c1c' },
};

export const APPROVAL_STATUS_MAP = {
  approved: { label: '승인',   bg: '#1e293b', color: 'white'   },
  resubmit: { label: '재검토', bg: '#ef4444', color: 'white'   },
};
