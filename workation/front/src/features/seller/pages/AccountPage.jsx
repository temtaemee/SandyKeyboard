import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { User, Building2, CreditCard, AlertCircle } from 'lucide-react';
import api from '../../../app/api/axios';

const ACCENT = '#3ec9a7';

export default function AccountPage() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/me')
      .then((res) => setMember(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Wrap>
        <LoadScreen>프로필 로딩 중...</LoadScreen>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>계정 관리</PageTitle>
          <PageSub>셀러 계정 및 사업자 정보를 관리합니다</PageSub>
        </TitleGroup>
      </PageHeader>

      <BigCard>
        <ContentGrid>
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
                <FieldValue>{member?.phone ?? '-'}</FieldValue>
              </Field>
            </FieldGroup>
          </CellBlock>

          <SideColumn>
            <PanelBlock>
              <SectionHeader>
                <SectionIcon $bg="#dcfce7"><Building2 size={16} color="#15803d" /></SectionIcon>
                <SectionTitle>사업자 정보</SectionTitle>
              </SectionHeader>
              <Field>
                <FieldLabel>사업자번호</FieldLabel>
                <FieldValue $muted>{member?.businessNo ?? '-'}</FieldValue>
              </Field>
            </PanelBlock>

            <PanelBlock>
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
            </PanelBlock>
          </SideColumn>
        </ContentGrid>
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
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CellBlock = styled.div`
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right: 1px solid ${({ theme }) => theme.colors.borderLight};

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  }
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const PanelBlock = styled.div`
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  }
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

