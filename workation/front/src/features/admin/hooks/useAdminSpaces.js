import { useEffect, useState } from 'react';
import { getAdminSpaces, deleteAdminSpace } from '../api/adminSpacesApi';
import { SPACES_LIST } from '../data/adminSpacesData';

export default function useAdminSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await getAdminSpaces();
        setSpaces(res.data);
      } catch (err) {
        console.error(err);
        setSpaces(SPACES_LIST);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const deleteSpace = async (spaceId) => {
    try {
      await deleteAdminSpace(spaceId);
      setSpaces((prev) => prev.filter((s) => s.id !== spaceId));
    } catch (err) {
      console.error(err);
    }
  };

  return { spaces, loading, error, deleteSpace };
}
