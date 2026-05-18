import { Routes, Route, Navigate } from 'react-router-dom';

// 고객지원
import SupportHomePage from '../features/user/board/support/SupportHomePage';
import NoticePage from '../features/user/board/support/NoticePage';
import NoticeDetailPage from '../features/user/board/support/NoticeDetailPage';
import NoticeWritePage from '../features/user/board/support/NoticeWritePage';
import FaqPage from '../features/user/board/support/FaqPage';

// 참여후기
import ReviewHomePage from '../features/user/board/reviewboard/ReviewHomePage';
import ReviewListPage from '../features/user/board/reviewboard/ReviewListPage';
import ReviewWritePage from '../features/user/board/reviewboard/ReviewWritePage';

// 이벤트
import EventPage from '../features/user/board/event/EventPage';
import ReviewDetailPage from '../features/user/board/reviewboard/ReviewDetailPage';

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
      <Route path="event" element={<EventPage />} />
    </Routes>
  );
}

export default BoardRouter;
