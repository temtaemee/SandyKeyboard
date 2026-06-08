import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { stayApi } from '../../api/stayApi';
import { spaceApi } from '../../api/spaceApi';
import StayForm from '../../components/stay/StayForm';

export default function StayRegisterPage() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    spaceApi.getMySpaces()
      .then((res) => setSpaces(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (dto, files) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      files.forEach((file) => formData.append('files', file));

      const res = await stayApi.create(formData);
      const newId = res.data;
      navigate(`/seller/stays/${newId}`);
    } catch (e) {
      setSubmitError(e.response?.data?.message ?? '스테이 등록에 실패했습니다. 다시 시도해 주세요.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrap>
      <TopBar>
        <BackBtn type="button" onClick={() => navigate('/seller/stays')}>
          <ArrowLeft size={18} />
          스테이 목록
        </BackBtn>
        <TitleGroup>
          <PageTitle>스테이 등록</PageTitle>
          <PageSub>공간에 새 스테이(객실)를 등록합니다</PageSub>
        </TitleGroup>
      </TopBar>

      {submitError && <SubmitError>{submitError}</SubmitError>}

      <StayForm
        mode="create"
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
