import api from '../../../app/api/axios';

export const reservationApi = {
  getList: (params) => api.get('/seller/reservation/list', { params }),
  getOne: (id) => api.get(`/seller/reservation/detail/${id}`),
  approve: (id) => api.patch(`/seller/approve/${id}`),
  cancel: (id) => api.patch(`/seller/cancel/${id}`),
};
