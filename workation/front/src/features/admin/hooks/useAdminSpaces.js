import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminSpaces } from '../api/adminSpacesApi';
import {
  setSpaces,
  setLoading,
  setBlinded,
  approveSpaces,
  rejectSpaces,
} from '../store/adminSpacesSlice';

export default function useAdminSpaces() {
  const dispatch = useDispatch();
  const { spaces, pendingSpaces, rejectedSpaces, blindedIds, loading, error } =
    useSelector((state) => state.admin.spaces);

  useEffect(() => {
    const fetchSpaces = async () => {
      dispatch(setLoading(true));
      try {
        const resp = await getAdminSpaces();
        dispatch(setSpaces(resp.data));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchSpaces();
  }, [dispatch]);

  return {
    spaces,
    pendingSpaces,
    rejectedSpaces,
    blindedIds,
    loading,
    error,
    setBlinded: (id, blinded) => dispatch(setBlinded({ id, blinded })),
    approveSpaces: (ids, fromTab) => dispatch(approveSpaces({ ids, fromTab })),
    rejectSpaces: (ids) => dispatch(rejectSpaces(ids)),
  };
}
