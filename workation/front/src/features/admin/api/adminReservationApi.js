import api from '../../../app/api/axios';

/** 예약 내역 목록 조회 (검색 및 필터링 적용) */
export async function getAdminReservations(params = {}) {
  // 백엔드 컨트롤러: GET /admin/reservation/list
  // 파라미터: pno(0-indexed), username, guestName, reservationId, sellerUsername
  return await api.get('/admin/reservation/list', { params });
}

/** 예약 현황 통계 정보 조회 */
// 이번달 예약 수 및 취소금액 조회
export async function getAdminDashboardSummary() {
  return await api.get('/admin/dashboard/summary');
}

/** 제휴 기업 및 파트너사 목록 조회 */
export async function getAdminPartnerCompanies() {
  const resp = await api.get('/public/company', {
    params: { pno: 0, size: 100 }, // 충분한 크기의 제휴사를 불러오기 위해 100개 지정
  });
  return resp.data;
}

/** 제휴 기업 등록 */
export async function createPartnerCompany(dto) {
  return await api.post('/admin/company', dto);
}

/** 제휴 기업 정보 수정 */
export async function updatePartnerCompany(id, dto) {
  return await api.put(`/admin/company/${id}`, dto);
}

/** 제휴 기업 활성/비활성 토글 */
export async function togglePartnerCompanyStatus(id) {
  return await api.delete(`/admin/company/${id}`);
}
