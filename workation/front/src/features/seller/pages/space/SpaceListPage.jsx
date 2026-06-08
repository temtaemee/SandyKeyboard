import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Building2, RefreshCw } from 'lucide-react';
import useSpaces from '../../hooks/useSpaces';
import SpaceTable from '../../components/space/SpaceTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ACCENT = '#3ec9a7';

export default function SpaceListPage() {
  const navigate = useNavigate();
  const { spaces, loading, error, fetchMySpaces, deleteSpace, toggleVisible } = useSpaces();

  const [togglingIds, setTogglingIds] = useState(new Set());
  const [deleteTarget, setDeleteTarget] = useState(null); // id to delete
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMySpaces();
  }, []); // eslint-disable-line

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
      await deleteSpace(deleteTarget);
      showToast('공간이 삭제되었습니다.');
    } catch {
      showToast('삭제에 실패했습니다.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Wrap>
      {toast && <Toast>{toast}</Toast>}

      {/* 페이지 헤더 */}
      <PageHeader>
        <TitleGroup>
          <PageTitle>공간 관리</PageTitle>
          <PageSub>등록된 공간 목록을 관리합니다</PageSub>
        </TitleGroup>
        <HeaderActions>
          <RefreshBtn type="button" onClick={() => fetchMySpaces()} disabled={loading}>
            <RefreshCw size={15} />
          </RefreshBtn>
          <RegisterBtn type="button" onClick={() => navigate('/seller/spaces/register')}>
            <Plus size={16} />
            공간 등록
          </RegisterBtn>
        </HeaderActions>
      </PageHeader>

      {/* 콘텐츠 */}
      <Card>
        {loading ? (
          <LoadingSpinner centered />
        ) : error ? (
          <ErrorState>
            <ErrorMsg>{error}</ErrorMsg>
            <RetryBtn type="button" onClick={() => fetchMySpaces()}>다시 시도</RetryBtn>
          </ErrorState>
        ) : spaces.length === 0 ? (
          <EmptyState
            icon={<Building2 size={40} />}
            title="등록된 공간이 없습니다"
            description="새 공간을 등록하면 스테이(객실)를 추가할 수 있습니다."
            actionLabel="공간 등록하기"
            onAction={() => navigate('/seller/spaces/register')}
          />
        ) : (
          <SpaceTable
            spaces={spaces}
            onToggleVisible={handleToggleVisible}
            onDetail={(id) => navigate(`/seller/spaces/${id}`)}
            onEdit={(id) => navigate(`/seller/spaces/${id}/edit`)}
            onDelete={(id) => setDeleteTarget(id)}
            togglingIds={togglingIds}
          />
        )}
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteTarget != null}
        title="공간을 삭제하시겠습니까?"
        message="공간을 삭제하면 연결된 스테이 데이터도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
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
