import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const dummyData = {
  1: {
    title: '제주 워케이션 후기',
    writer: 'user01',
    date: '2026.05.07',
    content:
      '정말 좋은 공간이었습니다. 뷰도 좋고 인터넷 속도도 빨라서 작업하기 최고였어요!',
  },
  2: {
    title: '부산 여행 후기',
    writer: 'user02',
    date: '2026.05.06',
    content: '바다 뷰가 너무 아름다웠습니다. 다음에 또 오고 싶어요.',
  },
  3: {
    title: '서울 스튜디오 이용 후기',
    writer: 'user03',
    date: '2026.05.05',
    content: '접근성이 뛰어나고 시설이 깔끔했습니다. 강력 추천합니다!',
  },
};

export default function ReviewDetailPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const review = dummyData[reviewId];

  if (!review) {
    return (
      <Wrapper>
        <p>존재하지 않는 후기입니다.</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <DetailTitle>{review.title}</DetailTitle>

      <Meta>
        <span>{review.writer}</span>
        <span>{review.date}</span>
      </Meta>

      <Divider />

      <Body>{review.content}</Body>

      <BackButton onClick={() => navigate('/board/review/list')}>
        ← 목록으로
      </BackButton>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Meta = styled.div`
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 48px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;
