// src/features/admin/components/dashboard/AdminSidebar.jsx
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ADMIN_NAV_ITEMS } from '../../data/adminDashboardData';
import { BarChart2, Home, Bookmark, Users, FileText, DollarSign, HelpCircle, LogOut, List } from 'lucide-react';

const ICONS = {
  chart:    <BarChart2 size={18} />,
  home:     <Home size={18} />,
  bookmark: <Bookmark size={18} />,
  users:    <Users size={18} />,
  file:     <FileText size={18} />,
  coin:     <DollarSign size={18} />,
  support:  <HelpCircle size={18} />,
  logout:   <LogOut size={18} />,
  board:    <List size={18} />,
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
