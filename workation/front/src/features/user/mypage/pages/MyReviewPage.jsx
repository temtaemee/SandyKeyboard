import styled from 'styled-components';
import { Pencil, Trash2, Search, Star } from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';

function MyReviewPage() {
  const reviewList = [
    {
      id: 1,
      title: '제주 바다워크 워크스페이스',
      date: '2024.05.12',
      rating: 5,
      content:
        '조용한 분위기와 오션뷰가 정말 만족스러웠어요. 업무 집중이 잘 됐습니다.',
      tags: ['오션뷰', '조용함'],
      image:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200',
    },
    {
      id: 2,
      title: '강릉 커넥트 워크룸',
      date: '2024.04.28',
      rating: 4,
      content: '카페 분위기 느낌이라 편하게 쉬면서 작업하기 좋았어요.',
      tags: ['와이파이', '카페감성'],
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200',
    },
    {
      id: 3,
      title: '부산 스테이 빌리지',
      date: '2024.03.15',
      rating: 5,
      content: '룸 컨디션이 정말 좋았고 야경이 예술이었습니다.',
      tags: ['야경맛집', '프라이빗'],
      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200',
    },
    {
      id: 4,
      title: '평창 숲속 워크숍',
      date: '2024.02.20',
      rating: 4,
      content: '자연 속에서 힐링하면서 일할 수 있어 만족스러웠어요.',
      tags: ['자연뷰', '힐링'],
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    },
  ];

  return (
    <Wrapper>
      <MyPageSidebar />

      <Main>
        <PageTitle>나의 리뷰</PageTitle>

        <PageDesc>작성했던 소중한 워케이션 리뷰들입니다.</PageDesc>

        <TopArea>
          <WriteButton>리뷰 작성하기</WriteButton>
        </TopArea>

        <ReviewList>
          {reviewList.map((review) => (
            <ReviewCard key={review.id}>
              <Thumbnail src={review.image} alt="" />

              <Content>
                <TopRow>
                  <div>
                    <Title>{review.title}</Title>

                    <RatingRow>
                      {Array.from({
                        length: review.rating,
                      }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          fill="#facc15"
                          color="#facc15"
                        />
                      ))}

                      <DateText>{review.date}</DateText>
                    </RatingRow>
                  </div>

                  <ActionArea>
                    <IconButton>
                      <Pencil size={15} />
                    </IconButton>

                    <IconButton>
                      <Trash2 size={15} />
                    </IconButton>
                  </ActionArea>
                </TopRow>

                <ReviewText>{review.content}</ReviewText>

                <TagArea>
                  {review.tags.map((tag) => (
                    <Tag key={tag}>#{tag}</Tag>
                  ))}
                </TagArea>
              </Content>
            </ReviewCard>
          ))}
        </ReviewList>

        <SearchArea>
          <SearchBox>
            <Search size={18} />

            <SearchInput placeholder="리뷰 내용 검색하기" />
          </SearchBox>
        </SearchArea>
      </Main>
    </Wrapper>
  );
}

export default MyReviewPage;

/* ================= styled ================= */

const Wrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
`;

const Main = styled.main`
  flex: 1;
  padding: 42px;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const PageTitle = styled.h1`
  font-size: 32px;
  color: #374151;
  margin-bottom: 10px;
`;

const PageDesc = styled.p`
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 30px;
`;

const TopArea = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
`;

const WriteButton = styled.button`
  border: none;
  background-color: #3f6971;
  color: white;

  height: 46px;
  padding: 0 28px;

  border-radius: 999px;
  cursor: pointer;

  font-size: 14px;
  font-weight: 600;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ReviewCard = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 18px;

  display: flex;
  gap: 18px;

  border: 1px solid #edf1f4;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Thumbnail = styled.img`
  width: 190px;
  height: 130px;
  border-radius: 14px;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #374151;
  margin-bottom: 8px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 14px;
`;

const DateText = styled.span`
  margin-left: 10px;
  color: #94a3b8;
  font-size: 12px;
`;

const ActionArea = styled.div`
  display: flex;
  gap: 10px;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  color: #94a3b8;

  cursor: pointer;

  &:hover {
    color: #3f6971;
  }
`;

const ReviewText = styled.p`
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 16px;
  font-size: 14px;
`;

const TagArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.div`
  background-color: #eef5f6;
  color: #3f6971;

  padding: 6px 10px;
  border-radius: 999px;

  font-size: 12px;
`;

const SearchArea = styled.div`
  margin-top: 34px;
  display: flex;
  justify-content: center;
`;

const SearchBox = styled.div`
  width: 100%;
  max-width: 420px;
  height: 50px;

  background-color: white;
  border: 2px solid #d7e3e7;
  border-radius: 999px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 0 18px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;

  font-size: 14px;
  background: transparent;

  &::placeholder {
    color: #9ca3af;
  }
`;
