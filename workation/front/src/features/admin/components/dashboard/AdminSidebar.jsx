// src/features/admin/components/dashboard/AdminSidebar.jsx
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ADMIN_NAV_ITEMS } from '../../data/adminDashboardData';

const ICONS = {
  chart: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  home: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  bookmark: (
    <svg
      width="18"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  users: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  file: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  coin: (
    <svg
      width="22"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  support: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  logout: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  board: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
};

export default function AdminSidebar() {
  return (
    <Aside>
      {/* 로고 */}
      <LogoArea>
        <LogoIcon>
          <svg width="15" height="10.5" viewBox="0 0 20 11" fill="none">
            <rect width="20" height="3" rx="1.5" fill="white" />
            <rect y="4" width="14" height="3" rx="1.5" fill="white" />
            <rect y="8" width="8" height="3" rx="1.5" fill="white" />
          </svg>
        </LogoIcon>
        <LogoText>
          <LogoTitle>모래 덮인 키보드</LogoTitle>
          <LogoSub>워케이션 관리자</LogoSub>
        </LogoText>
      </LogoArea>

      {/* 메인 네비게이션 */}
      <Nav>
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavItem key={item.id} to={item.path}>
            <IconWrap>{ICONS[item.icon]}</IconWrap>
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        ))}
      </Nav>

      {/* 하단 메뉴 */}
      <BottomNav>
        <Divider />
        <BottomItem to="/admin/logout">
          <IconWrap>{ICONS.logout}</IconWrap>
          <NavLabel>로그아웃</NavLabel>
        </BottomItem>
      </BottomNav>
    </Aside>
  );
}

/* ── Styled Components ── */

const Aside = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 256px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  z-index: 50;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 32px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.adminPrimary};
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminPrimary};
  line-height: 1.25;
`;

const LogoSub = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 1.1px;
  text-transform: uppercase;
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  border-left: 4px solid transparent;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: rgba(36, 76, 84, 0.06);
    color: ${({ theme }) => theme.colors.adminPrimaryLight};
  }

  &.active {
    background: rgba(36, 76, 84, 0.05);
    color: ${({ theme }) => theme.colors.adminPrimaryLight};
    border-left-color: ${({ theme }) => theme.colors.adminPrimaryLight};
  }
`;

const IconWrap = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const NavLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const BottomNav = styled.div`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.borderLight};
  margin-bottom: 16px;
`;

const BottomItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition:
    background 0.15s,
    color 0.15s;
  border-left: 4px solid transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
    color: ${({ theme }) => theme.colors.adminPrimaryLight};
  }
`;
