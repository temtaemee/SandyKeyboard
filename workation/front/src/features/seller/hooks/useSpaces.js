import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMySpaces,
  fetchSpaceOne,
  createSpace,
  updateSpace,
  deleteSpace,
  toggleSpaceVisible,
  clearCurrent,
  clearError,
} from '../store/spaceSlice';

export default function useSpaces() {
  const dispatch = useDispatch();

  // store.js에 space reducer가 등록되기 전 안전 처리
  const spaces = useSelector((state) => state.space?.list ?? []);
  const space = useSelector((state) => state.space?.current ?? null);
  const loading = useSelector((state) => state.space?.loading ?? false);
  const error = useSelector((state) => state.space?.error ?? null);

  return {
    spaces,
    space,
    loading,
    error,
    fetchMySpaces: () => dispatch(fetchMySpaces()),
    fetchSpaceOne: (id) => dispatch(fetchSpaceOne(id)),
    createSpace: (formData) => dispatch(createSpace(formData)),
    updateSpace: (id, dto) => dispatch(updateSpace({ id, dto })),
    deleteSpace: (id) => dispatch(deleteSpace(id)),
    toggleVisible: (id, visibleYn) => dispatch(toggleSpaceVisible({ id, visibleYn })),
    clearCurrent: () => dispatch(clearCurrent()),
    clearError: () => dispatch(clearError()),
  };
}
