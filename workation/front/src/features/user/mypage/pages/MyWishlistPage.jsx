import styled from 'styled-components';
import { Heart, Layout, MapPin, Star, Trash2 } from 'lucide-react';
import useWishlist from '../hooks/useWishlist';
import MyPageSidebar from '../components/MyPageSidebar';
import { useNavigate } from 'react-router-dom';
import { resolveAssetUrl } from '../../../../app/config/env';

function MyWishlistPage() {
  const { wishlist, isLoading, asyncDeleteWishlist } = useWishlist();
  const navi = useNavigate();

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  return (
    <Container>
      <MyPageSidebar />

      <Main>
        <ContentWrapper>
          <HeaderSection>
            <Title>내가 찜한 워케이션</Title>
            <SubTitle>
              다시 가고 싶은, 혹은 꿈꾸던 업무 공간들을 확인하세요.
            </SubTitle>
          </HeaderSection>

          <CountBadge>{wishlist.length} TOTAL</CountBadge>

          <CardList>
            {wishlist.map((item) => (
              <Card
                key={item.wishlistId}
                onClick={() => {
                  navi(`/resv/space/${item.spaceId}`);
                }}
              >
                <ThumbnailWrapper>
                  <Thumbnail
                    src={
                      item.thumbnailUrl
                        ? resolveAssetUrl(item.thumbnailUrl)
                        : resolveAssetUrl('/dummy-images/gangwon/hotel1/강원1외관.png')
                    }
                    alt={item.spaceName}
                  />

                  <HeartBadge>
                    <Heart size={16} fill="#ef4444" color="#ef4444" />
                  </HeartBadge>
                </ThumbnailWrapper>

                <Content>
                  <SpaceName>{item.spaceName}</SpaceName>

                  <Address>
                    <MapPin size={14} />
                    <span>{item.address}</span>
                  </Address>

                  <Tag>Workation Space</Tag>
                </Content>

                <RightSection>
                  <Rating>
                    <Star size={14} fill="#facc15" color="#facc15" />
                    <span>4.9</span>
                  </Rating>

                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      asyncDeleteWishlist(item.wishlistId);
                    }}
                  >
                    <Trash2 size={14} />찜 삭제
                  </DeleteButton>
                </RightSection>
              </Card>
            ))}
          </CardList>

          {wishlist.length === 0 && (
            <EmptyBox>아직 찜한 공간이 없습니다.</EmptyBox>
          )}
        </ContentWrapper>
      </Main>
    </Container>
  );
}

export default MyWishlistPage;

/* ================= 교정된 스타일 컴포넌트 구역 ================= */

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
`;

const Main = styled.main`
  flex: 1;
  padding: 48px; /* 💡 마이페이지와 완벽 동기화 (상하좌우 48px 대칭 패딩) */

  /* ❌ 기존의 display: flex 및 justify-content: center 제거 완료! */
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1200px; /* 💡 대시보드 카드의 와이드한 비율과 조화를 이루도록 확장 */
`;

const HeaderSection = styled.div`
  margin-bottom: 32px;
  /* 💡 타이틀과 서브타이틀이 왼쪽 정렬된 메인 본문에 자연스럽게 녹아듭니다. */
`;

// ... 아래의 나머지 스타일 컴포넌트(Title, CardList 등)들은 기존 코드 그대로 유지하시면 됩니다!

const Title = styled.h1`
  font-size: 34px;
  font-weight: 700;
  color: #264653;
  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: 15px;
  color: #6b7280;
`;

const CountBadge = styled.div`
  width: fit-content;

  margin-left: auto;
  margin-bottom: 18px;

  padding: 6px 14px;

  border-radius: 999px;

  background-color: #dff6f4;
  color: #2b6b73;

  font-size: 12px;
  font-weight: 700;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 18px;

  padding: 16px;

  display: flex;
  align-items: center;
  gap: 20px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
`;

const ThumbnailWrapper = styled.div`
  position: relative;
`;

const Thumbnail = styled.img`
  width: 220px;
  height: 140px;
  object-fit: cover;

  border-radius: 14px;
`;

const HeartBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  width: 30px;
  height: 30px;

  border-radius: 50%;
  background-color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

const Content = styled.div`
  flex: 1;
`;

const SpaceName = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;

  margin-bottom: 12px;
`;

const Address = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  color: #6b7280;
  font-size: 14px;

  margin-bottom: 16px;
`;

const Tag = styled.div`
  width: fit-content;

  padding: 6px 12px;

  border-radius: 999px;

  background-color: #eef5f6;
  color: #3f6971;

  font-size: 12px;
  font-weight: 600;
`;

const RightSection = styled.div`
  height: 140px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 700;
  color: #374151;
`;

const DeleteButton = styled.button`
  border: none;

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 10px 18px;

  border-radius: 999px;

  background-color: #264653;
  color: white;

  font-size: 13px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyBox = styled.div`
  height: 180px;

  background-color: white;
  border-radius: 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #9ca3af;
  font-size: 15px;

  margin-top: 24px;
`;
