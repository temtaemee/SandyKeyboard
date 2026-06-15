import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useDestination from '../hooks/useDestination';
import useWishlist from '../../mypage/hooks/useWishlist';
import useAuth from './../../../member/hooks/useAuth';
import { resolveAssetUrl, SERVER_BASE_URL } from '../../../../app/config/env'; // 💡 SERVER_BASE_URL 임포트 추가

function SpaceDetailPage() {
  const { spaceId } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();

  const {
    currentSpace: space,
    loading,
    loadSpaceDetail,
    resetDetails,
  } = useDestination();

  const { wishlist, asyncInsertWishlist, asyncDeleteWishlist } = useWishlist();

  const isWished =
    Array.isArray(wishlist) &&
    wishlist.some((item) => item.spaceId === Number(spaceId));
  const wishItem = Array.isArray(wishlist)
    ? wishlist.find((item) => item.spaceId === Number(spaceId))
    : null;

  const handleWishToggle = async () => {
    if (!spaceId) return;
    if (isWished && wishItem) {
      await asyncDeleteWishlist(wishItem.wishlistId);
    } else {
      await asyncInsertWishlist(spaceId);
    }
  };

  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    loadSpaceDetail(spaceId).catch(() => {
      alert('존재하지 않거나 비공개된 공간입니다.');
      navigate('/resv/destination');
    });
    return () => resetDetails();
  }, [spaceId]);

  if (loading || !space)
    return <LoadingText>공간 정보를 불러오는 중입니다...</LoadingText>;

  // 💡 [수정] 변수 참조 오류(ReferenceError) 해결 및 정확한 로그 배치
  const getRealImageUrl = (rawPath) => {
    if (!rawPath) return null;

    const resultUrl = resolveAssetUrl(rawPath);

    return resultUrl;
  };

  const sliderImages = [];
  if (space.thumbnailUrl) {
    const parsedThumb = getRealImageUrl(space.thumbnailUrl);
    if (parsedThumb) sliderImages.push(parsedThumb);
  }
  if (space.pictures && Array.isArray(space.pictures)) {
    space.pictures.forEach((p) => {
      const parsedUrl = getRealImageUrl(p.filePath);
      if (parsedUrl && !sliderImages.includes(parsedUrl))
        sliderImages.push(parsedUrl);
    });
  }
  if (space.stays && space.stays.length > 0) {
    space.stays.forEach((st) => {
      if (st.pictures && st.pictures.length > 0) {
        st.pictures.forEach((pic) => {
          const parsedStayUrl = getRealImageUrl(pic.filePath);
          if (parsedStayUrl && !sliderImages.includes(parsedStayUrl))
            sliderImages.push(parsedStayUrl);
        });
      }
    });
  }

  // 💡 [수정] 메인 슬라이더 이미지가 비어있을 때의 기본 폴백 이미지 처리
  if (sliderImages.length === 0) {
    sliderImages.push(
      resolveAssetUrl('/dummy-images/jeju/hotel1/제주1외관.png')
    );
  }

  const safeArcades = space.arcades || [];

  return (
    <Wrapper>
      <Container>
        <MainVisual>
          <img
            src={sliderImages[currentImgIdx]}
            alt={`${space.name} 사진 ${currentImgIdx + 1}`}
          />

          {isLoggedIn && (
            <FloatingWishButton onClick={handleWishToggle}>
              {isWished ? '❤️' : '🤍'}
            </FloatingWishButton>
          )}
          <AreaBadge>
            {typeof space.area === 'object' && space.area !== null
              ? space.area.name
              : space.area || '지역 정보 없음'}
          </AreaBadge>
          {sliderImages.length > 1 && (
            <>
              <SlideButton
                className="prev"
                onClick={() =>
                  setCurrentImgIdx((p) =>
                    p === 0 ? sliderImages.length - 1 : p - 1
                  )
                }
              >
                &#10094;
              </SlideButton>
              <SlideButton
                className="next"
                onClick={() =>
                  setCurrentImgIdx((p) =>
                    p === sliderImages.length - 1 ? 0 : p + 1
                  )
                }
              >
                &#10095;
              </SlideButton>
              <SliderDots>
                {sliderImages.map((_, idx) => (
                  <Dot
                    key={idx}
                    $active={currentImgIdx === idx}
                    onClick={() => setCurrentImgIdx(idx)}
                  />
                ))}
              </SliderDots>
            </>
          )}
        </MainVisual>

        <ContentSection>
          <SpaceName>{space.name}</SpaceName>
          <SpaceSummary>
            {space.summary ||
              '바다 가까운 아늑하고 몰입도 높은 프리미엄 업무 환경'}
          </SpaceSummary>
          <Divider />
          <DescriptionBlock>
            <SectionTitle> 공간 소개</SectionTitle>
            <DescText>{space.description}</DescText>
          </DescriptionBlock>

          {safeArcades.length > 0 && (
            <ArcadeBlock>
              <SectionTitle> 제공하는 편의 시설 및 인프라</SectionTitle>
              <ArcadeGrid>
                {safeArcades.map((arcade, index) => (
                  <ArcadeBadgeCard key={arcade.id || index}>
                    <ArcadeIcon></ArcadeIcon>
                    <ArcadeName>{arcade.name}</ArcadeName>
                  </ArcadeBadgeCard>
                ))}
              </ArcadeGrid>
            </ArcadeBlock>
          )}

          <SectionTitle> 장소 정보</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <strong>주소:</strong> {space.address1} {space.address2}
            </InfoItem>
            <InfoItem>
              <strong>연락처:</strong> {space.phone}
            </InfoItem>
            <InfoItem>
              <strong>이메일:</strong> {space.email}
            </InfoItem>
          </InfoGrid>
        </ContentSection>

        <StaySection>
          <SectionTitle> 예약 가능한 숙소 선택</SectionTitle>
          {!space.stays || space.stays.length === 0 ? (
            <EmptyText>현재 예약 가능한 숙소 유형이 비어있습니다.</EmptyText>
          ) : (
            <StayGrid>
              {space.stays.map((stay) => {
                const rawStayPath =
                  stay.pictures && stay.pictures.length > 0
                    ? stay.pictures[0].filePath
                    : null;

                // 💡 [수정] 숙소 카드의 대체(Fallback) 이미지를 제주 이미지로 통일성 있게 변경
                const roomImage =
                  getRealImageUrl(rawStayPath) ||
                  resolveAssetUrl(
                    '/dummy-images/jeju/hotel1/제주1스테이(디럭스룸)1.png'
                  );

                return (
                  <StayCard
                    key={stay.id}
                    onClick={() => navigate(`/resv/stay/${stay.id}`)}
                  >
                    <StayImgBox>
                      <img src={roomImage} alt={stay.name} />
                    </StayImgBox>
                    <StayCardBody>
                      <StayName>{stay.name}</StayName>
                      <StayInfo>
                        기준 {stay.capacity}명 / 최대 {stay.maxCapa}명 운영
                      </StayInfo>
                      <StayPriceRow>
                        <PriceLabel>1박 기준 요금</PriceLabel>
                        <PriceValue>
                          ₩{stay.monPrice?.toLocaleString()}~
                        </PriceValue>
                      </StayPriceRow>
                    </StayCardBody>
                  </StayCard>
                );
              })}
            </StayGrid>
          )}
        </StaySection>
      </Container>
    </Wrapper>
  );
}

