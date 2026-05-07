import { Routes, Route } from "react-router-dom";

/**
 * Space 도메인 라우터
 * 팀원 A: 공간 리스트, 공간 상세 페이지 관련 라우팅을 관리합니다.
 * 
 * App.jsx에서 /spaces/* 로 연결되어 있으므로, 
 * 여기서의 경로는 /spaces 기준입니다.
 */
export default function SpaceRouter() {
  return (
    <Routes>
      {/* 예시: /spaces */}
      <Route path="/" element={<div>Space List Page (준비 중)</div>} />
      
      {/* 예시: /spaces/:id */}
      <Route path="/:id" element={<div>Space Detail Page (준비 중)</div>} />
      
      {/* ↓ 여기에 추가적인 공간 관련 라우트를 작성하세요 */}
    </Routes>
  );
}
