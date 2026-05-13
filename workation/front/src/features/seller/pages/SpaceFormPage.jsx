import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { spaceApi } from '../api/spaceApi';

const AREA_OPTIONS = [
  { value: 'soeul', label: '서울' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'gangwon', label: '강원' },
  { value: 'chungnam', label: '충남' },
  { value: 'chungbuk', label: '충북' },
  { value: 'gyeongnam', label: '경남' },
  { value: 'gyeongbuk', label: '경북' },
  { value: 'jeonnam', label: '전남' },
  { value: 'jeonbuk', label: '전북' },
  { value: 'jeju', label: '제주' },
];

const INIT = {
  name: '', phone: '', email: '', summary: '',
  description: '', address1: '', address2: '',
  area: '', latitude: '', longitude: '',
};

export default function SpaceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    spaceApi.getOne(id)
      .then(({ data }) => setForm({
        name: data.name ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
        summary: data.summary ?? '',
        description: data.description ?? '',
        address1: data.address1 ?? '',
        address2: data.address2 ?? '',
        area: data.area ?? '',
        latitude: data.latitude ?? '',
        longitude: data.longitude ?? '',
      }))
      .catch(() => setError('공간 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = ({ target: { name, value } }) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      latitude: form.latitude === '' ? null : Number(form.latitude),
      longitude: form.longitude === '' ? null : Number(form.longitude),
      arcadeIdList: [],
    };

    try {
      if (isEdit) {
        await spaceApi.update(id, payload);
      } else {
        await spaceApi.create(payload);
      }
      navigate('/seller/spaces');
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || (isEdit ? '수정 중 오류가 발생했습니다.' : '등록 중 오류가 발생했습니다.'));
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingWrap>불러오는 중...</LoadingWrap>;

  return (
    <Wrap>
      <PageHeader>
        <BackBtn type="button" onClick={() => navigate('/seller/spaces')}>
          <ChevronIcon /> 공간 목록
        </BackBtn>
        <TitleGroup>
          <PageTitle>{isEdit ? '공간 수정' : '새 공간 등록'}</PageTitle>
          <PageSub>
            {isEdit
              ? '공간 정보를 수정합니다.'
              : '공간을 등록하고 숙소·오피스를 추가하세요.'}
          </PageSub>
        </TitleGroup>
      </PageHeader>

      <FormCard as="form" onSubmit={handleSubmit}>
        {error && (
          <ErrorBanner>
            <AlertIcon /> {error}
          </ErrorBanner>
        )}

        {/* 기본 정보 */}
        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <FieldGrid>
            <Field>
              <Label>공간명 <Req>*</Req></Label>
              <Input
                name="name" value={form.name} onChange={handleChange}
                placeholder="공간 이름" required maxLength={100}
              />
            </Field>
            <Field>
              <Label>지역 <Req>*</Req></Label>
              <Select name="area" value={form.area} onChange={handleChange} required>
                <option value="">지역 선택</option>
                {AREA_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label>전화번호 <Req>*</Req></Label>
              <Input
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="01012345678" required maxLength={12}
              />
            </Field>
            <Field>
              <Label>이메일 <Req>*</Req></Label>
              <Input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="contact@space.com" required
              />
            </Field>
          </FieldGrid>
        </Section>

        <Divider />

        {/* 소개 */}
        <Section>
          <SectionTitle>소개</SectionTitle>
          <Field>
            <Label>한 줄 소개 <Req>*</Req></Label>
            <Input
              name="summary" value={form.summary} onChange={handleChange}
              placeholder="공간을 한 문장으로 소개하세요" required
            />
          </Field>
          <Field>
            <Label>상세 설명 <Req>*</Req></Label>
            <Textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="시설, 특징, 이용 안내 등을 자세히 설명하세요"
              required rows={5}
            />
          </Field>
        </Section>

        <Divider />

        {/* 주소 */}
        <Section>
          <SectionTitle>주소</SectionTitle>
          <Field>
            <Label>주소 <Req>*</Req></Label>
            <Input
              name="address1" value={form.address1} onChange={handleChange}
              placeholder="시/도 시/군/구 도로명주소" required
            />
          </Field>
          <Field>
            <Label>상세 주소 <Req>*</Req></Label>
            <Input
              name="address2" value={form.address2} onChange={handleChange}
              placeholder="층, 호수 등 상세 주소" required maxLength={100}
            />
          </Field>
          <FieldGrid>
            <Field>
              <Label>위도 <Optional>(선택)</Optional></Label>
              <Input
                type="number" step="any" name="latitude" value={form.latitude}
                onChange={handleChange} placeholder="37.5665"
              />
            </Field>
            <Field>
              <Label>경도 <Optional>(선택)</Optional></Label>
              <Input
                type="number" step="any" name="longitude" value={form.longitude}
                onChange={handleChange} placeholder="126.9780"
              />
            </Field>
          </FieldGrid>
        </Section>

        <FormFooter>
          <CancelBtn type="button" onClick={() => navigate('/seller/spaces')}>취소</CancelBtn>
          <SubmitBtn type="submit" disabled={submitting}>
            {submitting
              ? (isEdit ? '수정 중...' : '등록 중...')
              : (isEdit ? '수정 완료' : '공간 등록')}
          </SubmitBtn>
        </FormFooter>
      </FormCard>
    </Wrap>
  );
}

/* ── SVG ── */
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Styled ── */
const Wrap = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LoadingWrap = styled.div`
  padding: 80px 0;
  text-align: center;
  color: #64748b;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
  width: fit-content;
  transition: color 0.15s;
  &:hover { color: #244c54; }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 600;
  color: #244c54;
  letter-spacing: -0.5px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: #64748b;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 14px;
  border-bottom: 1px solid #fecaca;
`;

const Section = styled.div`
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #244c54;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #191c1e;
`;

const Req = styled.span`
  color: #dc2626;
  margin-left: 2px;
`;

const Optional = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
  margin-left: 4px;
`;

const inputBase = `
  width: 100%;
  padding: 9px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #191c1e;
  background: white;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: #3d646c; box-shadow: 0 0 0 3px rgba(61,100,108,0.08); }
  &::placeholder { color: #94a3b8; }
`;

const Input = styled.input`${inputBase}`;

const Select = styled.select`
  ${inputBase}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 34px;
`;

const Textarea = styled.textarea`
  ${inputBase}
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px 32px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
`;

const CancelBtn = styled.button`
  padding: 9px 22px;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 14px;
  color: #64748b;
  background: white;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: #94a3b8; color: #191c1e; }
`;

const SubmitBtn = styled.button`
  padding: 9px 26px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: #3d646c;
  transition: background 0.15s, transform 0.1s;
  &:hover:not(:disabled) { background: #244c54; transform: translateY(-1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
