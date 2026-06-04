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

// id찾기

export async function findUsername(vo) {
    const resp = await api.post(`/guest/find-username`, vo)
    return resp.data;
}

//비밀번호 찾기 스텝1 인증코드 이메일발송
export async function sendEmailCode(vo) {
    const resp = await api.post(`/guest/send-email-code`, vo)
    return resp.data;
}

//비밀번호 찾기 스텝2 인증코드 확인
export async function verifyCode(vo) {
    const resp = await api.post(`/guest/verify-email-code`, vo)
    return resp.data;
}

export async function resetPassword(vo) {
    console.log(vo);

    const resp = await api.patch(`/guest/reset-password`, vo)
    return resp.data;
}

export async function restoreAccount(vo) {
    const resp = await api.post(`/guest/restore`, {
        username: vo.username
    });
    return resp.data
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
//셀러 본인 정보 불러오기
export async function getSellerInfo() {
    const resp = await api.get(`/seller/me`)
    return resp.data;
}
export async function updateSellerInfo(vo) {
    const resp = await api.put(`/seller/me`)
    return resp.data;
}



