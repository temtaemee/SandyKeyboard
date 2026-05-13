import api from '../../../app/api/axios';

export const spaceApi = {
  getAll: () => api.get('/public/space'),
  getOne: (id) => api.get(`/public/space/${id}`),
  create: (data) => api.post('/public/space', data),
  update: (id, data) => api.put(`/public/space/${id}`, data),
  deleteOne: (id) => api.delete(`/public/space/${id}`),
};
