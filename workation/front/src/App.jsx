import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Layout from './home/components/layout/Layout';
import HomePage from './home/pages/HomePage';

import UserRouter from './routes/MypageRouter';
import SellerRouter from './routes/SellerRouter';
import SellerHomePage from './features/seller/pages/SellerHomePage';
import AdminRouter from './routes/AdminRouter';
import MsRouter from './routes/ResvRouter';
import FindIdPage from './features/member/pages/findId/FindIdPage';
import FindPassWordPage from './features/member/pages/findPw/FindPassWordPage';
import SignupPage from './features/member/pages/singup/SignupPage';
import BoardRouter from './routes/BoardRouter';
import ResvRouter from './routes/ResvRouter';
import LoginPage from './features/member/pages/login/LoginPage';
import MypageRouter from './routes/MypageRouter';
import SellerSelectionView from './features/member/pages/login/SellerSelectionView';
import useAuth from './features/member/hooks/useAuth';

export default function App() {
  const { loading, isSeller } = useAuth();

  if (loading) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        {/* Layout이 Header + Outlet + Footer를 감쌈 (공통 레이아웃) */}
        <Route path="/" element={<Layout />}>
          {/* 로그인 시 SELLER라면 선택 화면으로, 아니라면 일반 홈으로 */}
          <Route
            index
            element={isSeller ? <SellerSelectionView /> : <HomePage />}
          />
          {/* 메인 페이지 */}
          <Route path="/home" element={<HomePage />} />

          {/* 
            [협업 가이드]
            1. 각 도메인(기능)별 라우팅은 src/routes 하위의 개별 Router 파일에서 관리합니다.
            2. 새로운 도메인이 추가되면 아래와 같이 path="경로/*" 형태로 연결해 주세요.
            3. 각 팀원은 본인이 맡은 Router 파일만 수정하여 충돌을 방지합니다.
          */}

          {/* 유저(User) 관련 라우트 - 팀원 <A:blank></A:blank> */}
          <Route path="mypage/*" element={<MypageRouter />} />
          <Route path="join" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="find-id" element={<FindIdPage />} />
          <Route path="find-password" element={<FindPassWordPage />} />

          {/* 예약(reservation) 관련 라우트 - 팀원 김민성 */}
          <Route path="resv/*" element={<ResvRouter />} />
          {/* 게시판(board) 관련 라우트 - 팀원 양희우 */}
          <Route path="board/*" element={<BoardRouter />} />
        </Route>

        {/* 판매자(Seller) 관련 라우트 - 팀원 김영욱 */}
        <Route path="seller/*" element={<SellerRouter />} />

        {/* 관리자(Admin)) 관련 라우트 - 팀원 라형준 */}
        <Route path="admin/*" element={<AdminRouter />} />
      </Routes>
    </ThemeProvider>
  );
}
