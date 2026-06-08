import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { User, Building2, CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../../app/api/axios';

const ACCENT = '#3ec9a7';

export default function AccountPage() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    api.get('/seller/me')
      .then((res) => {
        setMember(res.data);
        setPhone(res.data.phone ?? '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/user/member', { phone });
      showToast('프로필이 저장되었습니다.');
    } catch (e) {
      showToast(e.response?.data?.message ?? '저장에 실패했습니다.', false);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePw = async () => {
    setPwError('');
    if (!pwForm.current) { setPwError('현재 비밀번호를 입력하세요.'); return; }
    if (pwForm.next.length < 8) { setPwError('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('새 비밀번호가 일치하지 않습니다.'); return; }

    setPwSaving(true);
    try {
      await api.patch('/user/member', {
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
        newPasswordCheck: pwForm.confirm,
      });
      setPwForm({ current: '', next: '', confirm: '' });
      showToast('비밀번호가 변경되었습니다.');
    } catch (e) {
      showToast(e.response?.data?.message ?? '비밀번호 변경에 실패했습니다.', false);
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <Wrap>
        <LoadScreen>프로필 로딩 중...</LoadScreen>
      </Wrap>
    );
  }

  return (
    <Wrap>
      {toast && (
        <Toast $ok={toast.ok}>
          {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </Toast>
      )}

      <PageHeader>
        <TitleGroup>
          <PageTitle>계정 관리</PageTitle>
          <PageSub>셀러 계정 및 사업자 정보를 관리합니다</PageSub>
        </TitleGroup>
      </PageHeader>

      <BigCard>
        {/* 상단 행: 기본 정보 | 비밀번호 변경 */}
        <TopRow>
          <CellBlock>
            <SectionHeader>
              <SectionIcon $bg="#dbeafe"><User size={16} color="#1d4ed8" /></SectionIcon>
              <SectionTitle>기본 정보</SectionTitle>
              <RoleBadge>SELLER</RoleBadge>
            </SectionHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>이름</FieldLabel>
                <FieldValue>{member?.name ?? '-'}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>이메일</FieldLabel>
                <FieldValue>{member?.email ?? '-'}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>연락처</FieldLabel>
                <FieldInput
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="연락처 입력"
                />
              </Field>
            </FieldGroup>
            <SaveBtn onClick={handleSaveProfile} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </SaveBtn>
          </CellBlock>

          <ColDivider />

          <CellBlock>
            <SectionHeader>
              <SectionIcon $bg="#fef3c7"><Lock size={16} color="#d97706" /></SectionIcon>
              <SectionTitle>비밀번호 변경</SectionTitle>
            </SectionHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>현재 비밀번호</FieldLabel>
                <FieldInput
                  type="password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                  placeholder="현재 비밀번호 입력"
                  $error={!!pwError && !pwForm.current}
                />
              </Field>
              <Field>
                <FieldLabel>새 비밀번호</FieldLabel>
                <FieldInput
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
                  placeholder="8자 이상"
                />
              </Field>
              <Field>
                <FieldLabel>새 비밀번호 확인</FieldLabel>
                <FieldInput
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="비밀번호 재입력"
                  $error={!!pwError && pwForm.next !== pwForm.confirm}
                />
              </Field>
            </FieldGroup>
            {pwError && (
              <ErrorMsg>
                <AlertCircle size={13} />
                {pwError}
              </ErrorMsg>
            )}
            <SaveBtn
              onClick={handleChangePw}
              disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
            >
              {pwSaving ? '변경 중...' : '비밀번호 변경'}
            </SaveBtn>
          </CellBlock>
        </TopRow>

        <Divider />

        {/* 하단 행: 사업자 정보 | 정산 계좌 */}
        <TopRow>
          <CellBlock>
            <SectionHeader>
              <SectionIcon $bg="#dcfce7"><Building2 size={16} color="#15803d" /></SectionIcon>
              <SectionTitle>사업자 정보</SectionTitle>
            </SectionHeader>
            <Field>
              <FieldLabel>사업자번호</FieldLabel>
              <FieldValue $muted>{member?.businessNo ?? '-'}</FieldValue>
            </Field>
          </CellBlock>

          <ColDivider />

          <CellBlock>
            <SectionHeader>
              <SectionIcon $bg="#ffedd5"><CreditCard size={16} color="#c2410c" /></SectionIcon>
              <SectionTitle>정산 계좌</SectionTitle>
            </SectionHeader>
            <FieldGroup>
              <Field>
                <FieldLabel>은행</FieldLabel>
                <FieldValue $muted>{member?.bankName ?? '-'}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>계좌번호</FieldLabel>
                <FieldValue $muted>{member?.account ?? '-'}</FieldValue>
              </Field>
              <Field>
                <FieldLabel>예금주</FieldLabel>
                <FieldValue $muted>{member?.accountName ?? '-'}</FieldValue>
              </Field>
            </FieldGroup>
            <InfoNote>
              <AlertCircle size={13} />
              계좌 정보 변경은 고객센터(help@workation.kr)를 통해 신청하세요.
            </InfoNote>
          </CellBlock>
        </TopRow>
      </BigCard>
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LoadScreen = styled.div`
  padding: 60px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ $ok }) => ($ok ? '#1e293b' : '#b91c1c')};
  color: white;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

const PageHeader = styled.div``;
const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;

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

const BigCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  align-items: stretch;
`;

const CellBlock = styled.div`
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ColDivider = styled.div`
  width: 1px;
  background: ${({ theme }) => theme.colors.borderLight};
  flex-shrink: 0;
`;


const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  flex: 1;
`;

const ApiTag = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  background: ${({ theme }) => theme.colors.borderLight};
  padding: 2px 8px;
  border-radius: 999px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FieldValue = styled.p`
  font-size: 14px;
  color: ${({ $muted, theme }) => ($muted ? theme.colors.textMuted : theme.colors.adminTextDark)};
  font-weight: ${({ $muted }) => ($muted ? '400' : '500')};
`;

const FieldInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ $error, theme }) => ($error ? '#f87171' : theme.colors.border)};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  background: white;
  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? '#f87171' : ACCENT)};
    box-shadow: 0 0 0 3px ${({ $error }) => ($error ? '#fee2e250' : `${ACCENT}22`)};
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  background: ${ACCENT}20;
  color: ${ACCENT};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  align-self: flex-start;
`;

const SaveBtn = styled.button`
  align-self: flex-end;
  height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#e2e8f0' : ACCENT)};
  color: ${({ disabled }) => (disabled ? '#94a3b8' : 'white')};
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
`;

const InfoNote = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgSection};
  padding: 10px 12px;
  border-radius: 8px;
  line-height: 1.5;
`;

const ErrorMsg = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #b91c1c;
  background: #fee2e2;
  padding: 8px 12px;
  border-radius: 6px;
`;
