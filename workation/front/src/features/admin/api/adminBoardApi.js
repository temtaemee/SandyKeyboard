/** 관리자 페이지의 게시판(공지사항/문의사항 등) 게시글 관리 및 통계 조회 API */
import api from '../../../app/api/axios';
import { BOARD_POSTS } from '../data/adminBoardData'; // 💡 임시 Mock 데이터 가져오기

/** 게시판 게시글 목록 조회 (타입 및 검색 파라미터 적용) */
export async function getAdminBoardPosts(type, params = {}) {
  // 💡 [Mock 처리] 백엔드가 완성될 때까지 403 에러로 인한 세션 튕김을 막기 위해 Mock 데이터를 즉시 반환합니다.
  return {
    data: BOARD_POSTS[type] || [],
  };
}

/** 게시글 상단 고정 상태 변경 */
export async function updatePostPinStatus(postId, pinned) {
  return { data: { success: true } };
}

/** 게시글 노출/비노출 여부 변경 */
export async function updatePostVisibility(postId, visible) {
  return { data: { success: true } };
}

/** 게시글 삭제 */
export async function deleteAdminBoardPost(postId) {
  return { data: { success: true } };
}

/** 게시판 관련 전체 통계 정보 조회 */
export async function getAdminBoardStats() {
  return {
    data: {
      totalReviews: 1284,
      monthlyReviews: 342,
    },
  };
}

// 공지사항

// FAQ

// 리뷰

// 이벤트

// 쿠폰
//// 게시판 쿠폰
// 쿠폰 전체 목록조회
export async function getCouponList(pno) {
  return api.get('/admin/coupon', {
    params: { pno },
  });
}

// 쿠폰 상세조회
export async function getCouponById(id) {
  return api.get(`/public/coupon/${id}`);
}
// 쿠폰 삭제 (soft)
export async function deleteCoupon(id) {
  return api.delete(`/admin/coupon/${id}`);
}
// 쿠폰 수정
export async function updateCoupon(id, data) {
  return api.put(`/admin/coupon/${id}`, data);
}
// 쿠폰 등록
export async function createCoupon(data) {
  return api.post('/admin/coupon', data);
}

//// 회원 쿠폰
// 멤버 쿠폰 목록조회
export async function getMemberCouponList(pno, username) {
  return api.get('/admin/coupon', {
    params: { pno, username },
  });
}
// 멤버에게 쿠폰 발급
export async function adminRegister(data) {
  return api.post('/admin/coupon', data);
}
// 멤버 쿠폰 삭제
export async function deleteMemberCoupon(data) {
  return api.delete(`/admin/coupon/`, data);
}
