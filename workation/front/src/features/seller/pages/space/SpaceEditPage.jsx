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
          newPictures: pictureChanges.newPictures,
        };
        formData.append('dto', new Blob([JSON.stringify(picDto)], { type: 'application/json' }));
        pictureChanges.files.forEach(file => formData.append('files', file));
        await spaceApi.updatePictures(id, formData);
      }

      setToast('수정이 완료되었습니다.');
      setTimeout(() => navigate(`/seller/spaces/${id}`), 1000);
    } catch (e) {
      setSubmitError(e.response?.data?.message ?? '수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
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
