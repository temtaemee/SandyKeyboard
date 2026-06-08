import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { spaceApi } from '../../api/spaceApi';
import SpaceEditForm from '../../components/space/SpaceEditForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SpaceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [toast, setToast] = useState(null);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await spaceApi.getOne(id);
        setSpace(res.data);
      } catch (e) {
        setError(e.response?.data?.message ?? '공간 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (dto, pictureChanges) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await spaceApi.update(id, dto);

      if (pictureChanges) {
        const formData = new FormData();
        const picDto = {
          keepPictureIds: pictureChanges.keepPictureIds,
          mainPictureId: pictureChanges.mainPictureId ?? null,
          newPictures: pictureChanges.newPictures,
          categoryUpdates: pictureChanges.categoryUpdates ?? [],
        };
        formData.append('dto', new Blob([JSON.stringify(picDto)], { type: 'application/json' }));
        pictureChanges.files.forEach(file => formData.append('files', file));
        await spaceApi.updatePictures(id, formData);
      }

      setToast('수정이 완료되었습니다.');
      setSpace(prev => prev ? { ...prev, approvalStatus: prev.approvalStatus } : prev);
      setTimeout(() => navigate(`/seller/spaces/${id}`), 1000);
    } catch (e) {
      setSubmitError(e.response?.data?.message ?? '수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestApproval = async () => {
    setRequesting(true);
    try {
      await spaceApi.requestApproval(id);
      setSpace(prev => prev ? { ...prev, approvalStatus: 'PENDING' } : prev);
      setToast('승인 요청을 보냈습니다.');
    } catch {
      setToast('요청에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <LoadingSpinner centered />;

  if (error) {
    return (
      <Wrap>
        <ErrorMsg>{error}</ErrorMsg>
        <RetryBtn onClick={() => window.location.reload()}>다시 시도</RetryBtn>
      </Wrap>
    );
  }

  return (
    <Wrap>
      {toast && <Toast>{toast}</Toast>}

      <TopBar>
        <BackBtn type="button" onClick={() => navigate(`/seller/spaces/${id}`)}>
          <ArrowLeft size={18} />
          공간 상세
        </BackBtn>
        <TitleGroup>
          <PageTitle>공간 수정</PageTitle>
          <PageSub>{space?.name}</PageSub>
        </TitleGroup>
        <TopBarRight>
          {space?.approvalStatus && (
            <ApprovalBadge $status={space.approvalStatus}>
              {{ PENDING: '승인 대기중', APPROVED: '승인됨', REJECTED: '반려됨' }[space.approvalStatus]}
            </ApprovalBadge>
          )}
          {(space?.approvalStatus === 'REJECTED' || space?.approvalStatus === 'APPROVED') && (
            <ReApproveBtn
              type="button"
              onClick={handleRequestApproval}
              disabled={requesting}
            >
              {requesting ? '요청 중...' : '재승인 요청'}
            </ReApproveBtn>
          )}
          {space?.approvalStatus === 'REJECTED' && space?.rejectionReason && (
            <RejectionNote>반려 사유: {space.rejectionReason}</RejectionNote>
          )}
        </TopBarRight>
      </TopBar>

      <FormCard>
        {submitError && <SubmitError>{submitError}</SubmitError>}
        <SpaceEditForm space={space} onSubmit={handleSubmit} loading={submitting} />
      </FormCard>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.adminTextDark}; }
  white-space: nowrap;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const STATUS_COLOR = {
  PENDING:  { bg: '#fef3c7', color: '#92400e' },
  APPROVED: { bg: '#d1fae5', color: '#065f46' },
  REJECTED: { bg: '#fee2e2', color: '#991b1b' },
};

const ApprovalBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${({ $status }) => STATUS_COLOR[$status]?.bg ?? '#f1f5f9'};
  color: ${({ $status }) => STATUS_COLOR[$status]?.color ?? '#475569'};
`;

const ReApproveBtn = styled.button`
  height: 34px;
  padding: 0 16px;
  border-radius: 8px;
  background: #3ec9a7;
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const RejectionNote = styled.p`
  font-size: 12px;
  color: #991b1b;
  background: #fee2e2;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #fca5a5;
  max-width: 300px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const PageSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FormCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 32px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubmitError = styled.p`
  font-size: 13px;
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px 16px;
  border-radius: 8px;
`;

const ErrorMsg = styled.p`
  font-size: 14px;
  color: #b91c1c;
  padding: 48px;
  text-align: center;
`;

const RetryBtn = styled.button`
  margin: 0 auto;
  display: block;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  cursor: pointer;
  font-family: inherit;
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
