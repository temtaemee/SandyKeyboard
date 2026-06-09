import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminSpaces, approveAdminSpace, rejectAdminSpace } from '../api/adminSpacesApi';
import {
  setSpaces,
  setLoading,
  toggleSpaceVisible as toggleSpaceVisibleAction,
  approveSpaces as approveSpacesAction,
  rejectSpaces as rejectSpacesAction,
} from '../store/adminSpacesSlice';

export default function useAdminSpaces() {
  const dispatch = useDispatch();
  const { spaces, pendingSpaces, rejectedSpaces, loading, error } =
    useSelector((state) => state.admin.spaces);

  const fetchSpaces = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const resp = await getAdminSpaces();
      dispatch(setSpaces(resp.data));
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const refetch = fetchSpaces;

  const approveSpaces = useCallback(
    async (ids, fromTab) => {
      try {
        await Promise.all(ids.map(id => approveAdminSpace(id)));
        dispatch(approveSpacesAction({ ids, fromTab }));
      } catch (err) {
        console.error('공간 승인 처리 중 오류 발생:', err);
      }
    },
    [dispatch]
  );

  const rejectSpaces = useCallback(
    async (ids) => {
      try {
        await Promise.all(ids.map(id => rejectAdminSpace(id, '심사 기준 승인 미달')));
        dispatch(rejectSpacesAction(ids));
      } catch (err) {
        console.error('공간 반려 처리 중 오류 발생:', err);
      }
    },
    [dispatch]
  );

  const optimisticToggleVisible = useCallback(
    (id, visibleYn) => dispatch(toggleSpaceVisibleAction({ id, visibleYn })),
    [dispatch]
  );

  return {
    spaces,
    pendingSpaces,
    rejectedSpaces,
    loading,
    error,
    refetch,
    approveSpaces,
    rejectSpaces,
    optimisticToggleVisible,
  };
}
