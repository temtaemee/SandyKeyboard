import api from '../../../app/api/axios';

export const stayApi = {
  getList: (params) => api.get('/seller/stay', { params }),
  getOne: (id) => api.get(`/seller/stay/${id}`),
  create: (formData) =>
    api.post('/seller/stay', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),
  update: (id, dto) => api.put(`/seller/stay/${id}`, dto),
  remove: (id) => api.delete(`/seller/stay/${id}`),
  toggleVisible: (id, visibleYn) =>
    api.put(`/seller/stay/${id}/visible`, null, { params: { visibleYn } }),
};
