import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { NAV_LINKS } from '../../data/homeData';
import api from '../../../app/api/axios';
import NotificationBell from '../home/NotificationBell';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);

  const navi = useNavigate();
  const location = useLocation(); // 경로 변경 감지를 위해 추가

  const validateToken = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setMemberInfo(null);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setMemberInfo(res.data);
    } catch (error) {
      setMemberInfo(null);
    }
  };

  useEffect(() => {
    // 1. 스크롤 이벤트
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // 2. 초기 로드 시 검증
    validateToken();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]); // 페이지 이동 시마다 토큰 유효성 체크 (선택 사항)

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setMemberInfo(null);
    navi('/home');
  };

  return (
    <Nav $scrolled={scrolled}>
      <Inner>
        <Left>
          <Logo to="/home">모래묻은 키보드</Logo>
        </Left>
        <Center>
          <Links>
            {NAV_LINKS.map((link) => (
              <NavItem key={link.label} to={link.path} end>
                {link.label}
              </NavItem>
            ))}
          </Links>
        </Center>
        <Right>
          {memberInfo ? (
            <>
              <NotificationBell />

              <ProfileMenu>
                <ProfileButton>
                  <ProfileName>{memberInfo.name} 님</ProfileName>
                  <ChevronDown size={16} />
                </ProfileButton>

                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      navi('/mypage');
                    }}
                  >
                    마이페이지
                  </DropdownItem>

                  <DropdownItem
                    onClick={() => {
                      navi('/mypage/reservation');
                    }}
                  >
                    예약 내역
                  </DropdownItem>

                  <DropdownItem
                    onClick={() => {
                      navi('/mypage/coupon');
                    }}
                  >
                    쿠폰함
                  </DropdownItem>

                  <DropdownDivider />

                  <LogoutItem onClick={handleLogout}>로그아웃</LogoutItem>
                </DropdownMenu>
              </ProfileMenu>
            </>
          ) : (
            <LoginBtn onClick={() => navi('/login')}>로그인</LoginBtn>
          )}
        </Right>
      </Inner>
    </Nav>
  );
}

/* ── Styled Components ── */

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 80px;
  background: ${({ $scrolled }) =>
    $scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.85)'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: ${({ theme }) => theme.shadows.nav};
  transition: background 0.3s;
`;

const Inner = styled.div`
  max-width: 100%;
  padding: 0 40px;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  margin-right: 80px;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(NavLink)`
  font-size: 24px;
  font-weight: 700;
  background: ${({ theme }) => theme.gradients.logo};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
`;

const NavItem = styled(NavLink)`
  padding: 8px 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMid};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    background 0.2s,
    color 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.textDark};
  }

  /* react-router NavLink의 active 클래스 */
  &.active {
    color: #0284c7;
    border-radius: 0;
    border-bottom: 2px solid #7dd3fc;
    padding-bottom: 6px;
  }
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LoginBtn = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMid};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;
const ProfileMenu = styled.div`
  position: relative;

  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const ProfileButton = styled.button`
  height: 42px;
  padding: 0 18px;

  display: flex;
  align-items: center;
  gap: 8px;

  border: none;
  border-radius: 999px;

  background-color: #4d6c75;
  color: white;

  cursor: pointer;

  transition: background-color 0.2s;

  &:hover {
    background-color: #3f6971;
  }
`;

const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 600;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 54px;
  right: 0;

  width: 220px;

  background-color: white;
  border-radius: 20px;

  padding: 10px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);

  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);

  transition: all 0.2s ease;

  z-index: 999;
`;

const DropdownItem = styled.button`
  width: 100%;
  height: 46px;

  border: none;
  border-radius: 14px;

  background: none;

  display: flex;
  align-items: center;

  padding: 0 14px;

  font-size: 14px;
  color: #4b5563;

  cursor: pointer;

  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f6f8;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: #edf1f4;
  margin: 8px 0;
`;

const LogoutItem = styled(DropdownItem)`
  color: #ef4444;

  &:hover {
    background-color: #fef2f2;
  }
`;
