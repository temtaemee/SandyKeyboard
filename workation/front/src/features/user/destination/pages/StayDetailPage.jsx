// src/features/user/reservation/pages/StayDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../../app/api/axios'; // 공통 axios 인스턴스 사용

// 💡 백엔드 StayOption Enum에 대칭되는 한국어 친화적 라벨 맵
const OPTION_LABELS = {
  DESK: '💻 집중 워크 데스크',
  PRIVATE_BATHROOM: '🚿 개인 욕실',
  BATHTUB: '🛁 욕조',
  SHOWER_BOOTH: '🚿 샤워 부스',
  BIDET: '🚽 비데',
  AMENITY: '🧴 고급 어메니티',
  KITCHEN: '🍳 주방 시설',
  COOKING_AVAILABLE: '🔥 취사 가능',
  MICROWAVE: '⚡ 전자레인지',
  INDUCTION: '🍳 인덕션',
  REFRIGERATOR: '🧊 냉장고',
  TABLEWARE: '🍽️ 식기류 일체',
  COFFEE_MACHINE: '☕ 에스프레소 머신',
  OCEAN_VIEW: '🌊 파노라마 오션뷰',
  CITY_VIEW: '🏙️ 시티뷰',
  MOUNTAIN_VIEW: '⛰️ 마운틴뷰',
  GARDEN_VIEW: '🏡 가든뷰',
  RIVER_VIEW: '🌊 리버뷰',
};

function StayDetailPage() {
  const { stayId } = useParams();
  const navigate = useNavigate();
  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const SERVER_HOST = 'http://localhost:80';
  const FALLBACK_STAY =
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    async function fetchStayDetail() {
      try {
        const response = await api.get(`/public/stay/${stayId}`);
        setStay(response.data);
      } catch (err) {
        console.error('숙소 상세 조회 오류:', err);
        alert('숙소 정보를 가져오지 못했습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    }
    fetchStayDetail();
  }, [stayId, navigate]);

  const handleBookClick = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert(
        '🔒 예약 기능은 회원 전용 서비스입니다. 로그인 페이지로 이동합니다.'
      );
      localStorage.setItem('redirectUrl', window.location.pathname);
      navigate('/login');
      return;
    }
    navigate(`/resv/insert/${stay.id}`);
  };

  if (loading)
    return <LoadingText>숙소 정보를 불러오는 중입니다...</LoadingText>;
  if (!stay) return null;

  const getRealImageUrl = (rawPath, fallback) => {
    if (!rawPath) return fallback;
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://'))
      return rawPath;
    return `${SERVER_HOST}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`;
  };

  const imageList =
    stay.pictures && stay.pictures.length > 0
      ? stay.pictures.map((p) => getRealImageUrl(p.filePath, FALLBACK_STAY))
      : [FALLBACK_STAY];

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return timeStr.slice(0, 5); // "15:00:00" -> "15:00" 가공
  };

  return (
    <Wrapper>
      <Container>
        {/* 1. 상단 갤러리 영역 */}
        <MainImageArea>
          <img src={imageList[activeImgIdx]} alt={stay.name} />
        </MainImageArea>

        {/* 하단 미니 썸네일 리스트 */}
        {imageList.length > 1 && (
          <GalleryThumbnails>
            {imageList.map((imgUrl, index) => (
              <ThumbItem
                key={index}
                active={activeImgIdx === index}
                onClick={() => setActiveImgIdx(index)}
              >
                <img src={imgUrl} alt={`방 사진 ${index + 1}`} />
              </ThumbItem>
            ))}
          </GalleryThumbnails>
        )}

        <InfoSection>
          {/* 2. 타이틀 & 소속 공간 정보 */}
          <MetaHeader>
            <SpaceNameTag>🏡 {stay.spaceName || '연동 공간'}</SpaceNameTag>
            <HeaderRow>
              <StayTitle>{stay.name}</StayTitle>
              <PriceTag>
                ₩{stay.monPrice?.toLocaleString()} <small>/ 1박 최저가</small>
              </PriceTag>
            </HeaderRow>
            {stay.summary && <StaySummary>✨ {stay.summary}</StaySummary>}
          </MetaHeader>

          <Divider />

          {/* 3. 기본 인원 및 이용 시간 상세 명세 카드 */}
          <SectionTitle>📋 기본 이용 안내</SectionTitle>
          <InfoCardGrid>
            <CardItem>
              <CardLabel>이용 인원</CardLabel>
              <CardValue>
                기준 {stay.capacity}명 / 최대 {stay.maxCapa}명
              </CardValue>
            </CardItem>
            <CardItem>
              <CardLabel>체크인 시간</CardLabel>
              <CardValue>{formatTime(stay.checkInTime)} 이후</CardValue>
            </CardItem>
            <CardItem>
              <CardLabel>체크아웃 시간</CardLabel>
              <CardValue>{formatTime(stay.checkOutTime)} 이전</CardValue>
            </CardItem>
          </InfoCardGrid>

          {/* 4. 요일별 전체 금액 투명 명세표 */}
          <SectionTitle>💰 요일별 정가 운용 안내</SectionTitle>
          <PriceTable>
            <PriceRow>
              <PriceTh>월요일</PriceTh>
              <PriceTh>화요일</PriceTh>
              <PriceTh>수요일</PriceTh>
              <PriceTh>목요일</PriceTh>
              <PriceTh className="fri">금요일</PriceTh>
              <PriceTh className="sat">토요일</PriceTh>
              <PriceTh className="sun">일요일</PriceTh>
            </PriceRow>
            <PriceRow>
              <PriceTd>₩{stay.monPrice?.toLocaleString()}</PriceTd>
              <PriceTd>₩{stay.tuePrice?.toLocaleString()}</PriceTd>
              <PriceTd>₩{stay.wedPrice?.toLocaleString()}</PriceTd>
              <PriceTd>₩{stay.thuPrice?.toLocaleString()}</PriceTd>
              <PriceTd className="fri">
                ₩{stay.friPrice?.toLocaleString()}
              </PriceTd>
              <PriceTd className="sat">
                ₩{stay.satPrice?.toLocaleString()}
              </PriceTd>
              <PriceTd className="sun">
                ₩{stay.sunPrice?.toLocaleString()}
              </PriceTd>
            </PriceRow>
            {stay.holidayPrice > 0 && (
              <HolidayRow>
                <span>🚨 공휴일/연휴 특별 지정 단가 :</span>
                <strong>₩{stay.holidayPrice?.toLocaleString()} / 1박</strong>
              </HolidayRow>
            )}
          </PriceTable>

          {/* 5. 셀러 지정 편의 인프라 옵션 뱃지 리스트 */}
          {stay.options && stay.options.length > 0 && (
            <>
              <SectionTitle>🛠️ 객실 내 포함 인프라 및 가구 옵션</SectionTitle>
              <OptionContainer>
                {stay.options.map((opt, idx) => (
                  <OptionBadge key={idx}>
                    {OPTION_LABELS[opt] || opt}
                  </OptionBadge>
                ))}
              </OptionContainer>
            </>
          )}

          {/* 6. 상세 설명 블록 */}
          {stay.description && (
            <>
              <SectionTitle>📝 객실 상세 소개</SectionTitle>
              <DescriptionBox>{stay.description}</DescriptionBox>
            </>
          )}

          {/* 하단 제어 액션 단 */}
          <ButtonRow>
            <BackButton onClick={() => navigate(-1)}>
              &larr; 이전 공간으로
            </BackButton>
            <BookButton onClick={handleBookClick}>
              ⚡ 즉시 예약 및 결제하기
            </BookButton>
          </ButtonRow>
        </InfoSection>
      </Container>
    </Wrapper>
  );
}

