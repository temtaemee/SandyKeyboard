import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 1. 예약 관련 페이지들
import ReservationInsertPage from '../features/user/reservation/pages/ReservationInsertPage';
import ReservationUpdatePage from './../features/user/reservation/pages/ReservationUpdatePage';
import PaymentSuccessPage from '../features/user/reservation/pages/PaymentSuccessPage';

// 2. 💡 환불 전용 패키지로 통합 임포트
import RefundRequestPage from '../features/refund/pages/RefundRequestPage';

import RefundDetailPage from '../features/refund/pages/RefundDetailPage';
import RefundListPage from '../features/refund/pages/RefundListPage';

function ResvRouter() {
  return (
    <Routes>
      {/* =========================================================================
          예약(Reservation) 관련 라우팅
         ========================================================================= */}
      <Route path="insert/:stayId" element={<ReservationInsertPage />} />
      <Route path="update" element={<ReservationUpdatePage />} />
      <Route path="payment/success" element={<PaymentSuccessPage />} />

      {/* =========================================================================
          💡 환불(Refund) 관련 라우팅 (중복 제거 및 경로 단일화 완료)
         ========================================================================= */}
      {/* 환불 신청 폼 */}
      <Route
        path="refund/apply/:reservationId"
        element={<RefundRequestPage />}
      />

      {/* 내 환불 처리 목록 (유저 전용) */}
      <Route path="refund/list" element={<RefundListPage />} />

      {/* 유저 전용 환불 단건 상세 영수증 보기 */}
      <Route path="refund/detail/:id" element={<RefundDetailPage />} />
    </Routes>
  );
}

export default ResvRouter;