export default SpaceDetailPage;
/* ========================================================================= */
/* Styled Components 비주얼 고도화 정의부 */
/* ========================================================================= */
const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  padding: 60px 24px;
`;
const Container = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;
const MainVisual = styled.div`
  width: 100%;
  height: 500px;
  background: #f1f5f9;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const SlideButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  padding: 14px 18px;
  font-size: 22px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
  &.prev {
    left: 24px;
  }
  &.next {
    right: 24px;
  }
`;
const SliderDots = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 14px;
  border-radius: 30px;
`;
const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active ? '#ffffff' : 'rgba(255,255,255,0.4)'};
  cursor: pointer;
`;
const AreaBadge = styled.span`
  position: absolute;
  bottom: 24px;
  left: 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 14px;
  z-index: 2;
`;
const ContentSection = styled.div`
  padding: 50px;
`;
const SpaceName = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
`;
const SpaceSummary = styled.p`
  font-size: 16px;
  color: #64748b;
  margin-top: 10px;
  font-weight: 500;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 32px 0;
`;
const SectionTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const DescriptionBlock = styled.div`
  margin-bottom: 40px;
`;
const DescText = styled.p`
  font-size: 16px;
  color: #334155;
  line-height: 1.8;
  white-space: pre-wrap;
`;
const ArcadeBlock = styled.div`
  margin-bottom: 40px;
  padding: 10px 0;
`;
const ArcadeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const ArcadeBadgeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f7ff;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #e0f2fe;
`;
const ArcadeIcon = styled.span`
  font-size: 16px;
`;
const ArcadeName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0369a1;
`;
const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
`;
const InfoItem = styled.div`
  font-size: 15px;
  color: #475569;
  strong {
    color: #0f172a;
    margin-right: 10px;
    font-weight: 700;
  }
`;
const StaySection = styled.div`
  padding: 0 50px 60px 50px;
  background: #fff;
`;
const StayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const StayCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const StayImgBox = styled.div`
  width: 100%;
  height: 210px;
  background: #e2e8f0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StayCardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const StayName = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
`;
const StayInfo = styled.p`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;
const StayPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
`;
const PriceLabel = styled.span`
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
`;
const PriceValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.number};
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 120px;
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;
const EmptyText = styled.p`
  font-size: 15px;
  color: #94a3b8;
  text-align: center;
  padding: 40px 0;
`;
const WishButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-left: 15px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.2);
  }
`;
const FloatingWishButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;
