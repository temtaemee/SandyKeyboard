/** 관리자 페이지의 게시판(공지사항/문의사항 등) 게시글 관리 및 통계 조회 API */
import api from '../../../app/api/axios';

/** 게시판 게시글 목록 조회 (타입 및 검색 파라미터 적용) */
export async function getAdminBoardPosts(type, params = {}) {
  return await api.get('/admin/board/posts', { params: { type, ...params } });
}

/** 게시글 상단 고정 상태 변경 */
export async function updatePostPinStatus(postId, pinned) {
  return await api.patch(`/admin/board/posts/${postId}/pin`, { pinned });
}

/** 게시글 노출/비노출 여부 변경 */
export async function updatePostVisibility(postId, visible) {
  return await api.patch(`/admin/board/posts/${postId}/visibility`, { visible });
}

/** 게시글 삭제 */
export async function deleteAdminBoardPost(postId) {
  return await api.delete(`/admin/board/posts/${postId}`);
}

/** 게시판 관련 전체 통계 정보 조회 */
export async function getAdminBoardStats() {
  return await api.get('/admin/board/stats');
}
