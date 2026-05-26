/** 관리자 페이지의 매출/정산 통계, 월별 매출 차트 및 정산 대기/긴급 알림 관리 API */
import api from '../../../app/api/axios';

/** 정산 및 매출 전체 통계 지표 조회 */
export async function getAdminSalesStats() {
  return await api.get('/admin/settlements/stats');
}

/** 월별 매출 및 정산 차트 데이터 조회 */
export async function getAdminMonthlySalesChart() {
  return await api.get('/admin/settlements/monthly-chart');
}

/** 매출/정산 상위 5개 내역 조회 */
export async function getAdminTopSettlements() {
  return await api.get('/admin/settlements/top5');
}

/** 정산 대기 상태 내역 목록 조회 (검색 및 필터링 적용) */
export async function getAdminPendingSettlements(params = {}) {
  return await api.get('/admin/settlements/pending', { params });
}

/** 빠른 처리가 필요한 긴급 정산 알림 정보 조회 */
export async function getAdminUrgentAlerts() {
  return await api.get('/admin/settlements/alerts');
}
