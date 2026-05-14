import { Routes, Route } from 'react-router-dom';
import LoginPage from '../features/member/pages/login/LoginPage';
import SignupPage from '../features/member/pages/singup/SignupPage';
import SellerApplyPage from '../features/member/pages/sellerApply/SellerApplyPage';
import MyPage from '../features/user/mypage/pages/MyPage';
import MyCouponPage from '../features/user/mypage/pages/MyCouponPage';
import MyReservationPage from '../features/user/mypage/pages/MyReservationPage';
import MyReviewPage from '../features/user/mypage/pages/MyReviewPage';
import MySettingPage from '../features/user/mypage/pages/MySettingPage';

/**
 * User 도메인 라우터
 * 팀원 B: 로그인, 회원가입, 마이페이지 관련 라우팅을 관리합니다.
 *
 * App.jsx에서 /users/* 로 연결되어 있으므로,
 * 여기서의 경로는 /users 기준입니다.
 */
export default function MypageRouter() {
  return (
    <Routes>
      {/* 예시: /mypage */}
      <Route index element={<MyPage />} />
      <Route path="seller-apply" element={<SellerApplyPage />} />
      {/* <Route path="mypage/reservation" element={<MyReservationListPage />} /> */}
      <Route path="reservation" element={<MyReservationPage />} />
      {/* ↓ 여기에 추가적인 유저 관련 라우트를 작성하세요 */}
      <Route path="coupon" element={<MyCouponPage />} />
      <Route path="review" element={<MyReviewPage />} />
      <Route path="setting" element={<MySettingPage />} />
    </Routes>
  );
}
