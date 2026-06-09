/**
import api from './../../app/api/axios';
 * [판매자 전용] 월별 확정 정산 전표 내역 리스트 조회 (페이징)
 * @param {number} pno - 페이지 번호 (0부터 시작)
 * @returns {Promise<Page<PayoutListResDto>>} 백엔드 Page 객체 반환
 */
export async function getSellerPayoutList(pno = 0) {
  // 백엔드: @GetMapping("/seller/payout/list")
  const response = await api.get(`/seller/payout/list?pno=${pno}`);
  return response.data;
}

/**
 * [판매자 전용] 현재 기수 배치 가동 전, 실시간 누적 매출 요약 데이터 조회 (총결제액, 취소액, 순매출)
 * @returns {Promise<SalesSummaryResDto>} totalSales, totalCancel, totalNetSales 객체 반환
 */
export async function getSellerSalesSummary() {
  // 백엔드: @GetMapping("/seller/sales/summary")
  const response = await api.get('/seller/sales/summary');
  return response.data;
}

/**
 * [판매자 전용] 본인이 등록한 숙소들의 결제 건별 상세 매출 원장 리스트 조회 (페이징)
 * @param {number} pno - 페이지 번호 (0부터 시작)
 * @returns {Promise<Page<SalesSummaryListResDto>>} 장소명, 숙소명, 결제금액, 결제일 포함된 Page 객체 반환
 */
export async function getSellerSalesList(pno = 0) {
  // 백엔드: @GetMapping("/seller/sales/list")
  const response = await api.get(`/seller/sales/list?pno=${pno}`);
  return response.data;
}

/**
 * [어드민 전용] 플랫폼 전체 매출 요약 통계 조회
 * @returns {Promise<SalesSummaryResDto>}
 */
export async function getAdminSalesSummary() {
  const response = await api.get('/admin/sales/summary');
  return response.data;
}

/**
 * [어드민 전용] 특정 정산 건 지급 완료 처리
 * @param {number} payoutId
 * @returns {Promise<void>}
 */
export async function completePayout(payoutId) {
  const response = await api.patch(`/admin/payout/${payoutId}/complete`);
  return response.data;
}

/**
 * [어드민 전용] 관리자 대시보드 통계 조회
 * 이번 달 유효 예약 수, 당월 누적 취소 금액 조회
 *
 * @returns {Promise<DashboardSummaryResDto>}
 */
export async function getDashboardSummary() {
  const response = await api.get('/admin/dashboard/summary');
  return response.data;
}
