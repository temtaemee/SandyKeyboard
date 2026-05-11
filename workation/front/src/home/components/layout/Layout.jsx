import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

/**
 * 공통 레이아웃 컴포넌트
 *
 * react-router-dom의 Outlet 패턴 사용
 * → App.jsx에서 이 컴포넌트를 부모 라우트로 설정하면
 *   자식 라우트(각 페이지)가 <Outlet /> 자리에 렌더링됨
 *
 * 다른 팀원이 페이지를 추가할 때:
 * 1. src/pages/YourPage.jsx 생성
 * 2. App.jsx의 라우트 배열에 한 줄 추가
 * → Header, Footer는 자동 적용됨!
 */
export default function Layout() {
  return (
    <Wrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  margin-top: 80px; /* Header 높이만큼 밀어주기 */
`;
