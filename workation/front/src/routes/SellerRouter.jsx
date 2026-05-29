import { Routes, Route } from 'react-router-dom';
import SellerDefaltLayout from '../features/seller/layouts/SellerDefaltLayout';
import SellerDashboardPage from '../features/seller/pages/SellerDashboardPage';
import SpaceListPage from '../features/seller/pages/space/SpaceListPage';
import SpaceDetailPage from '../features/seller/pages/space/SpaceDetailPage';
import SpaceRegisterPage from '../features/seller/pages/space/SpaceRegisterPage';
import SpaceEditPage from '../features/seller/pages/space/SpaceEditPage';
import StayListPage from '../features/seller/pages/stay/StayListPage';
import StayDetailPage from '../features/seller/pages/stay/StayDetailPage';
import StayRegisterPage from '../features/seller/pages/stay/StayRegisterPage';
import StayEditPage from '../features/seller/pages/stay/StayEditPage';
import SalesPage from '../features/seller/pages/SalesPage';
import ReservationPage from '../features/seller/pages/ReservationPage';
import SettlementPage from '../features/seller/pages/SettlementPage';
import ReviewPage from '../features/seller/pages/ReviewPage';
import CouponPage from '../features/seller/pages/CouponPage';
import AccountPage from '../features/seller/pages/AccountPage';

export default function SellerRouter() {
  return (
    <Routes>
      <Route element={<SellerDefaltLayout />}>
        <Route index element={<SellerDashboardPage />} />
        <Route path="spaces" element={<SpaceListPage />} />
        <Route path="spaces/register" element={<SpaceRegisterPage />} />
        <Route path="spaces/:id" element={<SpaceDetailPage />} />
        <Route path="spaces/:id/edit" element={<SpaceEditPage />} />
        <Route path="stays" element={<StayListPage />} />
        <Route path="stays/register" element={<StayRegisterPage />} />
        <Route path="stays/:id" element={<StayDetailPage />} />
        <Route path="stays/:id/edit" element={<StayEditPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="reservations" element={<ReservationPage />} />
        <Route path="settlements" element={<SettlementPage />} />
        <Route path="reviews" element={<ReviewPage />} />
        <Route path="coupons" element={<CouponPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}
