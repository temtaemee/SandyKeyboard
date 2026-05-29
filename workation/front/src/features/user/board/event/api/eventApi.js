import api from '../../../../../app/api/axios';

// ================================
// 이벤트 API 주소
// ================================

const PUBLIC_EVENT = '/public/events';

// ─────────────────────────────────────────
// Event API (이벤트 API)
// ─────────────────────────────────────────

/**
 * 이벤트 목록 조회
 */
export const getEventList = () =>
  api.get(PUBLIC_EVENT).then((res) => res.data);

/**
 * 이벤트 상세 조회
 *
 * id : 이벤트 번호
 */
export const getEventDetail = (id) =>
  api.get(`${PUBLIC_EVENT}/${id}`).then((res) => res.data);
