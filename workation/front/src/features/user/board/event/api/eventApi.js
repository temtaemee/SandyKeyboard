import api from '../../../../../app/api/axios';

const PUBLIC_EVENT = '/public/events';
const PUBLIC_COUPON = '/public/coupon';
const USER_COUPON = '/user/coupon';

// ─────────────────────────────────────────
// Event API
// ─────────────────────────────────────────

export const getEventList = () => api.get(PUBLIC_EVENT).then((res) => res.data);

export const getEventDetail = (id) =>
  api.get(`${PUBLIC_EVENT}/${id}`).then((res) => res.data);

// ─────────────────────────────────────────
// Coupon API
// ─────────────────────────────────────────

// 쿠폰 단건 조회 (이벤트 페이지에서 쿠폰 정보 표시용)
// GET /api/public/coupon/{couponId}
export const getCouponDetail = (couponId) =>
  api.get(`${PUBLIC_COUPON}/${couponId}`).then((res) => res.data);

// 쿠폰 발급 (로그인한 사용자)
// POST /api/user/coupon/{couponId}
export const receiveCoupon = (couponId) =>
  api.post(`${USER_COUPON}/${couponId}`).then((res) => res.data);
