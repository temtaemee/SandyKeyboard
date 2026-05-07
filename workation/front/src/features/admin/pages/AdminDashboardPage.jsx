// src/features/admin/pages/AdminDashboardPage.jsx
import styled from 'styled-components';
import AdminStatCards from '../components/dashboard/AdminStatCards';
import AdminChartPanel from '../components/dashboard/AdminChartPanel';
import AdminActivityTable from '../components/dashboard/AdminActivityTable';

/**
 * 관리자 대시보드 메인 페이지
 * AdminDashboardLayout 안에서 렌더링됩니다.
 */
export default function AdminDashboardPage() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>대시보드 개요</PageTitle>
          <PageSub>실시간 성과 지표 및 최근 관리 활동 요약</PageSub>
        </PageTitleGroup>
        <HeaderActions>
          <ExportBtn>
            <DownloadIcon />
            보고서 내보내기
          </ExportBtn>
          <RegisterBtn>
            <PlusIcon />
            신규 숙소 등록
          </RegisterBtn>
        </HeaderActions>
      </PageHeader>

      {/* 통계 카드 4개 */}
      <AdminStatCards />

      {/* 차트 + 알림 */}
      <AdminChartPanel />

      {/* 활동 로그 테이블 */}
      <AdminActivityTable />
    </>
  );
}

/* ── Icons ── */
function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

/* ── Styled Components ── */

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #0d1c2e;
  letter-spacing: -0.24px;
  line-height: 1.33;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: #64748b;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ExportBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 17px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  font-family: inherit;
  transition: background 0.15s;

  &:hover { background: #f8fafc; }
`;

const RegisterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: #244c54;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  font-family: inherit;
  transition: background 0.15s;

  &:hover { background: #3d646c; }
`;
