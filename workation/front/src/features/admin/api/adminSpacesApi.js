/** 관리자 페이지의 등록 공간(숙소/오피스 등) 목록 조회, 통계 및 삭제 API */
import api from '../../../app/api/axios';

/** 등록된 공간(숙소/오피스 등) 목록 조회 (검색 및 필터링 적용) */
export async function getAdminSpaces(params = {}) {
  return await api.get('/public/space', { params });
}

/** 특정 공간에 속한 stay 목록 조회 */
export async function getStaysBySpaceId(spaceId) {
  return await api.get('/public/stay', { params: { spaceId } });
}

/** 특정 등록 공간 정보 삭제 */
export async function deleteAdminSpace(spaceId) {
  return await api.delete(`/api/public/space/${spaceId}`);
}

/** 등록 공간 전체 통계 정보 조회 */
export async function getAdminSpaceStats() {
  return await api.get('/admin/spaces/stats');
}
