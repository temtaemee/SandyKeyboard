import api from '../../../app/api/axios';

export async function getAdminSellers(params = {}) {
  return await api.get('/admin/sellers', { params });
}

export async function updateSellerStatus(sellerId, suspended) {
  return await api.patch(`/admin/sellers/${sellerId}/status`, { suspended });
}

export async function getAdminUsers(params = {}) {
  return await api.get('/admin/users', { params });
}

export async function updateUserStatus(userId, suspended) {
  return await api.patch(`/admin/users/${userId}/status`, { suspended });
}
