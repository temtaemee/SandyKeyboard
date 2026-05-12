import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { NAV_LINKS } from '../../data/homeData';
import api from '../../../app/api/axios';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navi = useNavigate();
  const location = useLocation(); // 경로 변경 감지를 위해 추가

  const validateToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      // 인터셉터가 토큰을 자동으로 실어주므로 경로만 적으면 됩니다.
      await api.get('/user/banks');
      setIsLoggedIn(true);
    } catch (error) {
      // 401/403 에러 발생 시 api.js 인터셉터가 이미 토큰을 지웠을 것이므로 상태만 변경
      setIsLoggedIn(false);
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
    setIsLoggedIn(false);
    navi('/');
  };

  return (
    <Nav $scrolled={scrolled}>
      <Inner>
        <Left>
          <Logo to="/">모래묻은 키보드</Logo>
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
          {isLoggedIn ? (
            <>
              <MyPageBtn onClick={() => navi('/mypage')}>마이페이지</MyPageBtn>
              <LogoutBtn onClick={handleLogout}>로그아웃</LogoutBtn>
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

const LogoutBtn = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: #ef4444; /* 빨간색 톤으로 로그아웃 강조 */
  cursor: pointer;
  background: none;
  border: none;
  &:hover {
    text-decoration: underline;
  }
`;

const MyPageBtn = styled.button`
  padding: 8px 20px;
  font-size: 15px;
  color: white;
  background: #4d6c75;
  border-radius: 20px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

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
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Logo = styled(NavLink)`
  font-size: 20px;
  font-weight: 500;
  background: ${({ theme }) => theme.gradients.logo};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex: 1;
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

const StartBtn = styled.button`
  padding: 10px 24px;
  font-size: 16px;
  color: white;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
  transition:
    background 0.2s,
    transform 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-1px);
  }
`;
