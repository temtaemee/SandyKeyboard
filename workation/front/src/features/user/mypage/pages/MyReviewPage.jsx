import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pencil, Trash2, Search, Star } from 'lucide-react';
import { deleteReview, getMyReviewList } from '../../board/review/api/reviewApi';
import MyPageSidebar from '../components/MyPageSidebar';
import { useNavigate } from 'react-router-dom';

function MyReviewPage() {
  // 1. 상태(State) 관리
  const [reviewList, setReviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navi = useNavigate();

  // 2. API 호출 및 데이터 로드
  useEffect(() => {
    getMyReviewList(0) // 내 리뷰 목록 API 호출
      .then((data) => {
        // Spring Boot Pageable 응답 구조일 경우 보통 data.content에 리스트가 들어있습니다.
        // 만약 컨트롤러에서 List<ReviewListRespDto> 자체를 반환한다면 그냥 'data'를 넣으시면 됩니다.
        const actualList = data.content || data;
        setReviewList(actualList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('리뷰 목록을 가져오는데 실패했습니다:', err);
        setLoading(false);
      });
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) return;

    try {
      // 1. 백엔드 DB에서 삭제
      await deleteReview(reviewId);

      // 2. 프론트엔드 State에서 삭제된 리뷰만 제외하고 필터링 (화면 실시간 갱신)
      setReviewList((prevList) =>
        prevList.filter((review) => review.id !== reviewId)
      );

      alert('리뷰가 정상적으로 삭제되었습니다.');
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  // 3. 유틸리티 함수: 날짜 포맷팅 (LocalDateTime -> YYYY.MM.DD)
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 4. 유틸리티 함수: 태그 문자열 파싱 (백엔드의 단일 tag 칼럼을 배열로)
  const parseTags = (tagString) => {
    if (!tagString) return [];
    return tagString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  };

  return (
    <Wrapper>
      <MyPageSidebar />

      <Main>
        <PageTitle>나의 리뷰</PageTitle>
        <PageDesc>작성했던 소중한 워케이션 리뷰들입니다.</PageDesc>

        <TopArea>
          <WriteButton
            onClick={() => {
              navi(`/board/review/write`);
            }}
          >
            리뷰 작성하기
          </WriteButton>
        </TopArea>

        {loading ? (
          <EmptyState>리뷰를 불러오는 중입니다...</EmptyState>
        ) : reviewList.length === 0 ? (
          <EmptyState>작성한 리뷰가 없습니다.</EmptyState>
        ) : (
          <ReviewList>
            {reviewList.map((review) => {
              // S3 Key나 이미지 리스트를 기반으로 썸네일 URL 조합 (없으면 기본 이미지)
              const hasImage = review.images && review.images.length > 0;
              const thumbnailUrl = hasImage
                ? `https://your-s3-bucket-url.s3.amazonaws.com/${review.images[0].s3Key}` // 본인 S3 주소에 맞게 수정
                : 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200'; // 이미지 없을 때 디폴트

              return (
                <ReviewCard key={review.id}>
                  <Thumbnail src={thumbnailUrl} alt={review.title} />

                  <Content>
                    <TopRow>
                      <div>
                        {/* 백엔드 DTO 기준 매핑: review.title */}
                        <Title>{review.title || '제목 없음'}</Title>

                        <RatingRow>
                          {/* 백엔드 DTO 기준 매핑: review.rating */}
                          {Array.from({
                            length: review.rating || 0,
                          }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={14}
                              fill="#facc15"
                              color="#facc15"
                            />
                          ))}

                          {/* 백엔드 DTO 기준 매핑: review.createdAt 포맷팅 */}
                          <DateText>{formatDate(review.createdAt)}</DateText>
                          {/* 작성자 정보가 필요하다면 활용 가능 */}
                          {review.writer && (
                            <WriterText>| {review.writer}</WriterText>
                          )}
                        </RatingRow>
                      </div>

                      <ActionArea>
                        <IconButton
                          onClick={() => {
                            navi(`/review/edit/${review.id}`);
                          }}
                        >
                          <Pencil size={15} />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </ActionArea>
                    </TopRow>

                    {/* 백엔드 DTO 기준 매핑: review.content */}
                    <ReviewText>{review.content}</ReviewText>

                    {/* 백엔드 DTO 기준 매핑: review.tag 분리 */}
                    <TagArea>
                      {parseTags(review.tag).map((tag) => (
                        <Tag key={tag}>#{tag}</Tag>
                      ))}
                    </TagArea>
                  </Content>
                </ReviewCard>
              );
            })}
          </ReviewList>
        )}
      </Main>
    </Wrapper>
  );
}

export default MyReviewPage;

/* ================= styled ================= */
// 기존 스타일 코드는 그대로 유지하며, 로딩/비어있음 표시용 스타일만 추가합니다.

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

const WriterText = styled.span`
  margin-left: 6px;
  color: #64748b;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #94a3b8;
  font-size: 16px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid #edf1f4;
`;
