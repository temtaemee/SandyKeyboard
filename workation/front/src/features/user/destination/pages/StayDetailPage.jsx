// src/features/user/reservation/pages/StayDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../../app/api/axios'; // 💡 공통 axios 인스턴스 사용

function StayDetailPage() {
  const { stayId } = useParams();
  const navigate = useNavigate();
  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStayDetail() {
      try {
        // 💡 axios.js 공통 인터셉터 규격에 부합하게 패스를 할당합니다.
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

  // 💡 예약 버튼 클릭 시 유저 토큰 권한 유효성 판단 Guard 함수
  const handleBookClick = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert(
        '🔒 예약 기능은 회원 전용 서비스입니다. 로그인 페이지로 이동합니다.'
      );

      // 로그인 성공 후 유저가 다시 이 숙소 상세 정보로 복귀하도록 현재 URL 주소를 스토리지에 저장
      localStorage.setItem('redirectUrl', window.location.pathname);

      navigate('/login');
      return;
    }

    // 정상 로그인 유저만 중첩 라우터 규칙(/resv/insert)에 맞추어 통과
    navigate(`/resv/insert/${stay.id}`);
  };

  if (loading)
    return <LoadingText>숙소 정보를 불러오는 중입니다...</LoadingText>;
  if (!stay) return null;

  return (
    <Wrapper>
      <Container>
        <MainImageArea>
          {/* 💡 [수정] DTO 명세에 맞추어 pictures 배열의 첫 번째 이미지를 메인 비주얼로 활용 */}
          {stay.pictures && stay.pictures.length > 0 ? (
            <img src={stay.pictures[0].filePath} alt={stay.name} />
          ) : (
            <NoImage>No Image Available</NoImage>
          )}
        </MainImageArea>

        <InfoSection>
          <HeaderRow>
            <StayTitle>{stay.name}</StayTitle>
            <PriceTag>
              {/* 💡 [수정] DTO 명세의 monPrice를 기준으로 1박 가격 맵핑 */}₩
              {stay.monPrice?.toLocaleString()} <small>/ 평일 1박</small>
            </PriceTag>
          </HeaderRow>
          <Divider />

          <DetailGrid>
            <GridItem>
              {/* 💡 [수정] basePeople/maxPeople을 백엔드 변수 capacity/maxCapa로 변경 */}
              <strong>인원 설정:</strong> 기준 {stay.capacity}명 / 최대{' '}
              {stay.maxCapa}명
            </GridItem>
            <GridItem>
              <strong>주말(토) 요금:</strong> 1인당 ₩
              {stay.satPrice?.toLocaleString()}
            </GridItem>
            {stay.summary && (
              <GridItem>
                <strong>숙소 요약:</strong> {stay.summary}
              </GridItem>
            )}
          </DetailGrid>

          <ButtonRow>
            <BackButton onClick={() => navigate(-1)}>
              &larr; 이전 공간으로
            </BackButton>
            <BookButton onClick={handleBookClick}>
              ⚡ 이 숙소 예약하기
            </BookButton>
          </ButtonRow>
        </InfoSection>
      </Container>
    </Wrapper>
  );
}

export default StayDetailPage;

/* ========================================================================= */
/* Styled Components 디자인 정의 */
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
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
  overflow: hidden;
`;
const MainImageArea = styled.div`
  width: 100%;
  height: 350px;
  background: #edf2f7;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const InfoSection = styled.div`
  padding: 40px;
`;
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const StayTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
`;
const PriceTag = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.number};
  small {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  margin: 20px 0;
`;
const DetailGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: ${({ theme }) => theme.colors.bgSection};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-bottom: 30px;
`;
const GridItem = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textMid};
  strong {
    color: ${({ theme }) => theme.colors.textDark};
  }
`;
const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;
const BackButton = styled.button`
  padding: 14px 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
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
  }
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 100px;
  font-size: 16px;
  color: #64748b;
`;
const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e0;
`;
