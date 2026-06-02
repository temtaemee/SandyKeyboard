import api from '../../../app/api/axios';

export const salesApi = {
  getSummary: ()         => api.get('/seller/sales/summary'),
  getList:    (pno = 0)  => api.get('/seller/sales/list', { params: { pno } }),
};
