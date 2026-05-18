import api from "../../../app/api/axios";

// ===== 상태 상수 =====
export const MEMBER_STATUS = {
    ACTIVE: "ACTIVE",
    BANNED: "BANNED",
    WITHDRAWN: "WITHDRAWN",
};

// ===== 로그인 =====
export async function login(vo) {
    const resp = await api.post(`/guest/login`, vo);
    return resp.data;
}

// ===== 회원가입 =====
export async function join(vo) {
    const resp = await api.post(`/guest/join`, vo);
    return resp;
}

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