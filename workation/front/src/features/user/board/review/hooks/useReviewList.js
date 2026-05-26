import { useEffect, useState } from 'react';
import { getReviewList } from '../api/reviewApi';

export function useReviewList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getReviewList(currentPage)
      .then((data) => {
        setList(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => {
        console.error(err);
        setList([]);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  return { list, loading, currentPage, setCurrentPage, totalPages };
}
