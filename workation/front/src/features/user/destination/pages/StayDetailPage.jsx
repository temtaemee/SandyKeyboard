// src/features/user/destination/pages/StayDetailPage.jsx

import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { ko } from 'date-fns/locale';

import { getBookedDates } from '../../reservation/api/reservationApi';

import useDestination from './../hooks/useDestination';
import useAuth from './../../../member/hooks/useAuth';

// =========================================================================

// 1. STYLED COMPONENTS (함수 정의보다 먼저 위치해야 함)

// =========================================================================

const Wrapper = styled.div`
  width: 100%;

  min-height: 100vh;

  background: #f8fafc;

  padding: 60px 24px;

  display: flex;

  align-items: center;
`;

const Container = styled.div`
  max-width: 900px;

  width: 100%;

  margin: 0 auto;

  background: #fff;

  border-radius: 20px;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);

  overflow: hidden;
`;

const LoadingText = styled.div`
  text-align: center;

  padding: 120px;

  font-size: 16px;

  color: #64748b;

  font-weight: 500;
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

  border: 2px solid ${(props) => (props.active ? '#3f6971' : 'transparent')};

  opacity: ${(props) => (props.active ? '1' : '0.5')};

  transition: all 0.2s;

  img {
    width: 100%;

    height: 100%;

    object-fit: cover;
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
`;

const StayTitle = styled.h2`
  font-size: 30px;

  font-weight: 800;

  color: #0f172a;
`;

const PriceTag = styled.div`
  font-size: 26px;

  font-weight: 800;

  color: #3f6971;

  small {
    font-size: 14px;

    color: #94a3b8;

    font-weight: 400;
  }
`;

const StaySummary = styled.p`
  font-size: 15px;

  color: #475569;

  margin-top: 4px;
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

const CalendarContainer = styled.div`
  display: flex;

  justify-content: center;

  margin: 30px 0;

  padding: 20px;

  background: #f8fafc;

  border-radius: 16px;

  border: 1px solid #e2e8f0;

  .react-datepicker {
    border: none;

    background: transparent;
  }

  .react-datepicker__header {
    background: transparent;

    border-bottom: none;
  }
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

  border-radius: 30px;

  background: #fff;

  font-weight: 600;

  cursor: pointer;
`;

const BookButton = styled.button`
  flex: 1;

  padding: 14px;

  background: #3f6971;

  color: #fff;

  border-radius: 30px;

  font-weight: 700;

  cursor: pointer;
`;

const InfoCardGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 16px;
`;

const CardItem = styled.div`
  background: #f8fafc;

  padding: 16px;

  border-radius: 12px;

  text-align: center;
`;

const CardLabel = styled.div`
  font-size: 12px;

  color: #94a3b8;

  margin-bottom: 4px;
`;

const CardValue = styled.div`
  font-size: 14px;

  font-weight: 700;

  color: #334155;
`;

const PriceTable = styled.div`
  width: 100%;

  border: 1px solid #e2e8f0;

  border-radius: 12px;

  overflow: hidden;
`;

const PriceRow = styled.div`
  display: grid;

  grid-template-columns: repeat(7, 1fr);

  border-bottom: 1px solid #e2e8f0;

  &:first-child {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const PriceTh = styled.div`
  padding: 10px;

  font-size: 12px;

  font-weight: 700;

  color: #64748b;
