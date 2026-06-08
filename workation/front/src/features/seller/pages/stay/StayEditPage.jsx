import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { stayApi } from '../../api/stayApi';
import { spaceApi } from '../../api/spaceApi';
import StayForm from '../../components/stay/StayForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function StayEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stay, setStay] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [stayRes, spaceRes] = await Promise.all([
          stayApi.getOne(id),
          spaceApi.getMySpaces(),
        ]);
        setStay(stayRes.data);
        setSpaces(spaceRes.data);
      } catch (e) {
        setError(e.response?.data?.message ?? '스테이 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (dto, _files, pictureChanges) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await stayApi.update(id, dto);

      if (pictureChanges) {
        const formData = new FormData();
        const picDto = {
          keepPictureIds: pictureChanges.keepPictureIds,
          mainPictureId:  pictureChanges.mainPictureId ?? null,
          newPictures:    pictureChanges.newPictures ?? [],
        };
        formData.append('dto', new Blob([JSON.stringify(picDto)], { type: 'application/json' }));
        (pictureChanges.newFiles ?? []).forEach(f => formData.append('files', f));
        await stayApi.updatePictures(id, formData);
      }

      setToast('스테이가 수정되었습니다.');
      setTimeout(() => navigate(`/seller/stays/${id}`), 1000);
    } catch (e) {
      setSubmitError(e.response?.data?.message ?? '수정에 실패했습니다. 다시 시도해 주세요.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <BackBtn type="button" onClick={() => navigate(`/seller/stays/${id}`)}>
          <ArrowLeft size={18} />
          스테이 상세
        </BackBtn>
        <TitleGroup>
          <PageTitle>스테이 수정</PageTitle>
          <PageSub>{stay?.name}</PageSub>
        </TitleGroup>
      </TopBar>

      {submitError && <SubmitError>{submitError}</SubmitError>}

      <StayForm
        mode="edit"
        initialData={stay}
        spaces={spaces}
        onSubmit={handleSubmit}
        loading={submitting}
      />
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

const SubmitError = styled.div`
  font-size: 13px;
  color: #b91c1c;
  background: #fee2e2;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fca5a5;
`;

const ErrorMsg = styled.p`
  font-size: 14px;
  color: #b91c1c;
  text-align: center;
  padding: 48px;
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
