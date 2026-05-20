import api from '../../../app/api/axios';

export async function getAdminReservations(params = {}) {
  return await api.get('/admin/reservations', { params });
}

export async function getAdminReservationStats() {
  return await api.get('/admin/reservations/stats');
}

export async function getAdminPartnerCompanies() {
  return await api.get('/admin/reservations/partners');
}
