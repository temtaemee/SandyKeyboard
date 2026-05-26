import api from '../../../app/api/axios';

export const getSpaces = (params) => api.get('/public/space', { params });

export const updateSpaceVisible = (id, visibleYn) =>
  api.put(`/public/space/${id}/visible`, null, { params: { visibleYn } });