`;

const PriceTd = styled.div`
  padding: 10px;

  font-size: 13px;

  color: #334155;

  border-right: 1px solid #f1f5f9;

  &:last-child {
    border-right: none;
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

  padding: 8px 16px;

  border-radius: 8px;

  font-size: 13px;

  font-weight: 600;
`;

const DescriptionBox = styled.div`
  background: #f8fafc;

  padding: 20px;

  border-radius: 12px;

  font-size: 14px;

  line-height: 1.6;

  white-space: pre-wrap;
`;

// =========================================================================

// 2. 컴포넌트 로직

// =========================================================================

const OPTION_LABELS = {
  DESK: '💻 집중 워크 데스크',

  PRIVATE_BATHROOM: '🚿 개인 욕실',

  // ... 기타 옵션
};

function StayDetailPage() {
  const { stayId } = useParams();

  const navigate = useNavigate();

  const { currentStay: stay, loading, loadStayDetail } = useDestination();

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const [excludeDates, setExcludeDates] = useState([]);

  const SERVER_HOST = 'http://localhost:80';

  const FALLBACK_STAY =
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80';

  const { isLoggedIn } = useAuth();

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      const confirmLogin = window.confirm(
        '예약을 위해 로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?'
      );
      if (confirmLogin) {
        // 로그인 페이지로 이동 (필요 시 현재 위치를 state로 넘겨 로그인 후 돌아오게 할 수 있음)
        navigate('/login', { state: { from: `/stay/${stayId}` } });
      }
      return;
    }
    // 로그인 되어있으면 예약 페이지로 이동
    navigate(`/resv/insert/${stay.id}`);
  };

  useEffect(() => {
    async function initPageData() {
      try {
        await Promise.all([
          loadStayDetail(stayId),

          getBookedDates(stayId).then((res) => {
            const parsedDates = [];

            res.data.forEach((range) => {
              let current = new Date(range.checkin);

              const end = new Date(range.checkout);

              while (current < end) {
                parsedDates.push(new Date(current));

                current.setDate(current.getDate() + 1);
              }
            });

            setExcludeDates(parsedDates);
          }),
        ]);
      } catch (err) {
        console.error('데이터 로딩 실패:', err);

        alert('숙소 정보를 불러오지 못했습니다.');

        navigate(-1);
      }
    }

    if (stayId) initPageData();
  }, [stayId]);

  if (loading || !stay)
    return <LoadingText>숙소 정보를 불러오는 중입니다...</LoadingText>;

  const imageList =
    stay.pictures && stay.pictures.length > 0
      ? stay.pictures.map((p) =>
          p.filePath.startsWith('http')
            ? p.filePath
            : `${SERVER_HOST}${p.filePath}`
        )
      : [FALLBACK_STAY];

  return (
    <Wrapper>
      <Container>
        <MainImageArea>
          <img src={imageList[activeImgIdx]} alt={stay.name} />
        </MainImageArea>

        {imageList.length > 1 && (
          <GalleryThumbnails>
            {imageList.map((imgUrl, index) => (
              <ThumbItem
                key={index}
                active={activeImgIdx === index}
                onClick={() => setActiveImgIdx(index)}
              >
                <img src={imgUrl} alt="방 사진" />
              </ThumbItem>
            ))}
          </GalleryThumbnails>
        )}

        <InfoSection>
          <MetaHeader>
            <SpaceNameTag>🏡 {stay.spaceName || '연동 공간'}</SpaceNameTag>

            <HeaderRow>
              <StayTitle>{stay.name}</StayTitle>

              <PriceTag>
                ₩{stay.monPrice?.toLocaleString()} <small>/ 1박</small>
              </PriceTag>
            </HeaderRow>

            {stay.summary && <StaySummary>✨ {stay.summary}</StaySummary>}
          </MetaHeader>

          <Divider />

          {/* 1. 기본 이용 안내 */}

          <SectionTitle>📋 기본 이용 안내</SectionTitle>

          <InfoCardGrid>
            <CardItem>
              <CardLabel>이용 인원</CardLabel>

              <CardValue>
                기준 {stay.capacity}명 / 최대 {stay.maxCapa}명
              </CardValue>
            </CardItem>

            <CardItem>
              <CardLabel>체크인</CardLabel>

              <CardValue>{stay.checkInTime?.slice(0, 5)} 이후</CardValue>
            </CardItem>

            <CardItem>
              <CardLabel>체크아웃</CardLabel>

              <CardValue>{stay.checkOutTime?.slice(0, 5)} 이전</CardValue>
            </CardItem>
          </InfoCardGrid>

          {/* 2. 요일별 가격 정책 */}

          <SectionTitle>💰 요일별 정가 운용 안내</SectionTitle>

          <PriceTable>
            <PriceRow>
              {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                <PriceTh key={day}>{day}</PriceTh>
              ))}
            </PriceRow>

            <PriceRow>
              <PriceTd>₩{stay.monPrice?.toLocaleString()}</PriceTd>

              <PriceTd>₩{stay.tuePrice?.toLocaleString()}</PriceTd>

              <PriceTd>₩{stay.wedPrice?.toLocaleString()}</PriceTd>

              <PriceTd>₩{stay.thuPrice?.toLocaleString()}</PriceTd>

              <PriceTd>₩{stay.friPrice?.toLocaleString()}</PriceTd>

              <PriceTd>₩{stay.satPrice?.toLocaleString()}</PriceTd>

              <PriceTd>₩{stay.sunPrice?.toLocaleString()}</PriceTd>
            </PriceRow>
          </PriceTable>

          {/* 3. 옵션 정보 */}

          {stay.options && stay.options.length > 0 && (
            <>
              <SectionTitle>🛠️ 제공 옵션 및 인프라</SectionTitle>

              <OptionContainer>
                {stay.options.map((opt, idx) => (
                  <OptionBadge key={idx}>
                    {OPTION_LABELS[opt] || opt}
                  </OptionBadge>
                ))}
              </OptionContainer>
            </>
          )}

          {/* 4. 상세 소개 */}

          {stay.description && (
            <>
              <SectionTitle>📝 객실 상세 소개</SectionTitle>

              <DescriptionBox>{stay.description}</DescriptionBox>
            </>
          )}

          <SectionTitle>📅 예약 가능 일정 확인</SectionTitle>

          <CalendarContainer>
            <DatePicker
              locale={ko}
              inline
              excludeDates={excludeDates}
              minDate={new Date()}
              monthsShown={2}
            />
          </CalendarContainer>

          <ButtonRow>
            <BackButton onClick={() => navigate(-1)}>
              &larr; 이전 공간으로
            </BackButton>

            <BookButton onClick={handleBookingClick}>
              ⚡ 즉시 예약 및 결제하기
            </BookButton>
          </ButtonRow>
        </InfoSection>
      </Container>
    </Wrapper>
  );
}

export default StayDetailPage;
