import { useEffect, useState } from 'react';
import { getNoticeList } from '../api/supportApi';

export function useNoticeList() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getNoticeList(currentPage)
      .then((data) => {
        setNotices(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => console.error('공지 목록 조회 실패', err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  return { notices, loading, currentPage, setCurrentPage, totalPages };
}
