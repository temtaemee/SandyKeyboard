import api from '../../../app/api/axios';

/** 등록된 공간 목록 조회 - admin 전용 (keyword/area/visibleYn/delYn 필터 지원) */
export async function getAdminSpaces(params = {}) {
  return await api.get('/admin/space', { params });
}

/** 삭제된(비 운영) 공간 목록 조회 (delYn = 'Y') */
export async function getDeletedSpaces() {
  return await api.get('/admin/space', { params: { delYn: 'Y' } });
}

/** 특정 공간에 속한 stay 목록 조회 */
export async function getStaysBySpaceId(spaceId) {
  return await api.get('/public/stay', { params: { spaceId } });
}

/** 공간 노출 여부 변경 - admin 전용 (visibleYn: 'Y' | 'N') */
export async function changeSpaceVisible(spaceId, visibleYn) {
  return await api.put(`/admin/space/${spaceId}/visible`, null, {
    params: { visibleYn },
  });
}

/** 특정 공간 삭제 (soft delete) - admin 전용 */
export async function deleteAdminSpace(spaceId) {
  return await api.delete(`/admin/space/${spaceId}`);
}

/** 공간 등록 승인 - admin 전용 */
export async function approveAdminSpace(spaceId) {
  return await api.put(`/admin/space/${spaceId}/approve`);
}

/** 공간 등록 반려 - admin 전용 */
export async function rejectAdminSpace(spaceId, reason = '') {
  return await api.put(`/admin/space/${spaceId}/reject`, null, {
    params: { reason },
  });
}
