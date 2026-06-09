// src/features/admin/hooks/useAdminDashboard.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAdminReservation from './useAdminReservation';
import useAdminSellers from './useAdminSellers';
import useAdminSpaces from './useAdminSpaces';

/**
 * 대시보드 상단 카드에 필요한 값들을 각 도메인 훅에서 통합해서 제공합니다.
 *
 * - 이번달 예약   : reservation.dashboardSummary.thisMonthReservationCount
 * - 전체 판매자   : sellers.sellersUnfilteredTotal
 * - 활성 숙소     : spaces.spaces (status === 'active' 필터)
 * - 총 매출액     : API 미지원 — undefined 반환 (호출 측에서 mock 대체)
 */
export default function useAdminDashboard() {
  const { dashboardSummary, fetchDashboardSummary } = useAdminReservation();
  const { sellersUnfilteredTotal, fetchSellersStats } = useAdminSellers();
  const { spaces } = useAdminSpaces(); // useAdminSpaces 내부 useEffect로 자동 fetch

  useEffect(() => {
    fetchDashboardSummary();
    fetchSellersStats();
  }, [fetchDashboardSummary, fetchSellersStats]);

  const thisMonthReservationCount =
    dashboardSummary?.thisMonthReservationCount ?? null;

  const totalSellers = sellersUnfilteredTotal ?? null;

  // 숙소 관리 페이지와 동일한 기준: del_yn === 'N' (삭제되지 않은 전체 숙소)
  const activeSpaces = spaces.filter((s) => s['del_yn'] === 'N').length || null;

  return {
    thisMonthReservationCount,
    totalSellers,
    activeSpaces,
  };
}
