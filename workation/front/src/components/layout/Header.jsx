import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { NAV_LINKS } from "../../data/homeData";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  const navi = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Nav $scrolled={scrolled}>
      <Inner>
        <Left>
          <Logo to="/">모래묻은 키보드</Logo>
        </Left>

        <Center>
          <Links>
            {NAV_LINKS.map((link) => (
              <NavItem key={link} to="/" end>
                {link}
              </NavItem>
            ))}
          </Links>
        </Center>

        <Right>
          <LoginBtn
            onClick={() => {
              navi(`/user/login`);
            }}
          >
            로그인
          </LoginBtn>
          <StartBtn>시작하기</StartBtn>
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
    $scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)"};
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
