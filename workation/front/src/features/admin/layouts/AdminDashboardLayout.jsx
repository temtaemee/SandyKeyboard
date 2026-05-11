// src/features/admin/layouts/AdminDashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import AdminHeader from '../components/dashboard/AdminHeader';

/**
 * 관리자 대시보드 전용 레이아웃
 *
 * 공통 Header/Footer(Layout.jsx) 대신 사이드바 + 자체 헤더를 사용합니다.
 * AdminRouter.jsx에서 이 레이아웃을 부모 라우트로 설정하면
 * 자식 라우트들이 <Outlet /> 자리에 렌더링됩니다.
 */
export default function AdminDashboardLayout() {
  return (
    <Wrapper>
      <AdminSidebar />
      <ContentArea>
        <AdminHeader />
        <Main>
          <Outlet />
        </Main>
      </ContentArea>

      {/* 피그마 FAB 버튼 */}
      <Fab title="빠른 등록">
        <PlusIcon />
      </Fab>
    </Wrapper>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(90deg, #f8f9ff 0%, #f8f9ff 100%);
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 256px;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  padding: 64px 32px 71.5px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1440px;
  width: 100%;
`;

const Fab = styled.button`
  position: fixed;
  bottom: 31.5px;
  right: 32px;
  width: 56px; height: 56px;
  background: #244c54;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  transition: background 0.2s, transform 0.1s;
  z-index: 40;

  &:hover {
    background: #3d646c;
    transform: translateY(-2px);
  }
`;
