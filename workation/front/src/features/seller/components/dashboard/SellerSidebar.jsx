// src/features/seller/components/dashboard/SellerSidebar.jsx
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { SELLER_NAV_ITEMS } from '../../data/dashboardData';

const ICONS = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  chart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  bookmark: (
    <svg width="18" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  plus: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d646c" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

export default function SellerSidebar() {
  return (
    <Aside>
      {/* 로고 */}
      <LogoArea>
        <LogoIcon>
          <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
            <rect width="20" height="3" rx="1.5" fill="white" />
            <rect y="4" width="14" height="3" rx="1.5" fill="white" />
            <rect y="8" width="8" height="3" rx="1.5" fill="white" />
          </svg>
        </LogoIcon>
        <LogoText>
          <LogoTitle>판매자 센터</LogoTitle>
          <LogoSub>모래묻은 키보드</LogoSub>
        </LogoText>
      </LogoArea>

      {/* 네비게이션 - NavLink로 활성 상태 자동 처리 */}
      <Nav>
        {SELLER_NAV_ITEMS.map((item) => (
          <NavItem key={item.id} to={item.path}>
            <IconWrap>{ICONS[item.icon]}</IconWrap>
            <NavLabel>{item.label}</NavLabel>
          </NavItem>
        ))}
      </Nav>

      {/* 새 숙소 등록 버튼 */}
      <AddBtnWrapper>
        <AddBtn>
          <AddBtnInner>
            {ICONS.plus}
            <span>새 숙소 등록</span>
          </AddBtnInner>
        </AddBtn>
      </AddBtnWrapper>
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
  background: #f7f9fb;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  z-index: 50;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 32px;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #3d646c;
  border-radius: 12px;
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
  font-size: 18px;
  font-weight: 500;
  color: #3d646c;
  line-height: 1.4;
`;

const LogoSub = styled.p`
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
  overflow-y: auto;
`;

// NavLink의 active 클래스를 활용해 활성 스타일 적용
const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #475569;
  border-right: 4px solid transparent;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #eef2f4;
    color: #3d646c;
  }

  /* react-router NavLink active 클래스 자동 적용 */
  &.active {
    background: white;
    color: #3d646c;
    border-right-color: #3d646c;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
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

const AddBtnWrapper = styled.div`
  padding: 0 16px;
  margin-top: 8px;
`;

const AddBtn = styled.div`
  background: linear-gradient(136.97deg, #3d646c 0%, #a9deff 50%, #b9aa83 100%);
  border-radius: 9999px;
  padding: 6px;
`;

const AddBtnInner = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  border-radius: 9999px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #3d646c;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;
