// src/features/review/pages/ReviewListPage.jsx

import { Link } from 'react-router-dom';

export default function ReviewListPage() {
  const dummyList = [
    {
      reviewId: 1,
      title: '제주 워케이션 후기',
      writer: 'user01',
    },
    {
      reviewId: 2,
      title: '부산 여행 후기',
      writer: 'user02',
    },
  ];

  return (
    <div>
      <h2>후기 목록</h2>

      {dummyList.map((review) => (
        <div key={review.reviewId}>
          <Link to={`/board/review/detail/${review.reviewId}`}>
            {review.title}
          </Link>

          <div>작성자 : {review.writer}</div>

          <hr />
        </div>
      ))}
    </div>
  );
}
