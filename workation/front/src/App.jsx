import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";

import SpaceRouter from "./routes/SpaceRouter";
import UserRouter from "./routes/UserRouter";
import SellerRouter from "./routes/SellerRouter";
import SellerHomePage from "./features/seller/pages/SellerHomePage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        {/* Layout이 Header + Outlet + Footer를 감쌈 (공통 레이아웃) */}
        <Route path="/" element={<Layout />}>
          {/* 메인 페이지 */}
          <Route index element={<HomePage />} />

          {/* 
            [협업 가이드]
            1. 각 도메인(기능)별 라우팅은 src/routes 하위의 개별 Router 파일에서 관리합니다.
            2. 새로운 도메인이 추가되면 아래와 같이 path="경로/*" 형태로 연결해 주세요.
            3. 각 팀원은 본인이 맡은 Router 파일만 수정하여 충돌을 방지합니다.
          */}

          {/* 공간(Space) 관련 라우트 - 팀원 A */}
          <Route path="spaces/*" element={<SpaceRouter />} />

          {/* 유저(User) 관련 라우트 - 팀원 B */}
          <Route path="user/*" element={<UserRouter />} />

          {/* 판매자(Seller) 관련 라우트 - 팀원 김영욱 */}
          <Route path="seller/*" element={<SellerRouter />}></Route>

          {/* 추가 도메인 예시: 
            <Route path="reservations/*" element={<ReservationRouter />} /> 
          */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
