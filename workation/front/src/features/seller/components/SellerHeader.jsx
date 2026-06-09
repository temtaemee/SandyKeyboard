// src/features/seller/components/SellerHeader.jsx
import styled from 'styled-components';
import useAuth from '../../member/hooks/useAuth';

export default function SellerHeader() {
  const { memberInfo } = useAuth();
  const displayName = memberInfo?.name ? `${memberInfo.name} 셀러` : '셀러';
  const avatarChar = memberInfo?.name?.[0] ?? '셀';

  return (
    <Header>
      <div />

      {/* 우측 */}
      <Right>
        <SellerInfo>
          <InfoText>
            <SellerName>{displayName}</SellerName>
            <SellerRole>워케이션 셀러</SellerRole>
          </InfoText>
          <SellerAvatar>{avatarChar}</SellerAvatar>
        </SellerInfo>
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

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SellerName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.4;
`;

const SellerRole = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
`;

const SellerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: #1c3442;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: white;
`;
