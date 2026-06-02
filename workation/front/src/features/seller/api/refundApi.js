import api from '../../../app/api/axios';

export const sellerRefundApi = {
  getList: (pno = 0) => api.get('/seller/refund/list', { params: { pno } }),
  getOne:  (id)      => api.get(`/seller/refund/${id}`),
};
