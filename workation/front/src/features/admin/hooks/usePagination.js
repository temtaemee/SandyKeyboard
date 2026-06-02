import { useState, useCallback } from 'react';

export default function usePagination(initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = useCallback((page) => setCurrentPage(page), []);
  const goToPrev = useCallback((min = 1) => setCurrentPage((p) => Math.max(min, p - 1)), []);
  const goToNext = useCallback((max) => setCurrentPage((p) => Math.min(max, p + 1)), []);
  const reset = useCallback(() => setCurrentPage(initialPage), [initialPage]);

  return { currentPage, goToPage, goToPrev, goToNext, reset };
}

