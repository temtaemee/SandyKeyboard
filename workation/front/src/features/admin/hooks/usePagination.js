import { useState } from 'react';

export default function usePagination(initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page) => setCurrentPage(page);
  const goToPrev = (min = 1) => setCurrentPage((p) => Math.max(min, p - 1));
  const goToNext = (max) => setCurrentPage((p) => Math.min(max, p + 1));
  const reset = () => setCurrentPage(initialPage);

  return { currentPage, goToPage, goToPrev, goToNext, reset };
}
