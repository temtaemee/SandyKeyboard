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

      // dto JSON
      formData.append(
        'data',
        new Blob([JSON.stringify(vo)], {
          type: 'application/json',
        })
      );

      // 파일 추가
      fileList.forEach((file) => {
        formData.append('fileList', file);
      });

      // API 호출
      const resp = await createReservation(stayId, formData);

      alert('예약 성공');

      console.log(resp.data);

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
