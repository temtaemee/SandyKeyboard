import api from '../../../app/api/axios';

export const spaceApi = {
  getMySpaces: () => api.get('/seller/space'),
  getOne: (id) => api.get(`/seller/space/${id}`),
  create: (formData) =>
    api.post('/seller/space', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),
  update: (id, dto) => api.put(`/seller/space/${id}`, dto),
  remove: (id) => api.delete(`/seller/space/${id}`),
  toggleVisible: (id, visibleYn) =>
    api.put(`/seller/space/${id}/visible`, null, { params: { visibleYn } }),

  // 사진 수정 (multipart: dto + files)
  updatePictures: (id, formData) =>
    api.put(`/seller/space/${id}/pictures`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),

  // 편의시설
  getArcades: () => api.get('/seller/arcade'),
  createArcade: (name) => api.post('/seller/arcade', { name }),
};
