// src/features/reservation/api/reservationApi.js
import api from './../../../../app/api/axios';

// 1. 예약 등록 (@PostMapping("/user/reservation/{stayId}"))
export async function createReservation(stayId, formData) {
  const token = localStorage.getItem('token');
  return await api.post(`/user/reservation/${stayId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 💡 FormData 전송 시 명시해 주면 안전합니다.
      Authorization: `Bearer ${token}`,
    },
  });
}
// 팀원이 만든 본인 보유 쿠폰 조회 API 호출
export async function getAvailableCoupons() {
  const token = localStorage.getItem('token');
  return await api.get('/user/memberCoupon?pno=0', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

//결제후 수정
export async function updateReservation(id, formData) {
  const token = localStorage.getItem('token');

  return await api.put(`/user/reservation/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// 예약 상세 조회
export async function getReservationOne(id) {
  const token = localStorage.getItem('token');

  return await api.get(`/user/reservation/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
