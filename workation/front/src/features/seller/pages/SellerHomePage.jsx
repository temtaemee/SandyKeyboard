import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { spaceApi } from '../api/spaceApi';
import SpaceCard from '../components/space/SpaceCard';

const AREA_KO = {
  soeul: '서울', gyeonggi: '경기', gangwon: '강원',
  chungnam: '충남', chungbuk: '충북', gyeongnam: '경남',
  gyeongbuk: '경북', jeonnam: '전남', jeonbuk: '전북', jeju: '제주',
};

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'visible', label: '노출중' },
  { key: 'hidden', label: '비노출' },
];

export default function SellerHomePage() {
  const [spaces, setSpaces] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await spaceApi.getAll();
      setSpaces(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('공간 목록을 불러오지 못했습니다.');
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSpaces(); }, [fetchSpaces]);

  const handleDelete = async (id) => {
    if (!window.confirm('공간을 삭제하시겠습니까?\n해당 공간의 숙소·오피스 데이터도 함께 삭제됩니다.')) return;
    try {
      await spaceApi.deleteOne(id);
      setSpaces((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const counts = {
    all: spaces.length,
    visible: spaces.filter((s) => s.visibleYn === 'Y').length,
    hidden: spaces.filter((s) => s.visibleYn === 'N').length,
  };

  const filtered = spaces.filter((s) => {
    if (filter === 'visible') return s.visibleYn === 'Y';
    if (filter === 'hidden') return s.visibleYn === 'N';
    return true;
  });

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader>
        <HeaderLeft>
          <PageTitle>내 공간 관리</PageTitle>
          <PageSubtitle>등록된 공간과 숙소·오피스를 관리하세요.</PageSubtitle>
        </HeaderLeft>
        <AddBtn>
          <PlusIcon />
          새 공간 등록
        </AddBtn>
      </PageHeader>

      {/* 필터 탭 */}
      <ToolBar>
        <FilterTabs>
          {FILTERS.map((f) => (
            <FilterTab key={f.key} $active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
              <FilterCount $active={filter === f.key}>{counts[f.key]}</FilterCount>
            </FilterTab>
          ))}
        </FilterTabs>

        {!loading && !error && spaces.length > 0 && (
          <ResultHint>{filtered.length}개의 공간</ResultHint>
        )}
      </ToolBar>

      {/* 콘텐츠 */}
      {loading ? (
        <SkeletonGrid>
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonImg />
              <SkeletonBody>
                <SkeletonLine $w="60%" $h="18px" />
                <SkeletonLine $w="90%" $h="13px" />
                <SkeletonLine $w="70%" $h="13px" />
              </SkeletonBody>
            </SkeletonCard>
          ))}
        </SkeletonGrid>
      ) : error ? (
        <ErrorState>
          <ErrorIcon />
          <ErrorTitle>불러오기 실패</ErrorTitle>
          <ErrorDesc>{error}</ErrorDesc>
          <RetryBtn onClick={fetchSpaces}>다시 시도</RetryBtn>
        </ErrorState>
      ) : filtered.length === 0 ? (
        <EmptyState>
          <EmptyIllustration />
          <EmptyTitle>
            {filter === 'all' ? '등록된 공간이 없습니다' : `${FILTERS.find((f) => f.key === filter)?.label} 공간이 없습니다`}
          </EmptyTitle>
          <EmptyDesc>
            {filter === 'all'
              ? '새 공간을 등록하고 숙소와 오피스를 추가해 보세요.'
              : '필터를 변경하거나 새 공간을 등록해 보세요.'}
          </EmptyDesc>
          {filter === 'all' && <EmptyAddBtn>새 공간 등록하기</EmptyAddBtn>}
        </EmptyState>
      ) : (
        <SpaceGrid>
          {filtered.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              areaLabel={AREA_KO[space.area] || space.area}
              onDelete={() => handleDelete(space.id)}
            />
          ))}
        </SpaceGrid>
      )}
    </>
  );
}

/* ── SVG Icons ── */

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function EmptyIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="40" fill="url(#emptyGrad)" opacity="0.3" />
      <rect x="20" y="28" width="40" height="32" rx="4" stroke="#3d646c" strokeWidth="2" fill="none" />
      <path d="M28 28V24a12 12 0 0 1 24 0v4" stroke="#3d646c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="44" r="4" fill="#3d646c" opacity="0.5" />
      <defs>
        <linearGradient id="emptyGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c3edf6" /><stop offset="1" stopColor="#f6e5ba" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Keyframes ── */

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

/* ── Styled Components ── */

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #244c54;
  letter-spacing: -0.5px;
  line-height: 1.3;
`;

const PageSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  background: #3d646c;
  color: white;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s;

  &:hover {
    background: #244c54;
    transform: translateY(-1px);
  }
`;

const ToolBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
`;

const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  background: ${({ $active }) => ($active ? 'white' : 'transparent')};
  color: ${({ $active }) => ($active ? '#244c54' : '#64748b')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none')};
`;

const FilterCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $active }) => ($active ? '#e0f5f8' : '#e2e8f0')};
  color: ${({ $active }) => ($active ? '#2c6480' : '#94a3b8')};
`;

const ResultHint = styled.span`
  font-size: 13px;
  color: #94a3b8;
`;

/* 그리드 */
const SpaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

/* 스켈레톤 */
const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
`;

const skeletonBase = `
  background: linear-gradient(90deg, #f1f5f9 25%, #e9eef3 50%, #f1f5f9 75%);
  background-size: 800px 100%;
`;

const SkeletonImg = styled.div`
  height: 140px;
  ${skeletonBase}
  animation: ${shimmer} 1.4s infinite linear;
`;

const SkeletonBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonLine = styled.div`
  height: ${({ $h }) => $h || '14px'};
  width: ${({ $w }) => $w || '100%'};
  border-radius: 6px;
  ${skeletonBase}
  animation: ${shimmer} 1.4s infinite linear;
`;

/* 에러 */
const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 0;
  text-align: center;
`;

const ErrorTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #191c1e;
`;

const ErrorDesc = styled.p`
  font-size: 14px;
  color: #64748b;
`;

const RetryBtn = styled.button`
  margin-top: 4px;
  padding: 8px 24px;
  background: #3d646c;
  color: white;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;

  &:hover { background: #244c54; }
`;

/* 빈 상태 */
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 0;
  text-align: center;
`;

const EmptyTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #191c1e;
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: #64748b;
`;

const EmptyAddBtn = styled.button`
  margin-top: 8px;
  padding: 10px 28px;
  background: #3d646c;
  color: white;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, transform 0.1s;

  &:hover {
    background: #244c54;
    transform: translateY(-1px);
  }
`;
