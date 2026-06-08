// src/features/seller/components/SellerSidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  CalendarDays,
  TrendingUp,
  CreditCard,
  Star,
  Tag,
  User,
  ExternalLink,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import { SELLER_NAV_ITEMS } from '../data/sellerConstants';

const ICONS = {
  chart: <LayoutDashboard size={18} />,
  building: <Building2 size={18} />,
  bed: <BedDouble size={18} />,
  calendar: <CalendarDays size={18} />,
  trending: <TrendingUp size={18} />,
  credit: <CreditCard size={18} />,
  star: <Star size={18} />,
  refund: <RotateCcw size={18} />,
  tag: <Tag size={18} />,
  user: <User size={18} />,
  external: <ExternalLink size={18} />,
  logout: <LogOut size={18} />,
};

// 셀러 사이드바 전용 색상 (dark navy theme)
const C = {
  bg: '#1c3442',
  accent: '#3ec9a7',
  text: 'rgba(255,255,255,0.80)',
  textMuted: 'rgba(255,255,255,0.50)',
  hover: 'rgba(255,255,255,0.06)',
  active: 'rgba(255,255,255,0.10)',
  divider: 'rgba(255,255,255,0.12)',
};

export default function SellerSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/home');
  };

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
          <LogoTitle>워케이션</LogoTitle>
          <LogoSub>셀러 센터</LogoSub>
        </LogoText>
      </LogoArea>

      {/* 메인 네비게이션 */}
      <Nav>
        {SELLER_NAV_ITEMS.map((item) => (
          <NavItem key={item.id} to={item.path} end={item.end}>
            <IconWrap>{ICONS[item.icon]}</IconWrap>
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        ))}
      </Nav>

      {/* 하단 메뉴 */}
      <BottomNav>
        <Divider />
        <BottomItem to="/">
          <IconWrap>{ICONS.external}</IconWrap>
          <NavLabel>유저 홈으로</NavLabel>
        </BottomItem>
        <LogoutBtn type="button" onClick={handleLogout}>
          <IconWrap>{ICONS.logout}</IconWrap>
          <NavLabel>로그아웃</NavLabel>
        </LogoutBtn>
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
  background: ${C.bg};
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
  background: ${C.accent};
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
  color: white;
  line-height: 1.25;
`;

const LogoSub = styled.p`
  font-size: 11px;
  color: ${C.textMuted};
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
  color: ${C.text};
  border-left: 4px solid transparent;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${C.hover};
    color: white;
  }

  &.active {
    background: ${C.active};
    color: white;
    border-left-color: ${C.accent};
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
  background: ${C.divider};
  margin-bottom: 16px;
`;

const BottomItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: ${C.text};
  transition:
    background 0.15s,
    color 0.15s;
  border-left: 4px solid transparent;

  &:hover {
    background: ${C.hover};
    color: white;
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  color: ${C.text};
  border-left: 4px solid transparent;
  transition:
    background 0.15s,
    color 0.15s;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: ${C.hover};
    color: white;
  }
`;