export default StayDetailPage;

/* ========================================================================= */
/* Styled Components 디자인 시스템 레이아웃 정의 */
/* ========================================================================= */
const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  padding: 60px 24px;
  display: flex;
  align-items: center;
`;
const Container = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;
const MainImageArea = styled.div`
  width: 100%;
  height: 420px;
  background: #edf2f7;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const WorkationBadge = styled.span`
  position: absolute;
  top: 20px;
  left: 24px;
  background: #ea580c;
  color: #fff;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 13px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const GalleryThumbnails = styled.div`
  display: flex;
  gap: 8px;
  padding: 14px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #edf2f7;
  overflow-x: auto;
`;
const ThumbItem = styled.div`
  width: 80px;
  height: 55px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid
    ${(props) => (props.active ? props.theme.colors.primary : 'transparent')};
  opacity: ${(props) => (props.active ? '1' : '0.5')};
  transition: all 0.2s;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    opacity: 1;
  }
`;

const InfoSection = styled.div`
  padding: 44px 50px;
`;
const MetaHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const SpaceNameTag = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #0284c7;
  background: #f0f9ff;
  padding: 4px 12px;
  border-radius: 4px;
  width: fit-content;
`;
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-top: 8px;
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 10px;
  }
`;
const StayTitle = styled.h2`
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
`;
const StaySummary = styled.p`
  font-size: 15px;
  color: #475569;
  font-weight: 500;
  margin-top: 4px;
`;
const PriceTag = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.number};
  small {
    font-size: 14px;
    color: #94a3b8;
    font-weight: 400;
  }
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 28px 0;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  margin-top: 32px;
`;
const InfoCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const CardItem = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const CardLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
`;
const CardValue = styled.span`
  font-size: 15px;
  color: #334155;
  font-weight: 700;
`;

/* 금액 전용 명세 테이블 디자인 */
const PriceTable = styled.div`
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const PriceRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  background: #fff;
  &:first-child {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
`;
const PriceTh = styled.div`
  padding: 10px 0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  &.fri {
    color: #0284c7;
  }
  &.sat,
  &.sun {
    color: #ef4444;
  }
`;
const PriceTd = styled.div`
  padding: 14px 0;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  border-right: 1px solid #f1f5f9;
  font-family: ${({ theme }) => theme.fonts.number};
  &:last-child {
    border-right: none;
  }
  &.fri {
    background: #f0f9ff;
    color: #0369a1;
  }
  &.sat {
    background: #fef2f2;
    color: #b91c1c;
  }
  &.sun {
    background: #fff5f5;
    color: #b91c1c;
  }
`;
const HolidayRow = styled.div`
  background: #fffbeb;
  border-top: 1px solid #fef3c7;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  span {
    color: #b45309;
    font-weight: 600;
  }
  strong {
    color: #b45309;
    font-weight: 800;
    font-family: ${({ theme }) => theme.fonts.number};
  }
`;

const OptionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const OptionBadge = styled.span`
  background: #f1f5f9;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;
const DescriptionBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  font-size: 15px;
  color: #334155;
  line-height: 1.8;
  white-space: pre-wrap;
  border: 1px solid #f1f5f9;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 48px;
`;
const BackButton = styled.button`
  padding: 14px 28px;
  border: 1px solid #cbd5e1;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  background: #fff;
  &:hover {
    background: #f8fafc;
  }
`;
const BookButton = styled.button`
  flex: 1;
  padding: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(44, 100, 128, 0.2);
  }
  transition: all 0.2s;
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 120px;
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;
