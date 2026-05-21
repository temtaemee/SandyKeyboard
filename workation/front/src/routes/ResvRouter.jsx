import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ReservationInsertPage from '../features/user/reservation/pages/ReservationInsertPage';
import RefundDetailPage from '../features/user/reservation/pages/RefundDetailPage';
import ReservationUpdatePage from './../features/user/reservation/pages/ReservationUpdatePage';
import PaymentSuccessPage from '../features/user/reservation/pages/PaymentSuccessPage';

function ResvRouter() {
  return (
    <>
      <Routes>
        {/* reservation */}
        <Route path="insert" element={<ReservationInsertPage />} />
        <Route path="update" element={<ReservationUpdatePage />} />
        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="refund/detail/:id" element={<RefundDetailPage />} />
      </Routes>
    </>
  );
}

export default ResvRouter;
