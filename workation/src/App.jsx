import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import GlobalStyle from "./styles/GlobalStyle";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        {/* Layout이 Header + Outlet + Footer를 감쌈 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* ↓ 여기에 팀원들 라우트 추가 */}
          {/* <Route path="/spaces"     element={<SpaceListPage />} /> */}
          {/* <Route path="/spaces/:id" element={<SpaceDetailPage />} /> */}
          {/* <Route path="/mypage"     element={<MyPage />} /> */}
          {/* <Route path="/login"      element={<LoginPage />} /> */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
