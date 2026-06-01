import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, BedDouble, RefreshCw } from 'lucide-react';
import useStays from '../../hooks/useStays';
import useSpaces from '../../hooks/useSpaces';
import StayTable from '../../components/stay/StayTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ACCENT = '#3ec9a7';

export default function StayListPage() {
  const navigate = useNavigate();
  const { stays, loading, error, fetchStayList, deleteStay, toggleVisible } = useStays();
  const { spaces, fetchMySpaces } = useSpaces();

  const [filters, setFilters] = useState({ spaceId: '', workationYn: '' });
  const [togglingIds, setTogglingIds] = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const spacesMap = Object.fromEntries(spaces.map((s) => [s.id, s.name]));

  useEffect(() => {
    fetchMySpaces();
    fetchStayList({});
  }, []); // eslint-disable-line

  // 백엔드가 spaceId 파라미터를 무시하므로 프론트에서 필터링
  const filteredStays = stays.filter((s) => {
    if (filters.spaceId && String(s.spaceId) !== String(filters.spaceId)) return false;
    if (filters.workationYn && s.workationYn !== filters.workationYn) return false;
    return true;
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleVisible = async (id, visibleYn) => {
    if (togglingIds.has(id)) return;
    setTogglingIds((prev) => new Set(prev).add(id));
    try {
      await toggleVisible(id, visibleYn);
    } catch {
      showToast('노출 상태 변경에 실패했습니다.');
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteStay(deleteTarget);
      showToast('스테이가 삭제되었습니다.');
    } catch {
      showToast('삭제에 실패했습니다.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Wrap>
      {toast && <Toast>{toast}</Toast>}

      {/* 페이지 헤더 */}
      <PageHeader>
        <TitleGroup>
          <PageTitle>스테이 관리</PageTitle>
          <PageSub>등록된 스테이 목록을 관리합니다</PageSub>
        </TitleGroup>
        <HeaderActions>
          <RefreshBtn
            type="button"
            onClick={() => fetchStayList({})}
            disabled={loading}
          >
            <RefreshCw size={15} />
          </RefreshBtn>
          <RegisterBtn type="button" onClick={() => navigate('/seller/stays/register')}>
            <Plus size={16} />
            스테이 등록
          </RegisterBtn>
        </HeaderActions>
      </PageHeader>

      {/* 필터 바 */}
      <FilterBar>
        <Select
          value={filters.spaceId}
          onChange={(e) => setFilter('spaceId', e.target.value)}
        >
          <option value="">전체 공간</option>
          {spaces.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>

        <Select
          value={filters.workationYn}
          onChange={(e) => setFilter('workationYn', e.target.value)}
        >
          <option value="">전체 유형</option>
          <option value="Y">워케이션</option>
          <option value="N">일반 숙박</option>
        </Select>
      </FilterBar>

      {/* 콘텐츠 */}
      <Card>
        {loading ? (
          <LoadingSpinner centered />
        ) : error ? (
          <ErrorState>
            <ErrorMsg>{error}</ErrorMsg>
            <RetryBtn type="button" onClick={() => fetchStayList({})}>다시 시도</RetryBtn>
          </ErrorState>
        ) : filteredStays.length === 0 ? (
          <EmptyState
            icon={<BedDouble size={40} />}
            title={filters.spaceId || filters.workationYn ? '해당 조건의 스테이가 없습니다' : '등록된 스테이가 없습니다'}
            description="공간에 스테이(객실)를 등록해보세요."
            actionLabel="스테이 등록하기"
            onAction={() => navigate('/seller/stays/register')}
          />
        ) : (
          <StayTable
            stays={filteredStays}
            spacesMap={spacesMap}
            onToggleVisible={handleToggleVisible}
            onDetail={(id) => navigate(`/seller/stays/${id}`)}
            onEdit={(id) => navigate(`/seller/stays/${id}/edit`)}
            onDelete={(id) => setDeleteTarget(id)}
            togglingIds={togglingIds}
          />
        )}
      </Card>

      <ConfirmDialog
        open={deleteTarget != null}
        title="스테이를 삭제하시겠습니까?"
        message="스테이를 삭제하면 예약 데이터에 영향을 미칠 수 있습니다. 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.4px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  background: white;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const RegisterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${ACCENT};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #31b08e; }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
`;

const Select = styled.select`
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${ACCENT}; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
  min-height: 200px;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
`;

const ErrorMsg = styled.p`
  font-size: 14px;
  color: #b91c1c;
`;

const RetryBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;
