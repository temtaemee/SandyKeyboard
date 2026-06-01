// src/features/user/reservation/pages/SpaceDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../../app/api/axios'; // 공통 axios 인스턴스 사용

function SpaceDetailPage() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpaceDetail() {
      try {
        const response = await api.get(`/public/space/${spaceId}`);
        setSpace(response.data);
      } catch (err) {
        console.error('공간 상세 조회 오류:', err);
        alert('존재하지 않거나 비공개된 공간입니다.');
        navigate('/resv/destination');
      } finally {
        setLoading(false);
      }
    }
    fetchSpaceDetail();
  }, [spaceId, navigate]);

  if (loading)
    return <LoadingText>공간 정보를 불러오는 중입니다...</LoadingText>;
  if (!space) return null;

  return (
    <Wrapper>
      <Container>
        {/* 상단 공간 메인 배너 */}
        <MainVisual>
          {space.thumbnailUrl ? (
            <img src={space.thumbnailUrl} alt={space.name} />
          ) : (
            <NoImage>No Image Provided</NoImage>
          )}
          <AreaBadge>{space.area}</AreaBadge>
        </MainVisual>

        {/* 공간 상세 명세 */}
        <ContentSection>
          <SpaceName>{space.name}</SpaceName>
          <SpaceSummary>{space.summary}</SpaceSummary>
          <Divider />
          <DescriptionBlock>
            <SectionTitle>공간 소개</SectionTitle>
            <DescText>{space.description}</DescText>
          </DescriptionBlock>
          <InfoGrid>
            <InfoItem>
              <strong>📍 주소:</strong> {space.address1} {space.address2}
            </InfoItem>
            <InfoItem>
              <strong>📞 연락처:</strong> {space.phone}
            </InfoItem>
            <InfoItem>
              <strong>✉️ 이메일:</strong> {space.email}
            </InfoItem>
          </InfoGrid>
        </ContentSection>

        {/* 하단 연동 숙소(Stay) 목록 섹션 */}
        <StaySection>
          <SectionTitle>🏡 예약 가능한 숙소 유형</SectionTitle>
          {!space.stays || space.stays.length === 0 ? (
            <EmptyText>현재 등록된 숙소 유형이 없습니다.</EmptyText>
          ) : (
            <StayGrid>
              {space.stays.map((stay) => (
                <StayCard
                  key={stay.id}
                  onClick={() => navigate(`/resv/stay/${stay.id}`)}
                >
                  <StayImgBox>
                    {/* 숙소 DTO 내부의 pictures 배열 중 첫 번째 메인 이미지를 썸네일로 활용 */}
                    {stay.pictures && stay.pictures.length > 0 ? (
                      <img src={stay.pictures[0].filePath} alt={stay.name} />
                    ) : (
                      <NoImage>No Room Image</NoImage>
                    )}
                  </StayImgBox>
                  <StayCardBody>
                    <StayName>{stay.name}</StayName>
                    <StayInfo>
                      {/* 💡 [수정] 백엔드 명세 변수(capacity, maxCapa)로 정확히 매핑 변경 */}
                      기준 인원: {stay.capacity}명 / 최대 인원: {stay.maxCapa}명
                    </StayInfo>
                    <StayPriceRow>
                      <PriceLabel>평일(월) 1박 기준</PriceLabel>
                      <PriceValue>
                        {/* 💡 [수정] basePrice 대신 DTO 명세에 있는 monPrice를 연동하여 출력 */}
                        ₩{stay.monPrice?.toLocaleString()}
                      </PriceValue>
                    </StayPriceRow>
                  </StayCardBody>
                </StayCard>
              ))}
            </StayGrid>
          )}
        </StaySection>
      </Container>
    </Wrapper>
  );
}

export default SpaceDetailPage;

/* ========================================================================= */
/* Styled Components 정의부 (기존 UI 디자인 토큰 규격 완벽히 유지) */
/* ========================================================================= */
const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  padding: 50px 24px;
`;
const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;
const MainVisual = styled.div`
  width: 100%;
  height: 400px;
  background: ${({ theme }) => theme.colors.borderLight};
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const AreaBadge = styled.span`
  position: absolute;
  bottom: 20px;
  left: 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 13px;
`;
const ContentSection = styled.div`
  padding: 40px;
`;
const SpaceName = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
`;
const SpaceSummary = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMid};
  margin-top: 8px;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  margin: 24px 0;
`;
const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 16px;
`;
const DescriptionBlock = styled.div`
  margin-bottom: 30px;
`;
const DescText = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.7;
  white-space: pre-wrap;
`;
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  background: ${({ theme }) => theme.colors.bgSection};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.sm};
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const InfoItem = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  strong {
    color: ${({ theme }) => theme.colors.textDark};
  }
`;
const StaySection = styled.div`
  padding: 0 40px 40px 40px;
`;
const StayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const StayCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;
const StayImgBox = styled.div`
  width: 100%;
  height: 180px;
  background: #edf2f7;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StayCardBody = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const StayName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
`;
const StayInfo = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
const StayPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const PriceLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
const PriceValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.number};
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
  font-size: 14px;
`;
const EmptyText = styled.p`
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
  padding: 30px 0;
`;
