// src/features/reservation/hooks/useReservationInsert.js

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createReservation } from '../api/reservationApi';
import { setError, setLoading } from '../store/reservationSlice';

export default function useReservationInsert() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function insertReservation(stayId, vo, fileList) {
    try {
      dispatch(setLoading(true));

      const formData = new FormData();

      formData.append(
        'data',
        new Blob([JSON.stringify(vo)], {
          type: 'application/json',
        })
      );

      fileList.forEach((file) => {
        formData.append('fileList', file);
      });

      // ❌ const stayId = 1; 제거

      // ✅ API 호출 + await + 결과 저장
      const resp = await createReservation(stayId, formData);

      console.log(resp.data);

      alert('예약 성공');

      navigate('/');

      return resp.data;
    } catch (error) {
      console.error(error);

      dispatch(setError(error.response?.data));

      alert('예약 실패');

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
  return {
    insertReservation,
  };
}
