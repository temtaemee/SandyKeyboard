import React from 'react';
import { Route, Routes } from 'react-router-dom';

// 1. 예약 관련 페이지들
import ReservationInsertPage from '../features/user/reservation/pages/ReservationInsertPage';
import ReservationUpdatePage from './../features/user/reservation/pages/ReservationUpdatePage';
import PaymentSuccessPage from '../features/user/reservation/pages/PaymentSuccessPage';
import PaymentFailPage from '../features/user/reservation/pages/PaymentFailPage';

// 2. 💡 환불 전용 패키지로 통합 임포트
import RefundRequestPage from '../features/refund/pages/RefundRequestPage';

import RefundDetailPage from '../features/refund/pages/RefundDetailPage';
import RefundListPage from '../features/refund/pages/RefundListPage';
import DestinationPage from './../features/user/destination/pages/DestinationPage';
import StayDetailPage from '../features/user/destination/pages/StayDetailPage';
import SpaceDetailPage from '../features/user/destination/pages/SpaceDetailPage';

function ResvRouter() {
  return (
    <Routes>
      <Route path="destination" element={<DestinationPage />} />
      {/* =========================================================================
          예약(Reservation) 관련 라우팅
         ========================================================================= */}
      <Route path="insert/:stayId" element={<ReservationInsertPage />} />
      <Route path="update" element={<ReservationUpdatePage />} />
      <Route path="payment/success" element={<PaymentSuccessPage />} />
      <Route path="payment/fail" element={<PaymentFailPage />} />

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

      {/* 💡 [추가] 공간 상세 페이지 경로 설정 */}
      <Route path="space/:spaceId" element={<SpaceDetailPage />} />

      {/* 💡 [추가] 숙소 상세 페이지 경로 설정 */}
      <Route path="stay/:stayId" element={<StayDetailPage />} />
    </Routes>
  );
}

export default ResvRouter;
