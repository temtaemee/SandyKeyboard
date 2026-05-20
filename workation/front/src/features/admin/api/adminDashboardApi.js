import api from '../../../app/api/axios';

export async function getAdminDashboardStats() {
  return await api.get('/admin/dashboard/stats');
}

export async function getAdminChartData(period = '6M') {
  return await api.get('/admin/dashboard/chart', { params: { period } });
}

export async function getAdminRecentPayments() {
  return await api.get('/admin/dashboard/payments');
}

export async function getAdminRegionalSales() {
  return await api.get('/admin/dashboard/regional-sales');
}
