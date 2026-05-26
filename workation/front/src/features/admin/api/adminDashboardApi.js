/** 관리자 대시보드의 주요 지표 요약, 매출 차트 및 결제/지역별 현황 조회 API */
import api from '../../../app/api/axios';

/** 대시보드 요약 통계 정보 조회 */
export async function getAdminDashboardStats() {
  return await api.get('/admin/dashboard/stats');
}

/** 대시보드 매출/예약 추이 차트 데이터 조회 (조회 기간 설정 가능) */
export async function getAdminChartData(period = '6M') {
  return await api.get('/admin/dashboard/chart', { params: { period } });
}

/** 최근 발생한 결제 내역 목록 조회 */
export async function getAdminRecentPayments() {
  return await api.get('/admin/dashboard/payments');
}

/** 지역별 매출 통계 현황 조회 */
export async function getAdminRegionalSales() {
  return await api.get('/admin/dashboard/regional-sales');
}
