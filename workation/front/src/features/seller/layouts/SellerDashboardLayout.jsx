// src/features/seller/layouts/SellerDashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import SellerSidebar from '../components/dashboard/SellerSidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

/**
 * 판매자 대시보드 전용 레이아웃
 *
 * SellerDefaultLayout 과 다르게 사이드바 + 자체 헤더를 사용합니다.
 * 공통 Header/Footer (Layout.jsx)를 사용하지 않습니다.
 *
 * SellerRouter.jsx 에서 이 레이아웃을 부모 라우트로 설정하면
 * 자식 라우트들이 <Outlet /> 자리에 렌더링됩니다.
 */
export default function SellerDashboardLayout() {
  return (
    <Wrapper>
      <SellerSidebar />
      <ContentArea>
        <DashboardHeader />
        <Main>
          <Outlet />
        </Main>
      </ContentArea>
    </Wrapper>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f7f9fb;
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 256px; /* 사이드바 너비만큼 밀어주기 */
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  padding: 64px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;
