import api from '../../../app/api/axios';

export async function getAdminSpaces(params = {}) {
  return await api.get('/admin/spaces', { params });
}

export async function deleteAdminSpace(spaceId) {
  return await api.delete(`/admin/spaces/${spaceId}`);
}

export async function getAdminSpaceStats() {
  return await api.get('/admin/spaces/stats');
}
