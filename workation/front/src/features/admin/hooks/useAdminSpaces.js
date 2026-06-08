import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminSpaces } from '../api/adminSpacesApi';
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
    (ids, fromTab) => dispatch(approveSpacesAction({ ids, fromTab })),
    [dispatch]
  );

  const rejectSpaces = useCallback(
    (ids) => dispatch(rejectSpacesAction(ids)),
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
