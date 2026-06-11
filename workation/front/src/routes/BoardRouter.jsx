import { Routes, Route, Navigate } from 'react-router-dom';

// 고객지원
import SupportHomePage from '../features/user/board/support/pages/SupportHomePage';
import NoticePage from '../features/user/board/support/pages/NoticePage';
import NoticeDetailPage from '../features/user/board/support/pages/NoticeDetailPage';
import NoticeWritePage from '../features/user/board/support/pages/NoticeWritePage';
import FaqPage from '../features/user/board/support/pages/FaqPage';

// 참여후기
import ReviewHomePage from '../features/user/board/review/pages/ReviewHomePage';
import ReviewListPage from '../features/user/board/review/pages/ReviewListPage';
import ReviewWritePage from '../features/user/board/review/pages/ReviewWritePage';

// 이벤트
import UserEventPage from '../features/admin/pages/UserEventPage';
import ReviewDetailPage from '../features/user/board/review/pages/ReviewDetailPage';

function BoardRouter() {
  return (
    <Routes>
      {/* 고객지원 */}
      <Route path="support" element={<SupportHomePage />}>
        <Route index element={<Navigate to="notice" replace />} />
        <Route path="notice" element={<NoticePage />} />
        <Route path="notice/write" element={<NoticeWritePage />} />
        <Route path="notice/:noticeId" element={<NoticeDetailPage />} />
        <Route path="faq" element={<FaqPage />} />
      </Route>

      {/* 참여후기 */}
      <Route path="review" element={<ReviewHomePage />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<ReviewListPage />} />
        <Route path="write" element={<ReviewWritePage />} />
        <Route path="detail/:reviewId" element={<ReviewDetailPage />} />{' '}
        {/* 이거 추가! */}
      </Route>

      {/* 이벤트 */}
      <Route path="event" element={<UserEventPage />} />
    </Routes>
  );
}

export default BoardRouter;
