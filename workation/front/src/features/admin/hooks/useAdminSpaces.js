import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminSpaces } from '../api/adminSpacesApi';
import {
  setSpaces,
  setLoading,
  approveSpaces,
  rejectSpaces,
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

  return {
    spaces,
    pendingSpaces,
    rejectedSpaces,
    loading,
    error,
    refetch: fetchSpaces,
    approveSpaces: (ids, fromTab) => dispatch(approveSpaces({ ids, fromTab })),
    rejectSpaces: (ids) => dispatch(rejectSpaces(ids)),
  };
}
