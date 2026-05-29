import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStayList,
  fetchStayOne,
  createStay,
  updateStay,
  deleteStay,
  toggleStayVisible,
  clearCurrent,
  clearError,
} from '../store/staySlice';

export default function useStays() {
  const dispatch = useDispatch();

  // store.js에 stay reducer가 등록되기 전 안전 처리
  const stays = useSelector((state) => state.stay?.list ?? []);
  const stay = useSelector((state) => state.stay?.current ?? null);
  const loading = useSelector((state) => state.stay?.loading ?? false);
  const error = useSelector((state) => state.stay?.error ?? null);

  return {
    stays,
    stay,
    loading,
    error,
    fetchStayList: (params) => dispatch(fetchStayList(params)),
    fetchStayOne: (id) => dispatch(fetchStayOne(id)),
    createStay: (formData) => dispatch(createStay(formData)),
    updateStay: (id, dto) => dispatch(updateStay({ id, dto })),
    deleteStay: (id) => dispatch(deleteStay(id)),
    toggleVisible: (id, visibleYn) => dispatch(toggleStayVisible({ id, visibleYn })),
    clearCurrent: () => dispatch(clearCurrent()),
    clearError: () => dispatch(clearError()),
  };
}
