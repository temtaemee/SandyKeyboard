// src/features/admin/components/dashboard/AdminHeader.jsx
import styled from 'styled-components';

export default function AdminHeader() {
  return (
    <Header>
      <div />

      {/* 우측 */}
      <Right>
        <AdminInfo>
          <InfoText>
            <AdminName>관리자 계정</AdminName>
            <AdminRole>시스템 관리자</AdminRole>
          </InfoText>
          <AdminAvatar>관</AdminAvatar>
        </AdminInfo>
      </Right>
    </Header>
  );
}

/* ── Styled Components ── */

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const AdminName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.4;
`;

const AdminRole = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
`;

const AdminAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.adminPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
`;
