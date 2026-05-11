import { Routes, Route } from 'react-router-dom';
import SellerHomePage from '../features/seller/pages/SellerHomePage';
import SellerDefaultLayout from '../features/seller/layouts/SellerDefaultLayout';
import SellerDashboardPage from '../features/seller/pages/SellerDashboardPage';

/**
 * Seller 도메인 라우터
 * 팀원 영욱: 관리자 사이드 관련 라우팅을 관리합니다.
 *
 * App.jsx에서 /seller/* 로 연결되어 있으므로,
 * 여기서의 경로는 /seller 기준입니다.
 */
export default function SellerRouter() {
  return (
    <Routes>
      {/* 예시: login */}
      <Route index element={<SellerDashboardPage />} />

      {/* ↓ 여기에 추가적인 유저 관련 라우트를 작성하세요 */}
    </Routes>
  );
}
