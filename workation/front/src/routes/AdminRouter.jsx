// src/routes/AdminRouter.jsx
import { Routes, Route } from 'react-router-dom';
import AdminDashboardLayout from '../features/admin/layouts/AdminDashboardLayout';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';

/**
 * Admin 도메인 라우터
 * 팀원 라형준: 관리자 관련 라우팅을 관리합니다.
 *
 * App.jsx에서 /admin/* 로 연결되어 있으므로,
 * 여기서의 경로는 /admin 기준입니다.
 *
 * [레이아웃 구분]
 * AdminDashboardLayout → 사이드바 + 자체 헤더 (관리자 센터 내부)
 */
export default function AdminRouter() {
  return (
    <Routes>
      {/* 관리자 센터 레이아웃 (사이드바 + 자체 헤더) */}
      <Route element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />

        {/* ↓ 여기에 관리자 내부 페이지 추가 */}
        {/* <Route path="spaces"       element={<AdminSpacesPage />} /> */}
        {/* <Route path="reservations" element={<AdminReservationsPage />} /> */}
        {/* <Route path="sellers"      element={<AdminSellersPage />} /> */}
        {/* <Route path="board"        element={<AdminBoardPage />} /> */}
        {/* <Route path="sales"        element={<AdminSalesPage />} /> */}
        {/* <Route path="support"      element={<AdminSupportPage />} /> */}
      </Route>
    </Routes>
  );
}
