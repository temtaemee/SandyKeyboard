import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { updateReservation } from '../api/reservationApi';
import { setLoading, setError } from '../store/reservationSlice';

export default function useReservationUpdate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function modifyReservation(id, vo, fileList) {
    try {
      dispatch(setLoading(true));

      const formData = new FormData();

      formData.append(
        'data',
        new Blob([JSON.stringify(vo)], {
          type: 'application/json',
        })
      );

      if (fileList?.length > 0) {
        fileList.forEach((file) => {
          formData.append('fileList', file);
        });
      }

      const resp = await updateReservation(id, formData);

      alert('수정 완료');

      navigate(`/reservation/${id}`);

      return resp.data;
    } catch (error) {
      console.error(error);

      dispatch(setError(error.response?.data));

      alert('수정 실패');

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { modifyReservation };
}
