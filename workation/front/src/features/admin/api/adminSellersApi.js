/** 관리자 페이지의 일반 사용자(게스트) 및 판매자(호스트) 회원 목록 조회 및 활성/정지 상태 관리 API */
import api from '../../../app/api/axios';

// ===== 관리자 회원 목록 조회 =====
export async function searchMembers(params) {
  const resp = await api.get(`/admin/member/list`, {
    params,
  });

  return resp.data;
}

// ===== 관리자 판매자 목록 조회 =====
export async function searchSellers(params) {
  const resp = await api.get(`/admin/seller/list`, {
    params,
  });

  return resp.data;
}
// 요청 함수 예시
// const data = await searchMembers({
//   page: 1,
//   size: 10,
//   keyword: "user",
//   status: MEMBER_STATUS.ACTIVE,
// });
// ===== 관리자 회원 상세조회 =====
export async function getMemberDetail(memberId) {
  const resp = await api.get(`/admin/member/${memberId}`);
  return resp.data;
}

// ===== 관리자 회원 밴 =====
// 가져간 resp.status값이 200이면 잘 처리된것
export async function banMember(memberId) {
  const resp = await api.patch(`/admin/member/${memberId}/ban`);
  return resp;
}
// ===== 관리자 회원 밴 해제=====
export async function unbanMember(memberId) {
  const resp = await api.patch(`/admin/member/${memberId}/unban`);
  return resp;
}
