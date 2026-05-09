import { Routes, Route, Navigate } from 'react-router-dom';
import SupportHomePage from '../features/user/board/support/SupportHomePage';
import NoticePage from '../features/user/board/support/NoticePage';
import NoticeDetailPage from '../features/user/board/support/NoticeDetailPage';
import FaqPage from '../features/user/board/support/FaqPage';
import ReviewHomePage from '../features/user/board/reviewboard/ReviewHomePage';
import ReviewListPage from '../features/user/board/reviewboard/ReviewListPage';
import ReviewDetailPage from '../features/user/board/reviewboard/ReviewDetailPage';
import ReviewWritePage from '../features/user/board/reviewboard/ReviewWritePage';
import EventPage from '../features/user/board/event/EventPage';

function BoardRouter() {
  return (
    <Routes>
      {/* 고객지원 */}
      <Route path="support" element={<SupportHomePage />}>
        <Route index element={<Navigate to="notice" replace />} />
        <Route path="notice" element={<NoticePage />} />
        <Route path="notice/:noticeId" element={<NoticeDetailPage />} />{' '}
        {/* ← 추가 */}
        <Route path="faq" element={<FaqPage />} />
      </Route>

      {/* 리뷰 */}
      <Route path="review" element={<ReviewHomePage />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<ReviewListPage />} />
        <Route path="detail/:reviewId" element={<ReviewDetailPage />} />
        <Route path="write" element={<ReviewWritePage />} />
      </Route>

      {/* 이벤트 */}
      <Route path="event" element={<EventPage />} />
    </Routes>
  );
}

export default BoardRouter;
