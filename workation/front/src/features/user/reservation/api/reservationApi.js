// src/features/reservation/api/reservationApi.js
import api from './../../../../app/api/axios';

// 예약 등록
export async function createReservation(stayId, formData) {
  const token = localStorage.getItem('token');
  console.log(localStorage.getItem('token'));
  return await api.post(
    //스테이 완료후 입력
    // `/user/reservation/${stayId}`,
    `/user/reservation`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
//결제전 수정
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
