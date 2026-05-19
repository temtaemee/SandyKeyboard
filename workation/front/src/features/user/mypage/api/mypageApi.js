import api from "../../../../app/api/axios";


// =========================
// 내 정보 조회
// GET /auth/me


// =========================
export async function getMyInfo() {
    const resp = await api.get('/auth/me');

    return resp.data;
}

// =========================
// 회원 정보 수정
// PUT /user/member
// =========================
export async function editMyInfo(vo) {
    const resp = await api.put('/user/member', vo);

    return resp.status;
}

// =========================
// 비밀번호 변경
// PATCH /user/member
// =========================
export async function updatePassword(vo) {
    const resp = await api.patch('/user/member', vo);

    return resp.status;
}

// =========================
// 회원 탈퇴
// DELETE /user/member
// =========================
export async function deleteAccount() {
    const resp = await api.delete('/user/member');

    return resp.status;
}