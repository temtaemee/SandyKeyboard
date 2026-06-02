/** 관리자 페이지의 매출/정산 통계, 월별 매출 차트 및 정산 대기/긴급 알림 관리 API */
import api from '../../../app/api/axios';

// 누적 매출액
export async function getAdminSalesSummary() {
  return await api.get('/admin/sales/summary');
}

// 정산내역 리스트
export async function getAdminPayoutList() {
  return await api.get(`/admin/payout/list`);
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
