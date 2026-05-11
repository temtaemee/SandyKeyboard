// src/routes/AdminRouter.jsx
import { Routes, Route } from 'react-router-dom';
import AdminDashboardLayout from '../features/admin/layouts/AdminDashboardLayout';
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AdminReservationPage from '../features/admin/pages/AdminReservationPage';
import AdminBoardPage from '../features/admin/pages/AdminBoardPage';
import AdminSpacesPage from '../features/admin/pages/AdminSpacesPage';
import AdminSalesPage from '../features/admin/pages/AdminSalesPage';

export default function AdminRouter() {
  return (
    <Routes>
      <Route element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard"    element={<AdminDashboardPage />} />
        <Route path="spaces"       element={<AdminSpacesPage />} />
        <Route path="reservations" element={<AdminReservationPage />} />
        <Route path="board"        element={<AdminBoardPage />} />
        <Route path="sales"        element={<AdminSalesPage />} />

        {/* ↓ 추가 예정 */}
        {/* <Route path="sellers" element={<AdminSellersPage />} /> */}
      </Route>
    </Routes>
  );
}
