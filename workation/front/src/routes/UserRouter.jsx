import { Routes, Route } from "react-router-dom";
import LoginPage from "./../features/member/pages/login/LoginPage";
import SignupPage from "./../features/member/pages/singup/SignupPage";

/**
 * User 도메인 라우터
 * 팀원 B: 로그인, 회원가입, 마이페이지 관련 라우팅을 관리합니다.
 *
 * App.jsx에서 /users/* 로 연결되어 있으므로,
 * 여기서의 경로는 /users 기준입니다.
 */
export default function UserRouter() {
  return (
    <Routes>
      {/* 예시: /users/login */}
      <Route path="login" element={<LoginPage />} />
      <Route path="join" element={<SignupPage />} />

      {/* 예시: /users/mypage */}
      <Route path="mypage" element={<div>My Page (준비 중)</div>} />

      {/* ↓ 여기에 추가적인 유저 관련 라우트를 작성하세요 */}
    </Routes>
  );
}
