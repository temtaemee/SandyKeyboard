// src/features/member/components/signup/CompanySearchModal.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../../../app/api/axios';

function CompanySearchModal({ onClose, onSelect }) {
  const [keyword, setKeyword] = useState('');
  const [companyList, setCompanyList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 💡 기업 데이터 로드 함수 (검색어와 페이지 번호 반영)
  const fetchCompanies = (searchKeyword, pageNum) => {
    // 백엔드 컨트롤러 스펙에 맞춰 @RequestParam 매핑
    api
      .get(`/public/company?pno=${pageNum}`)
      .then((res) => {
        const content = res.data?.content || [];

        if (searchKeyword.trim() !== '') {
          const filtered = content.filter((co) =>
            co.companyName.toLowerCase().includes(searchKeyword.toLowerCase())
          );
          setCompanyList(filtered);
        } else {
          setCompanyList(content);
        }
        setTotalPages(res.data?.totalPages || 0);
      })
      .catch((err) => console.error('기업 로드 실패', err));
  };

  useEffect(() => {
    fetchCompanies(keyword, page);
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // 검색 시 첫 페이지로 리셋
    fetchCompanies(keyword, 0);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>소속 기업 검색</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="기업명을 입력하세요 (예: 모래컴퍼니)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>

        <CompanyListZone>
          {companyList.length === 0 ? (
            <EmptyText>검색 결과가 없습니다.</EmptyText>
          ) : (
            companyList.map((co) => (
              <CompanyItem
                key={co.id}
                onClick={() => {
                  onSelect(co); // 부모에게 선택된 기업 전달
                  onClose(); // 모달 닫기
                }}
              >
                <strong>{co.companyName}</strong>
                {co.businessNo && (
                  <span className="biz-no">사업자 번호: {co.businessNo}</span>
                )}
              </CompanyItem>
            ))
          )}
        </CompanyListZone>

        {/* 💡 스프링 Page 내비게이션 바인딩 */}
        {totalPages > 1 && (
          <Pagination>
            <PageBtn
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </PageBtn>
            <span>
              {page + 1} / {totalPages}
            </span>
            <PageBtn
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </PageBtn>
          </Pagination>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
}

export default CompanySearchModal;

/* ================= 스타일 정의 (모래묻은 키보드 테마) ================= */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContainer = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 24px;
  padding: 24px;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h3 {
    font-size: 18px;
    color: #374151;
    font-weight: 700;
  }
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
`;
const SearchForm = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;
const SearchInput = styled.input`
  flex: 1;
  height: 46px;
  border: 1px solid #d6dde2;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
`;
const SearchButton = styled.button`
  background-color: #4d6c75;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  cursor: pointer;
  font-weight: 600;
`;
const CompanyListZone = styled.div`
  max-height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;
const CompanyItem = styled.div`
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
  &:hover {
    background-color: #f4f7f8;
    border-color: #4d6c75;
  }
  strong {
    font-size: 14px;
    color: #374151;
  }
  .biz-no {
    font-size: 12px;
    color: #94a3b8;
  }
`;
const EmptyText = styled.p`
  text-align: center;
  color: #94a3b8;
  padding: 30px 0;
  font-size: 14px;
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #6b7280;
`;
const PageBtn = styled.button`
  border: 1px solid #d6dde2;
  background: white;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
