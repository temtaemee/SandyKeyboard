import api from '../../../app/api/axios';

export const getPublicEventList = (pno = 0) =>
  api.get('/public/events', { params: { pno } }).then((res) => res.data);

export const receiveCoupon = (couponId) =>
  api.post(`/user/coupon/${couponId}`).then((res) => res.data);
