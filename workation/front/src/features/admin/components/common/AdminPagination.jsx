import styled from 'styled-components';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

/**
 * 관리자 전용 공통 페이지네이션 컴포넌트
 *
 * @param {number} currentPage - 현재 페이지
 * @param {number} totalPages - 전체 페이지 수
 * @param {function} onPageChange - 페이지 변경 핸들러
 */
export default function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // 표시할 페이지 번호 계산 (최대 5개)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 0) return null;

  return (
    <PaginationContainer>
      {/* 처음으로 */}
      <NavBtn
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="처음으로"
      >
        <ChevronsLeft size={16} />
      </NavBtn>

      {/* 이전 */}
      <NavBtn
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="이전"
      >
        <ChevronLeft size={16} />
      </NavBtn>

      {/* 페이지 번호 */}
      <PageList>
        {getPageNumbers().map((p) => (
          <PageBtn
            key={p}
            $active={currentPage === p}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PageBtn>
        ))}
      </PageList>

      {/* 다음 */}
      <NavBtn
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="다음"
      >
        <ChevronRight size={16} />
      </NavBtn>

      {/* 마지막으로 */}
      <NavBtn
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="마지막으로"
      >
        <ChevronsRight size={16} />
      </NavBtn>
    </PaginationContainer>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
`;

const NavBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f8fafc;
    color: #0f172a;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PageList = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PageBtn = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s ease;
  cursor: pointer;

  /* 활성 상태 */
  background: ${({ $active }) => ($active ? '#244c54' : 'transparent')};
  color: ${({ $active }) => ($active ? 'white' : '#64748b')};
  border: ${({ $active }) => ($active ? 'none' : '1px solid transparent')};

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#244c54' : '#f1f5f9')};
    color: ${({ $active }) => ($active ? 'white' : '#0f172a')};
  }
`;
