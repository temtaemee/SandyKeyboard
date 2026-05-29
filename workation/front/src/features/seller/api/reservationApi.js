import api from '../../../app/api/axios';

export const reservationApi = {
  getList: (params) => api.get('/seller/reservation/list', { params }),
  getOne: (id) => api.get(`/seller/reservation/detail/${id}`),
  approve: (id) => api.put(`/seller/reservation/${id}/approve`),
  cancel: (id) => api.put(`/seller/reservation/${id}/cancel`),
};
