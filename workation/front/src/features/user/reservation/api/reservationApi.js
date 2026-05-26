// src/features/reservation/api/reservationApi.js
import api from './../../../../app/api/axios'; // 💡 제공해주신 공통 인스턴스 임포트

// =========================================================================
// 1. 일반 유저(User) 관련 API
// =========================================================================

/**
 * 유저 - 예약 등록 (실시간 가격 정산 포함)
 */
export async function createReservation(stayId, formData) {
  // 파일 업로드가 포함되므로 Content-Type만 명시해 줍니다. (토큰은 인터셉터가 자동 주입)
  return await api.post(`/user/reservation/${stayId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 유저 - 본인 예약 목록 조회
 */
export async function getMyReservations() {
  return await api.get('/user/reservation');
}

/**
 * 유저 - 예약 단건 상세 조회
 */
export async function getReservationOne(id) {
  return await api.get(`/user/reservation/${id}`);
}

/**
 * 유저 - 예약 정보 수정
 */
export async function updateReservation(id, formData) {
  return await api.put(`/user/reservation/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 유저 - 본인 보유 쿠폰 조회 (팀원 API 연동)
 */
export async function getAvailableCoupons() {
  return await api.get('/user/memberCoupon?pno=0');
}

// =========================================================================
// 2. 판매자(Seller) 관련 API
// =========================================================================

/**
 * 판매자 - 본인 숙소에 들어온 예약 목록 검색 조회 (페이징 & 동적 조건 필터)
 */
export async function getSellerReservationList({
  pno = 0,
  reservationId,
  guestName,
  checkinDate,
}) {
  const queryParams = new URLSearchParams({ pno });
  if (reservationId) queryParams.append('reservationId', reservationId);
  if (guestName) queryParams.append('guestName', guestName);
  if (checkinDate) queryParams.append('checkinDate', checkinDate);

  return await api.get(`/seller/reservation/list?${queryParams.toString()}`);
}

/**
 * 판매자 - 예약 단건 상세 조회
 */
export async function getSellerReservationOne(id) {
  return await api.get(`/seller/reservation/detail/${id}`);
}

// =========================================================================
// 3. 관리자(Admin) 관련 API
// =========================================================================

/**
 * 관리자 - 시스템 전체 예약 목록 검색 조회 (페이징 & 다중 필터)
 */
export async function getAdminReservationList({
  pno = 0,
  username,
  guestName,
  reservationId,
  sellerUsername,
}) {
  const queryParams = new URLSearchParams({ pno });
  if (username) queryParams.append('username', username);
  if (guestName) queryParams.append('guestName', guestName);
  if (reservationId) queryParams.append('reservationId', reservationId);
  if (sellerUsername) queryParams.append('sellerUsername', sellerUsername);

  return await api.get(`/admin/reservation/list?${queryParams.toString()}`);
}

/**
 * 관리자 - 예약 단건 상세 조회
 */
export async function getAdminReservationOne(id) {
  return await api.get(`/admin/reservation/${id}`);
}
