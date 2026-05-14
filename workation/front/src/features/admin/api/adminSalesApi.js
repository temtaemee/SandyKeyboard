import api from '../../../app/api/axios';

export async function getAdminSalesStats() {
  return await api.get('/admin/settlements/stats');
}

export async function getAdminMonthlySalesChart() {
  return await api.get('/admin/settlements/monthly-chart');
}

export async function getAdminTopSettlements() {
  return await api.get('/admin/settlements/top5');
}

export async function getAdminPendingSettlements(params = {}) {
  return await api.get('/admin/settlements/pending', { params });
}

export async function getAdminUrgentAlerts() {
  return await api.get('/admin/settlements/alerts');
}
