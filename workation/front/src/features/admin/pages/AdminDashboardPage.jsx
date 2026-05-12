// src/features/admin/pages/AdminDashboardPage.jsx
import styled from 'styled-components';
import AdminStatCards from '../components/dashboard/AdminStatCards';
import AdminChartPanel from '../components/dashboard/AdminChartPanel';
import AdminPaymentTable from '../components/dashboard/AdminPaymentTable';

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
          <PageSub>실시간 판매 성과 및 최근 활동 요약</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* 통계 카드 4개 */}
      <AdminStatCards />

      {/* 차트 + 지역별 순위 */}
      <AdminChartPanel />

      {/* 결제 내역 테이블 */}
      <AdminPaymentTable />
    </>
  );
}

/* ── Styled Components ── */

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
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

