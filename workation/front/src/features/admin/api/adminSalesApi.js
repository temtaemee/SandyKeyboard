import api from '../../../app/api/axios';

// 누적 매출액
export async function getAdminSalesSummary() {
  return await api.get('/admin/sales/summary');
}

// 정산내역 리스트
export async function getAdminPayoutList(pno = 0) {
  return await api.get(`/admin/payout/list`, { params: { pno } });
}

// 월별 정산, 수수료
export async function getPayoutSummary(year, month) {
  return await api.get('/admin/payout/summary', { params: { year, month } });
}

// 지역별 매출, 전체매출 (월별)
export async function getMonthlyRegionStats(year, month) {
  return await api.get('/admin/sales/monthly-stats', {
    params: { year, month },
  });
}

// 월간 매출 트렌드 그래프 데이터 조회
export async function getMonthlySalesGraphStats() {
  return await api.get('/admin/sales/graph-stats');
}
