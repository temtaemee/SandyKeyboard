import api from "../../../../app/api/axios";

// 내 정보 조회
export async function getMyInfo() {
    const resp = await api.get('/auth/me');
    return resp.data;
}

// MyPage 정보 조회
export async function getMyPageDashboard() {
    const resp = await api.get(`/user/mypage`);
    return resp.data;
}

// 회원 정보 수정
export async function editMyInfo(vo) {
    const resp = await api.put('/user/member', vo);
    return resp.status;
}
// 비밀번호 변경
export async function updatePassword(vo) {
    const resp = await api.patch('/user/member', vo);
    return resp.status;
}
// 회원 탈퇴
export async function deleteAccount() {
    const resp = await api.delete('/user/member');
    return resp.status;
}
//찜 목록 불러오기
export async function getMyWishlist() {
    const resp = await api.get(`/user/wishlist`);
    return resp.data;
}
//찜 등록하기
export async function insertWishlist(spaceId) {
    const resp = await api.post(`/user/wishlist/${spaceId}`)
    return resp.status;
}

//찜 삭제하기
export async function deleteWishlist(wishlistId) {
    const resp = await api.delete(`/user/wishlist/${wishlistId}`)
    return resp.status;
}