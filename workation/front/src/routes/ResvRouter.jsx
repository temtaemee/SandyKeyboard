import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ReservationInsertPage from '../features/user/reservation/pages/ReservationInsertPage';
import ReservationPaymentInsertPage from '../features/user/reservation/pages/ReservationPaymentInsertPage';
import RefundDetailPage from '../features/user/reservation/pages/RefundDetailPage';
import ReservationUpdatePage from '../features/user/reservation/pages/ReservationUpdatePage';

function ResvRouter() {
  return (
    <>
      <Routes>
        <Route path="insert" element={<ReservationInsertPage />} />

        <Route path="update/:id" element={<ReservationUpdatePage />} />

        <Route
          path="payment/insert"
          element={<ReservationPaymentInsertPage />}
        />

        <Route path="refund/detail/:id" element={<RefundDetailPage />} />
      </Routes>
    </>
  );
}

export default ResvRouter;
