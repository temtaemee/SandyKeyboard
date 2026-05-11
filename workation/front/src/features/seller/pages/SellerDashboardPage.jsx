// src/features/seller/pages/SellerDashboardPage.jsx
import SummaryCards from '../components/dashboard/SummaryCards';
import SalesChart from '../components/dashboard/SalesChart';
import ReservationTable from '../components/dashboard/ReservationTable';

/**
 * 판매자 매출 관리 대시보드 페이지
 * SellerDashboardLayout 안에서 렌더링됩니다.
 * (레이아웃이 사이드바/헤더를 감싸줌)
 */
export default function SellerDashboardPage() {
  return (
    <>
      <SummaryCards />
      <SalesChart />
      <ReservationTable />
    </>
  );
}
