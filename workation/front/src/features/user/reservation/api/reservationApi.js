// src/features/reservation/api/reservationApi.js
import api from './../../../../app/api/axios';

// 예약 등록
export async function createReservation(formData) {
  return await api.post(
    //stay랑 office 완성후
    // `/user/${productType}/${productId}/reservation`,
    '/user/reservation',
    formData
  );
}

// 예약 목록 조회
export async function getReservationList(pno) {
  return await api.get(`/user/reservation?pno=${pno}`);
}

// 예약 상세 조회
export async function getReservationOne(id) {
  return await api.get(`/user/reservation/${id}`);
}

// 예약 수정
export async function updateReservation(id, vo) {
  return await api.put(`/user/reservation/${id}`, vo);
}
