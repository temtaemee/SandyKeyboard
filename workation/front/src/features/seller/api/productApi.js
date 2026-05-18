import api from '../../../app/api/axios';

const toFormData = (dto, files) => {
  const fd = new FormData();
  fd.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
  files?.forEach((f) => fd.append('files', f));
  return fd;
};

export const spaceProductApi = {
  getAll: () => api.get('/public/space'),
  create: (dto, files) => api.post('/public/space', toFormData(dto, files)),
  update: (id, dto) => api.put(`/public/space/${id}`, dto),
  remove: (id) => api.delete(`/public/space/${id}`),
};

export const stayApi = {
  getAll: () => api.get('/public/stay'),
  create: (dto, files) => api.post('/seller/stay', toFormData(dto, files)),
  update: (id, dto) => api.put(`/seller/stay/${id}`, dto),
  changeVisible: (id, visibleYn) => api.put(`/seller/stay/${id}/visible`, null, { params: { visibleYn } }),
  remove: (id) => api.delete(`/seller/stay/${id}`),
};

export const officeApi = {
  getAll: () => api.get('/public/office'),
  create: (dto, files) => api.post('/seller/office', toFormData(dto, files)),
  update: (id, dto) => api.put(`/seller/office/${id}`, dto),
  changeVisible: (id, visibleYn) => api.put(`/seller/office/${id}/visible`, null, { params: { visibleYn } }),
  remove: (id) => api.delete(`/seller/office/${id}`),
};
